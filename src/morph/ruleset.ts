import { Artifact, GOOD } from "@/good/good_spec";
import { ActionDefinitionType, actionDefinitionsByType } from "./actions";
import { filterDefinitionsByType } from "./filters";
import { Rule, validateRule } from "./rule";
import {
  ValidationError,
  ValidationErrorDetail,
  ValidationResult,
  ValidationSuccess,
  createError,
  createSuccess,
  isBlankString,
  isNotBlankString,
  isRecord,
} from "./validation";

export type Ruleset = {
  name: string;
  rules: Rule[];
};

function composePredicatesInOr<PredicateInput>(
  predicates: ((predicateInput: PredicateInput) => boolean)[]
) {
  return (predicateInput: PredicateInput) =>
    predicates.some((predicate) => predicate(predicateInput));
}

function createPredicateFromFilters(filters: Array<Rule["filter"]>) {
  const predicates = filters.map((filter) => {
    const filterType = filter.type;
    // TODO fix this cast
    const filterDef =
      filterDefinitionsByType[filterType as "equippingCharacter"]!;
    return filterDef.predicateFactory(filter);
  });
  return composePredicatesInOr(predicates);
}

function createMutationFromActions(inputActions: Array<Rule["action"]>) {
  const mutations = inputActions.map((action) => {
    const actionType = action.type;
    // TODO: fix this cast
    const actionDef =
      actionDefinitionsByType[actionType as ActionDefinitionType];
    return actionDef.mutationFactory(action);
  });

  return (artifact: Artifact) =>
    mutations.reduce(
      (artifact, mutation) => {
        artifact = mutation(artifact);
        return artifact;
      },
      { ...artifact }
    );
}

export function validateRuleset(ruleset: unknown): ValidationResult<Ruleset> {
  if (!isRecord(ruleset))
    return createError([
      {
        cause: "notAnObject",
      },
    ]);

  const validationErrors: ValidationErrorDetail[] = [];

  const { name: rulesetName, rules } = ruleset;

  if (rulesetName == undefined) {
    validationErrors.push({
      cause: "missingRulesetName",
    });
  } else if (typeof rulesetName != "string" && typeof rulesetName != "number") {
    validationErrors.push({
      cause: "invalidRulesetName",
    });
  } else if (typeof rulesetName === "string" && isBlankString(rulesetName)) {
    validationErrors.push({
      cause: "missingRulesetName",
    });
  }

  if (rules == undefined) {
    validationErrors.push({
      cause: "missingRules",
    });
  } else if (typeof rules != "object" || !Array.isArray(rules)) {
    validationErrors.push({
      cause: "invalidRules",
    });
  } else {
    const rulesArray = rules as unknown[];

    if (rulesArray.length === 0) {
      validationErrors.push({
        cause: "missingRules",
      });
    }
    const rulesValidation = rulesArray.map(validateRule);

    rulesValidation
      .filter((validation): validation is ValidationError => validation.failed)
      .flatMap((validation) => validation.errors)
      .forEach((errorDetail) => validationErrors.push(errorDetail));
  }

  if (validationErrors.length > 0) {
    return createError(validationErrors);
  }

  const rulesArray = rules as unknown[];
  const rulesValidation = rulesArray.map(
    validateRule
  ) as ValidationSuccess<Rule>[];

  return createSuccess({
    name: String(rulesetName),
    rules: rulesValidation.map((validated) => validated.sanitized),
  });
}

export function applyRuleset(ruleset: Ruleset, good: GOOD): GOOD {
  // TODO: Validate ruleset?

  // Exit early in case of no artifacts...
  if (good.artifacts === undefined) {
    return good;
  }

  console.time("applyRuleset");

  const { rules } = ruleset;
  const editedGood = {
    ...good,
  };

  const artifacts = editedGood.artifacts!;

  const composedFilter = createPredicateFromFilters(
    rules.map((rule) => rule.filter)
  );

  const composedMutation = createMutationFromActions(
    rules.map((rule) => rule.action)
  );

  // artifacts.filter((art) => art.location === "Yelan").forEach(console.log);

  for (let i = 0; i < artifacts.length; i++) {
    const ogArtifact = artifacts[i];
    // TODO: very WIP code...
    if (composedFilter(ogArtifact)) {
      const newArtifact = composedMutation(ogArtifact);
      artifacts[i] = newArtifact;
    }
  }

  // console.log("editedGood", editedGood);

  console.timeEnd("applyRuleset");
  const stats = {
    rules: ruleset.rules.length,
    goodFile: good.artifacts.length,
  };
  console.log("stats", stats);
  return editedGood;
}

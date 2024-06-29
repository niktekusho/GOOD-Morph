import { GOOD } from "@/good/good_spec";
import {
  ActionDefinitionType,
  ActionInstance,
  actionDefinitionsByType,
} from "./actions";
import { FilterInstance, filterDefinitionsByType } from "./filters";
import { Rule, createRuleFunction, validateRule } from "./rule";
import {
  ValidationError,
  ValidationErrorDetail,
  ValidationResult,
  ValidationSuccess,
  createError,
  createSuccess,
  isBlankString,
  isRecord,
} from "./validation";

export type Ruleset = {
  name: string;
  rules: Rule[];
};

function createPredicate(filter: FilterInstance) {
  const filterType = filter.type;
  // TODO fix this cast
  const filterDef =
    filterDefinitionsByType[filterType as "equippingCharacter"]!;
  return filterDef.predicateFactory(filter);
}

function createMutation(action: ActionInstance) {
  const actionType = action.type;
  // TODO: fix this cast
  const actionDef = actionDefinitionsByType[actionType as ActionDefinitionType];
  return actionDef.mutationFactory(action);
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

// Higher-order function to combine multiple functions
function combineFunctions<T>(functions: ((data: T) => T)[]) {
  return function (obj: T) {
    return functions.reduce((acc, fn) => fn(acc), obj);
  };
}

export function applyRuleset(ruleset: Ruleset, good: GOOD): GOOD {
  // TODO: Validate ruleset?

  // Exit early in case of no artifacts...
  if (good.artifacts === undefined) {
    return good;
  }

  const { rules } = ruleset;

  const ruleFns = rules.map((rule) => createRuleFunction(rule));

  const combinedFn = combineFunctions(ruleFns);

  const editedGood = clone(good);

  const artifacts = editedGood.artifacts!;

  // artifacts.filter((art) => art.location === "Yelan").forEach(console.log);

  for (let i = 0; i < artifacts.length; i++) {
    const ogArtifact = artifacts[i];
    artifacts[i] = combinedFn(ogArtifact);
  }

  // console.log("editedGood", editedGood);

  const stats = {
    rules: ruleset.rules.length,
    goodFile: good.artifacts.length,
  };
  console.log("stats", stats);
  return editedGood;
}

/**
 * From a local bench, recursive seems to be faster than the iterative solution...
 * @param value Object to clone
 * @returns Cloned value
 */
function clone<T>(value: T): T {
  // Handle primitive types and functions directly
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  // Handle Array
  if (Array.isArray(value)) {
    return value.map((item) => clone(item)) as T;
  }

  // Handle Object
  if (value instanceof Object) {
    const copy: { [key: string]: any } = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        copy[key] = clone(value[key]);
      }
    }
    return copy as T;
  }

  throw new Error(`Unsupported type: ${typeof value}`);
}

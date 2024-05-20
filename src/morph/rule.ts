import { type Artifact } from "@/good/good_spec";
import {
  ActionDefinitionType,
  ActionInstance,
  actionDefinitionsByType,
  validateActionInstance,
} from "./actions";
import {
  FilterInstance,
  filterDefinitionsByType,
  validateFilterInstance,
} from "./filters";
import {
  ValidationErrorDetail,
  ValidationResult,
  ValidationSuccess,
  createError,
  isRecord,
  createSuccess,
} from "./validation";

export type Rule = {
  id: number;
  name?: string;
  action: ActionInstance;
  filter: FilterInstance;
};

export function validateRule(rule: unknown): ValidationResult<Rule> {
  if (rule === undefined) throw new TypeError("Rule can't be undefined.");

  if (rule === null) throw new TypeError("Rule can't be null.");

  if (!isRecord(rule)) {
    return createError([
      {
        cause: "notAnObject",
      },
    ]);
  }

  let ruleValidationErrorDetails: ValidationErrorDetail[] = [];

  const id = rule["id"];

  if (typeof id !== "number") {
    ruleValidationErrorDetails.push({ cause: "invalidOrMissingId" });
  }

  const actionInstanceValidation = validateActionInstance(rule["action"]);

  if (actionInstanceValidation.failed) {
    ruleValidationErrorDetails = ruleValidationErrorDetails.concat(
      actionInstanceValidation.errors
    );
  }

  const filterInstanceValidation = validateFilterInstance(rule["filter"]);

  if (filterInstanceValidation.failed) {
    ruleValidationErrorDetails = ruleValidationErrorDetails.concat(
      filterInstanceValidation.errors
    );
  }

  // The name of a rule is not mandatory, but if it's present it must be a string or a number.
  // We want to allow for "one time" use of the tool when you just define
  // which artifacts to target and what to do with them without additional overhead.
  // IMPORTANT: if a name is present, it should be maintained in the sanitized version.
  const name = rule["name"];

  if (
    name != undefined &&
    typeof name !== "string" &&
    typeof name !== "number"
  ) {
    ruleValidationErrorDetails.push({ cause: "invalidRuleName" });
  }

  if (ruleValidationErrorDetails.length > 0) {
    return createError(ruleValidationErrorDetails);
  }

  const sanitizedRule: Rule = {
    id: id as number,
    action: (actionInstanceValidation as ValidationSuccess<ActionInstance>)
      .sanitized,
    filter: (filterInstanceValidation as ValidationSuccess<FilterInstance>)
      .sanitized,
  };

  if (name) {
    sanitizedRule.name = "" + name;
  }

  return createSuccess(sanitizedRule);
}

export function createRuleFunction(rule: Rule) {
  const { action, filter } = rule;

  const filterType = filter.type;
  // TODO fix this cast
  const filterDef =
    filterDefinitionsByType[filterType as "equippingCharacter"]!;
  const predicate = filterDef.predicateFactory(filter);

  const actionType = action.type;
  // TODO: fix this cast
  const actionDef = actionDefinitionsByType[actionType as ActionDefinitionType];
  const mutation = actionDef.mutationFactory(action);

  return (artifact: Artifact) => {
    if (predicate(artifact)) return mutation(artifact);
    return artifact;
  };
}

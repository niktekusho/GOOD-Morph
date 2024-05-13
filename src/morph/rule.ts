import { validateActionInstance } from "./actions";
import { validateFilterInstance } from "./filters";
import {
  ValidationErrorDetail,
  ValidationResult,
  ValidationSuccess,
  createError,
  isRecord,
  createSuccess,
} from "./validation";

export function validateRule(rule: unknown): ValidationResult {
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

  if (ruleValidationErrorDetails.length > 0) {
    return createError(ruleValidationErrorDetails);
  }

  const sanitizedRule: Record<string, unknown> = {
    action: (actionInstanceValidation as ValidationSuccess).sanitized,
    filter: (filterInstanceValidation as ValidationSuccess).sanitized,
  };

  // The name of a rule is not mandatory:
  // we want to allow for "one time" use of the tool when you just define
  // which artifacts to target and what to do with them without additional overhead.
  // IMPORTANT: if a name is present, it should be maintained in the sanitized version.
  const name = rule["name"];
  if (name) {
    sanitizedRule.name = name;
  }

  return createSuccess(sanitizedRule);
}

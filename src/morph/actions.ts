import { Artifact, LocationCharacterKey } from "@/good/good_spec";

/**
 * Utility type that takes each key in an ActionDefinition parameters and assign that key to a new broader value type.
 */
type MutationParamUtil<Params extends Record<string, unknown>> = {
  [K in keyof Params]: string | number;
};

/**
 * TypeScript type inferred from the related Typebox type.
 */
type ActionType = "equip" | "unequip";

/**
 * ActionDefinition type.
 *
 * Both generics are used to narrow down the "type" of the action and it's parameters.
 *
 * Since ActionDefinitions are provided by core there's no need for runtime validation,
 * which means we can only create TypeScript types (for intellisense purposes).
 */
type ActionDefinition<Params extends Record<string, unknown> | undefined> = {
  type: ActionType;
  parameters?: Params;
  mutationFactory: Params extends Record<string, unknown>
    ? (param: MutationParamUtil<Params>) => (artifact: Artifact) => Artifact
    : () => (artifact: Artifact) => Artifact;
  validateActionInstance: (
    actionInstance: Record<string, unknown>
  ) => ValidationResult;
};

/**
 * Helper function that allows the creation of an ActionDefinition with strict TypeScript inference.
 *
 * @param type Type of the action.
 * @param parameters Optional parameters that the action requires.
 * @param mutationFactory Function that returns the mutation function. The mutation function can potentially run on every artifact found in the GOOD file.
 * @param validateActionInstance Function that returns a validation result.
 * @returns Action definition.
 */
function createAction<
  Params extends Record<string, unknown> | undefined = undefined
>(
  type: ActionType,
  mutationFactory: ActionDefinition<Params>["mutationFactory"],
  validateActionInstance: ActionDefinition<Params>["validateActionInstance"],
  parameters?: Params
): ActionDefinition<Params> {
  return { type, parameters, mutationFactory, validateActionInstance };
}

/**
 * ActionDefinition that allows the user to unequip an artifact.
 */
const unequipArtifactAction = createAction(
  "unequip",
  () => (artifact) => {
    artifact.location = "";
    return artifact;
  },
  (actionInstance) =>
    actionInstance["type"] === "unequip"
      ? {
          failed: false,
          valid: true,
          sanitized: {
            type: "unequip",
          },
        }
      : {
          failed: true,
          valid: false,
          errors: [
            {
              cause: "notUnequipAction",
            },
          ],
        }
);

/**
 * ActionDefinition that allows the user to equip an artifact to any character in Genshin.
 */
const equipArtifactAction = createAction(
  "equip",
  ({ to }) =>
    (artifact) => {
      // TODO: would be very very nice if we could not cast the key like this...
      artifact.location = to as LocationCharacterKey;
      return artifact;
    },
  (actionInstance) => {
    const to = actionInstance["to"];
    return actionInstance["type"] === "equip" &&
      typeof to === "string" &&
      isNotBlankString(to)
      ? success({ type: "equip", to: to.trim() })
      : error([
          {
            cause: "missingToProperty",
          },
        ]);
  },
  {
    to: "all_characters",
  } as const
);

export const actionDefinitionsByType = {
  equip: equipArtifactAction,
  unequip: unequipArtifactAction,
} as const;

/**
 * List of available ActionDefinitions.
 */
export const actionDefinitions = Object.values(actionDefinitionsByType);

export type Actions = typeof actionDefinitionsByType;

type ValidationSuccess = {
  failed: false;
  valid: true;
  sanitized: unknown;
};

function success(sanitized: unknown): ValidationSuccess {
  return {
    failed: false,
    sanitized,
    valid: true,
  };
}

function error(errors: ValidationErrorDetail[]): ValidationError {
  return {
    failed: true,
    valid: false,
    errors,
  };
}

type ValidationError = {
  failed: true;
  valid: false;
  errors: ValidationErrorDetail[];
};

type ValidationResult = ValidationError | ValidationSuccess;

type ValidationErrorDetail = {
  cause: string;
};

function isObject(arg: unknown): arg is Record<string, unknown> {
  return arg != null && typeof arg === "object" && !Array.isArray(arg);
}

function isNotBlankString(str: string) {
  return str.trim().length > 0;
}

export function validateActionInstance(
  actionInstance: unknown
): ValidationResult {
  if (actionInstance === null)
    throw new TypeError("Action instance can't be null.");

  if (actionInstance === undefined)
    throw new TypeError("Action instance can't be undefined.");

  if (!isObject(actionInstance))
    return {
      errors: [
        {
          cause: "notAnObject",
        },
      ],
      failed: true,
      valid: false,
    };

  // Let's override TypeScript here...
  // We don't really care if the value of the action instance is *really* a string or not.
  // What matters is that the value of it can be found in our action definitions.
  const actionInstanceType = actionInstance["type"] as string | undefined;

  if (actionInstanceType === undefined) {
    return error([{ cause: "missingActionType" }]);
  }

  const actionDef = (
    actionDefinitionsByType as Record<
      string,
      Actions[keyof Actions] | undefined
    >
  )[actionInstanceType];

  if (actionDef === undefined) {
    return error([{ cause: "unrecognizedActionType" }]);
  }

  return actionDef.validateActionInstance(actionInstance);
}

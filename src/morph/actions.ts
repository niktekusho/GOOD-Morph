import { Artifact, LocationCharacterKey } from "@/good/good_spec";
import {
  ValidationResult,
  isNotBlankString,
  createSuccess,
  isRecord,
  createError,
} from "./validation";

/**
 * Action Definition type.
 */
export type ActionDefinitionType = "equip" | "unequip";

/**
 * ActionDefinition type.
 *
 * Both generics are used to narrow down the "type" of the action and it's parameters.
 *
 * Since ActionDefinitions are provided by core there's no need for runtime validation,
 * which means we can only create TypeScript types (for intellisense purposes).
 */
type ActionDefinition<
  Type extends ActionDefinitionType,
  Params extends Record<string, unknown> | undefined
> = {
  type: Type;
  parameters?: Params;
  mutationFactory: (
    actionInstance?: ActionInstance
  ) => (artifact: Artifact) => Artifact;
  validateActionInstance: (
    actionInstance: Record<string, unknown>
  ) => ValidationResult<ActionInstance>;
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
  Type extends ActionDefinitionType,
  Params extends Record<string, unknown> | undefined = undefined
>(
  type: Type,
  mutationFactory: ActionDefinition<Type, Params>["mutationFactory"],
  validateActionInstance: ActionDefinition<
    Type,
    Params
  >["validateActionInstance"],
  parameters?: Params
): Readonly<ActionDefinition<Type, Params>> {
  return Object.freeze({
    type,
    parameters,
    mutationFactory,
    validateActionInstance,
  });
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
  (actionInstance) => (artifact) => {
    // actionInstance here should be a valid object
    // TODO: would be very very nice if we could not cast the key like this...
    artifact.location = actionInstance!.to as LocationCharacterKey;
    return artifact;
  },
  (actionInstance) => {
    const to = actionInstance["to"];
    return actionInstance["type"] === "equip" &&
      typeof to === "string" &&
      isNotBlankString(to)
      ? createSuccess({ type: "equip", to: to.trim() })
      : createError([
          {
            cause: "missingToProperty",
          },
        ]);
  },
  {
    to: "all_characters",
  } as const
);

/**
 * Immutable object where the keys are the types of the available
 * Action Definitions and the values are the corresponding Action Definition themselves.
 */
export const actionDefinitionsByType = Object.freeze({
  equip: equipArtifactAction,
  unequip: unequipArtifactAction,
});

/**
 * List of available Action Definitions.
 */
export const actionDefinitions = Object.freeze(
  Object.values(actionDefinitionsByType)
);

/**
 * Available Action Definitions
 */
export type ActionDefinitions = typeof actionDefinitionsByType;

/**
 * Instance of an Action
 */
export type ActionInstance = {
  type: ActionDefinitionType;
  [key: string]: unknown;
};

/**
 * Check if the passed object conforms to an Action Instance "shape".
 *
 * An Action Instance has the following characteristics:
 *
 * - it's an object
 * - must have a type property with a supported value {@link ActionDefinitionType}
 * - must conform the specific Action Definition shape {@link ActionDefinition.validateActionInstance}
 *
 * @param actionInstance Object to check.
 * @returns Validation result of the check.
 */
export function validateActionInstance(
  actionInstance: unknown
): ValidationResult<ActionInstance> {
  if (actionInstance === null || actionInstance === undefined)
    return createError([
      {
        cause: "missingAction",
      },
    ]);

  if (!isRecord(actionInstance))
    return createError([
      {
        cause: "notAnObject",
      },
    ]);

  // Let's override TypeScript here...
  // We don't really care if the value of the action instance is *really* a string or not.
  // What matters is that the value of it can be found in our action definitions.
  const actionInstanceType = actionInstance["type"] as string | undefined;

  if (actionInstanceType === undefined) {
    return createError([{ cause: "missingActionType" }]);
  }

  const actionDef = (
    actionDefinitionsByType as Record<
      string,
      ActionDefinitions[keyof ActionDefinitions] | undefined
    >
  )[actionInstanceType];

  if (actionDef === undefined) {
    return createError([{ cause: "unrecognizedActionType" }]);
  }

  return actionDef.validateActionInstance(actionInstance);
}

import { Artifact, LocationCharacterKey } from "@/good/good_spec";
import {
  ValidationResult,
  isNotBlankString,
  createSuccess,
  isRecord,
  createError,
} from "./validation";

/**
 * Utility type that takes each key in an ActionDefinition parameters and assign that key to a new broader value type.
 */
type MutationParamUtil<Params extends Record<string, unknown>> = {
  [K in keyof Params]: string | number;
};

/**
 * TypeScript type inferred from the related Typebox type.
 */
export type ActionType = "equip" | "unequip";

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

export const actionDefinitionsByType = {
  equip: equipArtifactAction,
  unequip: unequipArtifactAction,
} as const;

/**
 * List of available ActionDefinitions.
 */
export const actionDefinitions = Object.values(actionDefinitionsByType);

export type Actions = typeof actionDefinitionsByType;

/**
 * Instance of an Action
 */
export type ActionInstance = {
  type: ActionType;
  [key: string]: unknown;
};

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
      Actions[keyof Actions] | undefined
    >
  )[actionInstanceType];

  if (actionDef === undefined) {
    return createError([{ cause: "unrecognizedActionType" }]);
  }

  return actionDef.validateActionInstance(actionInstance);
}

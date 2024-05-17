import { Artifact } from "@/good/good_spec";
import {
  ValidationResult,
  createError,
  createSuccess,
  isNotBlankString,
  isRecord,
} from "./validation";

/**
 * Instance of a Filter
 */
export type FilterInstance = {
  type: FilterDefinitionType;
  [key: string]: unknown;
};

/**
 * Filter Definition that targets an artifact equipped to a specific character.
 */
export const equippingCharacterFilterDef = Object.freeze({
  type: "equippingCharacter",
  parameters: {
    characterName: "characters_in_GOOD",
  },
  // TODO: TS magic that allows to take the parameters array and turn into an object like this
  predicateFactory: (values: FilterInstance) => (artifact: Artifact) =>
    artifact.location === values.characterName,
  validateFilterInstance: (
    instance: Record<string, unknown>
  ): ValidationResult<FilterInstance> => {
    const characterName = instance["characterName"];
    return instance["type"] === equippingCharacterFilterDef.type &&
      typeof characterName === "string" &&
      isNotBlankString(characterName)
      ? createSuccess({
          type: equippingCharacterFilterDef.type,
          characterName: characterName.trim(),
        })
      : createError([
          {
            cause: "missingCharacterNameProperty",
          },
        ]);
  },
});

/**
 * Immutable object where the keys are the types of the available
 * Filter Definitions and the values are the corresponding Filter Definition themselves.
 */
export const filterDefinitionsByType = Object.freeze({
  equippingCharacter: equippingCharacterFilterDef,
});

/**
 * Type of Filter Definition.
 */
export type FilterDefinitionType = keyof typeof filterDefinitionsByType;

/**
 * List of available FilterDefinitions.
 */
export const filterDefinitions = Object.freeze(
  Object.values(filterDefinitionsByType)
);

// TODO: Filter defs are provided by core -> no runtime validation required
// TODO: Filter "instances" come from user input/some kind of storage -> runtime validation required

/**
 * Check if the passed object conforms to a Filter Instance "shape".
 *
 * A Filter Instance has the following characteristics:
 *
 * - it's an object
 * - must have a type property with a supported value {@link FilterDefinitionType}
 * - must conform the specific Filter Definition shape (For now only {@link equippingCharacterFilterDef.validateFilterInstance})
 *
 * @param filterInstance Object to check.
 * @returns Validation result of the check.
 */
export function validateFilterInstance(
  filterInstance: unknown
): ValidationResult<FilterInstance> {
  if (filterInstance === null || filterInstance === undefined)
    return createError([
      {
        cause: "missingFilter",
      },
    ]);

  if (!isRecord(filterInstance))
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
  const filterInstanceType = filterInstance["type"] as string | undefined;

  if (filterInstanceType === undefined) {
    return createError([{ cause: "missingFilterType" }]);
  }

  const filterDef = (
    filterDefinitionsByType as Record<
      string,
      | (typeof filterDefinitionsByType)[keyof typeof filterDefinitionsByType]
      | undefined
    >
  )[filterInstanceType];

  if (filterDef === undefined) {
    return createError([{ cause: "unrecognizedFilterType" }]);
  }

  return filterDef.validateFilterInstance(filterInstance);
}

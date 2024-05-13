import { Artifact } from "@/good/good_spec";
import {
  ValidationResult,
  createError,
  isNotBlankString,
  isRecord,
  createSuccess,
} from "./validation";

/**
 *
 */
export const equippingCharacterFilterDef = {
  type: "equippingCharacter",
  parameters: {
    characterName: "characters_in_GOOD",
  },
  // TODO: TS magic that allows to take the parameters array and turn into an object like this
  predicateFactory:
    (values: { characterName: string }) => (artifact: Artifact) =>
      artifact.location === values.characterName,
  validateFilterInstance: (
    instance: Record<string, unknown>
  ): ValidationResult => {
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
} as const;

export const filterDefinitionsByType = {
  equippingCharacter: equippingCharacterFilterDef,
} as const;

/**
 * List of available FilterDefinitions.
 */
export const filterDefinitions = Object.values(filterDefinitionsByType);

// TODO: Filter defs are provided by core -> no runtime validation required
// TODO: Filter "instances" come from user input/some kind of storage -> runtime validation required

export function validateFilterInstance(
  filterInstance: unknown
): ValidationResult {
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

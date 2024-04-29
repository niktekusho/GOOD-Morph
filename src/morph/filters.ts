import { Artifact } from "@/good/good_spec";

export const equippingCharacterFilterDef = {
  type: "equipping_character",
  parameters: [
    {
      name: "characterName",
      value: "characters_in_GOOD",
    },
  ],
  // TODO: TS magic that allows to take the parameters array and turn into an object like this
  predicateFactory:
    (values: { characterName: string }) => (artifact: Artifact) =>
      artifact.location === values.characterName,
} as const;

export const filterDefs = [equippingCharacterFilterDef];

export type FilterDefs = typeof filterDefs;

type FilterDef = FilterDefs[number];

export const filterDefByName = filterDefs.reduce((previousMap, currentVal) => {
  previousMap.set(currentVal.type, currentVal);
  return previousMap;
}, new Map<string, FilterDef>());

// TODO: Filter defs are provided by core -> no runtime validation required
// TODO: Filter "instances" come from user input/some kind of storage -> runtime validation required

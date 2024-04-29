import { Artifact, LocationCharacterKey } from "@/good/good_spec";

type MutationParamUtil<Params extends Record<string, unknown>> = {
  [K in keyof Params]: string | number;
};

// TODO: find a way to make Params never/undefined in the generic type
type ActionDefinition<Type, Params extends Record<string, unknown>> = {
  type: Type;
  parameters?: Params;
  mutationFactory: (
    param: MutationParamUtil<Params>
  ) => (artifact: Artifact) => Artifact;
};

/**
 * Helper function that allows creating actions with strict TypeScript types inferred without becoming mad...
 *
 * @param type Type of the action.
 * @param parameters Optional parameters that the action requires.
 * @returns Action definition.
 */
function createAction<
  Type extends string,
  Params extends Record<string, unknown>
>(
  type: Type,
  mutationFactory: ActionDefinition<Type, Params>["mutationFactory"],
  parameters?: Params
): ActionDefinition<Type, Params> {
  return { type, parameters, mutationFactory };
}

const unequipArtifactAction = createAction("unequip", () => (artifact) => {
  artifact.location = "";
  return artifact;
});

const equipArtifactAction = createAction(
  "equip",
  ({ to }) =>
    (artifact) => {
      // TODO: would be very very nice if we could not cast the key like this...
      artifact.location = to as LocationCharacterKey;
      return artifact;
    },
  {
    to: "all_characters",
  }
);
const availableActions = [unequipArtifactAction, equipArtifactAction] as const;

export type ActionTypes = (typeof availableActions)[number]["type"];

export const actions = availableActions.reduce((prev, curr) => {
  prev[curr.type as ActionTypes] = curr;
  return prev;
}, {} as Record<string, (typeof availableActions)[number]>);

export type Actions = typeof actions;

// TODO: Action defs are provided by core -> no runtime validation required
// TODO: Action "instances" come from user input/some kind of storage -> runtime validation required

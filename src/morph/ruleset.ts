import { Artifact, GOOD } from "@/good/good_spec";
import { Rule } from "./rule";
import { filterDefByName } from "./filters";
import { actions } from "./actions";

export type Ruleset = {
  name: string;
  rules: Rule[];
};

function composePredicatesInOr<PredicateInput>(
  predicates: ((predicateInput: PredicateInput) => boolean)[]
) {
  return (predicateInput: PredicateInput) =>
    predicates.some((predicate) => predicate(predicateInput));
}

function createPredicateFromFilters(filters: Rule["filter"][]) {
  const predicates = filters.map((filter) => {
    const filterType = filter.type;
    const filterDef = filterDefByName.get(filterType)!;
    return filterDef.predicateFactory(filter.parameters);
  });
  return composePredicatesInOr(predicates);
}

function createMutationFromActions(inputActions: Rule["action"][]) {
  const mutations = inputActions.map((action) => {
    const actionType = action.type;
    const actionDef = actions[actionType];
    return actionDef.mutationFactory(action.parameters);
  });

  return (artifact: Artifact) =>
    mutations.reduce(
      (artifact, mutation) => {
        artifact = mutation(artifact);
        return artifact;
      },
      { ...artifact }
    );
}

export function applyRuleset(ruleset: Ruleset, good: GOOD): GOOD {
  // Exit early in case of no artifacts...
  if (good.artifacts === undefined) {
    return good;
  }

  console.time("applyRuleset");

  const { rules } = ruleset;
  const editedGood = {
    ...good,
  };

  const artifacts = editedGood.artifacts!;

  const composedFilter = createPredicateFromFilters(
    rules.map((rule) => rule.filter)
  );

  const composedMutation = createMutationFromActions(
    rules.map((rule) => rule.action)
  );

  // artifacts.filter((art) => art.location === "Yelan").forEach(console.log);

  // TODO: mutation in place or new array?
  for (let i = 0; i < artifacts.length; i++) {
    const ogArtifact = artifacts[i];
    // TODO: very WIP code...
    if (composedFilter(ogArtifact)) {
      const newArtifact = composedMutation(ogArtifact);
      artifacts[i] = newArtifact;
    }
  }

  console.log("editedGood", editedGood);

  console.timeEnd("applyRuleset");
  return editedGood;
}

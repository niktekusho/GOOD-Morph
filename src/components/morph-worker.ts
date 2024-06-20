import { GOOD } from "@/good/good_spec";
import { Ruleset, applyRuleset } from "@/morph/ruleset";

export type StartMorphEventData = {
  type: "startMorph";
  currentRuleset: Ruleset;
  good: GOOD;
};

export type EndMorphEventData = {
  type: "endMorph";
  blobUrl: string;
};

function startMorph(
  startMorph: Omit<StartMorphEventData, "type">
): EndMorphEventData {
  const { currentRuleset, good } = startMorph;
  const morphedRuleset = applyRuleset(currentRuleset, good);
  const blob = new Blob([JSON.stringify(morphedRuleset)], {
    type: "application/json",
  });
  return {
    type: "endMorph",
    blobUrl: URL.createObjectURL(blob),
  };
}

self.onmessage = (event: MessageEvent<StartMorphEventData>) => {
  if (event.data == null) return;

  let dataToPost = null;

  switch (event.data.type) {
    case "startMorph":
      dataToPost = startMorph(event.data);
      break;
    default:
      throw new Error(`Unsupported event type: ${event.data.type}`);
  }

  self.postMessage(dataToPost);
  // console.log('worker ' + JSON.stringify(event.data, null, 2));
};

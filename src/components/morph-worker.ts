import { GOOD } from "@/good/good_spec";
import { Ruleset, applyRuleset } from "@/morph/ruleset";

export type StartMorphEventData = {
    type: 'startMorph'
    currentRuleset: Ruleset,
    good: GOOD,
}

function startMorph(startMorph: Omit<StartMorphEventData, 'type'>) {
    const {currentRuleset, good} = startMorph;
    const result = applyRuleset(currentRuleset, good);
    self.postMessage(result);
}

self.onmessage = (event: MessageEvent<StartMorphEventData>) => {
    if (event.data == null)
        return;

    switch (event.data.type) {
        case 'startMorph':
            startMorph(event.data);
            return;
        default: throw new Error(`Unsupported event type: ${event.data.type}`)
    }

    // console.log('worker ' + JSON.stringify(event.data, null, 2));
}


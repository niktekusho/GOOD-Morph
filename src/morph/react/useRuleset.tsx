import { useEffect, useRef, useState } from "react";
import { Ruleset } from "../ruleset";
import { Rule } from "../rule";

export function useRulesets() {
  // A default ruleset is present if user has not defined one yet
  const [rulesets, setRulesets] = useState<Ruleset[]>([
    { name: "Default ruleset", rules: [] },
  ]);

  const maxId =
    rulesets
      .flatMap((ruleset) => ruleset.rules)
      .map((rule) => rule.id)
      .sort()
      .reverse()[0] ?? 0;
  const rulesIdCounter = useRef(maxId);

  const rulesetIndexesByName = rulesets.reduce((prev, curr, index) => {
    prev.set(curr.name, index);
    return prev;
  }, new Map<string, number>());
  console.log("RulesetIndexesByName", rulesetIndexesByName);

  // TODO:The default ruleset should be the last used one.
  const [currentRulesetIndex, setCurrentRulesetIndex] = useState(0);

  const setSelectedRuleset = (rulesetName: string) => {
    const rulesetIndex = rulesetIndexesByName.get(rulesetName);
    if (rulesetIndex) {
      setCurrentRulesetIndex(rulesetIndex);
    } else {
      throw new Error(`Ruleset with name "${rulesetName}" not found`);
    }
  };

  const currentRuleset = rulesets[currentRulesetIndex];

  const updateCurrentRuleset = (newRuleset: Ruleset) => {
    setRulesets((oldRulesets) => {
      const copy = [...oldRulesets];
      copy[currentRulesetIndex] = newRuleset;
      return copy;
    });
  };

  const addRuleToCurrentRuleset = (newRule: Omit<Rule, "id">) => {
    const newRuleWithId = {
      ...newRule,
      id: rulesIdCounter.current++,
    };
    const newRules = [...currentRuleset.rules, newRuleWithId];
    updateCurrentRuleset({
      ...currentRuleset,
      rules: newRules,
    });
  };

  const updateRuleInCurrentRuleset = (updatedRule: Rule) => {
    const updatedRules = [];

    for (const rule of currentRuleset.rules) {
      if (rule.id === updatedRule.id) {
        updatedRules.push(updatedRule);
      } else {
        updatedRules.push(rule);
      }
    }

    updateCurrentRuleset({
      ...currentRuleset,
      rules: updatedRules,
    });
  };

  return {
    rulesets,
    currentRuleset,
    setSelectedRuleset,
    updateCurrentRuleset,
    addRuleToCurrentRuleset,
    updateRuleInCurrentRuleset,
  };
}

export type AddRuleToCurrentRuleset = ReturnType<
  typeof useRulesets
>["addRuleToCurrentRuleset"];

export type UpdateRuleInCurrentRuleset = ReturnType<
  typeof useRulesets
>["updateRuleInCurrentRuleset"];

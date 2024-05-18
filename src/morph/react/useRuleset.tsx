import { useEffect, useRef, useState } from "react";
import { Ruleset, validateRuleset } from "../ruleset";
import { Rule } from "../rule";
import { ValidationError, ValidationSuccess } from "../validation";

function computeInitialRuleId(rulesets: Ruleset[]) {
  return (
    rulesets
      .flatMap((ruleset) => ruleset.rules)
      .map((rule) => rule.id)
      .sort()
      .reverse()[0] ?? 0
  );
}

const rulesetsLSKey = "morph.rulesets";
const oldRulesetsLSKey = "morph.oldRulesets";

export function useRulesets() {
  // A default ruleset is present if user has not defined one yet
  const [rulesets, setRulesets] = useState<Ruleset[]>([
    { name: "Default ruleset", rules: [] },
  ]);

  // On load update rulesets based on localStorage.
  useEffect(() => {
    const localStorageValue = localStorage.getItem(rulesetsLSKey);
    if (localStorageValue) {
      const existingRulesets = JSON.parse(localStorageValue);
      if (Array.isArray(existingRulesets)) {
        const rulesetValidationResults = existingRulesets.map((ruleset) =>
          validateRuleset(ruleset)
        );

        const validRulesets = rulesetValidationResults
          .filter(
            (result): result is ValidationSuccess<Ruleset> => result.valid
          )
          .map((result) => result.sanitized);
        setRulesets(validRulesets);

        // Update also the rulesetId counter based on the current valid rulesets
        rulesIdCounter.current = computeInitialRuleId(validRulesets);

        rulesetValidationResults
          .filter((result): result is ValidationError => result.failed)
          .forEach((error) =>
            console.warn(
              "Found the following errors in the persisted rulesets:",
              error
            )
          );
      } else {
        console.error(
          "Existing rulesets are not valid.\nThe app will start anew and move your existing rulesets into morph.oldRulesets."
        );
        localStorage.setItem(oldRulesetsLSKey, existingRulesets);
        localStorage.removeItem(rulesetsLSKey);
      }
    }
  }, []);

  const maxId = computeInitialRuleId(rulesets);
  const rulesIdCounter = useRef(maxId);

  const rulesetIndexesByName = rulesets.reduce((prev, curr, index) => {
    prev.set(curr.name, index);
    return prev;
  }, new Map<string, number>());
  // console.log("RulesetIndexesByName", rulesetIndexesByName);

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
    // console.log(newRuleWithId);

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

  const deleteRuleInCurrentRuleset = (deletedRule: Rule) => {
    const updatedRules = currentRuleset.rules.filter(
      (rule) => rule.id !== deletedRule.id
    );

    updateCurrentRuleset({
      ...currentRuleset,
      rules: updatedRules,
    });
  };

  const saveCurrentRuleset = () => {
    // load persisted rulesets
    const localStorageValue = localStorage.getItem(rulesetsLSKey);
    if (localStorageValue) {
      // Since rulesets exist, we need to merge.
      // In case we find any kind of validation errors, we need to stop.

      const existingRulesets = JSON.parse(localStorageValue);
      if (!Array.isArray(existingRulesets)) {
        throw new Error(
          "Found invalid rulesets: persisted rulesets are not a list."
        );
      }

      const rulesetValidationResults = existingRulesets.map((ruleset) =>
        validateRuleset(ruleset)
      );

      // If at least one ruleset is not valid, throw with the full error.
      if (rulesetValidationResults.some((result) => result.failed)) {
        const baseErrorMsg = "Found invalid rulesets:";

        const details = rulesetValidationResults
          .filter((result): result is ValidationError => result.failed)
          .flatMap((error) => error.errors)
          .map((detail) => detail.cause);

        throw new Error([baseErrorMsg, ...details].join("\n"));
      }

      const sanitizedRulesets = rulesetValidationResults.map(
        (result) => (result as ValidationSuccess<Ruleset>).sanitized
      );

      // now we need to find the corresponding index of the current ruleset.
      const currentRulesetIndex = sanitizedRulesets.findIndex(
        (ruleset) => ruleset.name === currentRuleset.name
      );

      const mergedRulesets = [...existingRulesets];

      // found the existing ruleset, we overwrite it
      if (currentRulesetIndex >= 0) {
        mergedRulesets[currentRulesetIndex] = currentRuleset;
      } else {
        // seems like a new ruleset, we add it
        mergedRulesets.push(currentRuleset);
      }

      localStorage.setItem(rulesetsLSKey, JSON.stringify(mergedRulesets));
    } else {
      // No previous rulesets found, we can save the current ruleset
      localStorage.setItem(rulesetsLSKey, JSON.stringify([currentRuleset]));
    }
  };

  const addRuleset = () => {
    // "Copy like behaviour": if 2 files have the same name, adds 1 to the newest one.
    const newRulesetIndex = rulesets.filter((ruleset) =>
      ruleset.name.trim().startsWith("New ruleset")
    ).length;

    const rulesetNameSuffix = newRulesetIndex > 0 ? ` ${newRulesetIndex}` : "";
    const newRuleset: Ruleset = {
      name: `New ruleset${rulesetNameSuffix}`,
      rules: [],
    };

    rulesets.push(newRuleset);

    setCurrentRulesetIndex(rulesets.length - 1);
  };

  return {
    rulesets,
    currentRuleset,
    setSelectedRuleset,
    updateCurrentRuleset,
    addRuleToCurrentRuleset,
    updateRuleInCurrentRuleset,
    deleteRuleInCurrentRuleset,
    saveCurrentRuleset,
    addRuleset,
  };
}

export type UseRulesetAPI = ReturnType<typeof useRulesets>;

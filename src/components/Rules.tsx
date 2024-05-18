import {
  LocationCharacterKey,
  allLocationCharacterKeys,
} from "@/good/good_spec";
import { filterDefinitions, filterDefinitionsByType } from "@/morph/filters";
import { UseRulesetAPI } from "@/morph/react/useRuleset";
import { Rule, validateRule } from "@/morph/rule";
import { X } from "lucide-react";
import { CSSProperties } from "react";
import { actionDefinitionsByType } from "../morph/actions";
import { Button } from "./ui/button";
import { Combobox, MIN_WIDTH } from "./ui/combobox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

// TODO: compare with the localized entry

export type RulesProp = {
  rules: Rule[];
  addRuleToCurrentRuleset: UseRulesetAPI["addRuleToCurrentRuleset"];
  updateRuleInCurrentRuleset: UseRulesetAPI["updateRuleInCurrentRuleset"];
  deleteRuleInCurrentRuleset: UseRulesetAPI["deleteRuleInCurrentRuleset"];
  foundCharacters: Set<LocationCharacterKey>;
};

export function Rules({
  rules,
  addRuleToCurrentRuleset,
  updateRuleInCurrentRuleset,
  deleteRuleInCurrentRuleset,
  foundCharacters,
}: RulesProp) {
  // Select artifacts by character equipped -> name
  // What to do on selected artifact

  const addNewRuleHandler = () =>
    addRuleToCurrentRuleset({
      filter: { type: "equippingCharacter" },
      name: "",
      action: { type: "equip" },
    });

  if (rules.length === 0)
    return (
      <div className="flex flex-col gap-4 mt-4">
        <h3 className="font-semibold">No rules found</h3>
        <p>
          You can start adding rules now, using either the button below or in
          the toolbar.
        </p>
        <Button className="self-center" onClick={addNewRuleHandler}>
          Add a new rule
        </Button>
      </div>
    );

  return (
    <ol className="flex flex-wrap gap-8">
      {rules.map((rule, index) => (
        <li key={index} className="min-w-[450px] flex-grow">
          <RuleCard
            foundCharacters={foundCharacters}
            existingRule={rule}
            updateRule={updateRuleInCurrentRuleset}
            onDeleteRule={deleteRuleInCurrentRuleset}
          />
        </li>
      ))}
    </ol>
  );
}

type RuleCardProps = {
  existingRule?: Rule;
  updateRule: UseRulesetAPI["updateRuleInCurrentRuleset"];
  onDeleteRule: UseRulesetAPI["deleteRuleInCurrentRuleset"];
  foundCharacters: Set<LocationCharacterKey>;
};

function characterKeyToName(characterKey: string) {
  // split the string on each position where an uppercase letter (A-Z) is followed by any character
  return characterKey.split(/(?=[A-Z])/).join(" ");
}

function RuleCard({
  existingRule,
  foundCharacters,
  updateRule,
  onDeleteRule,
}: RuleCardProps) {
  // console.log("rule", existingRule);

  const currentFilterDef = existingRule?.filter
    ? filterDefinitionsByType[existingRule.filter.type]
    : undefined;

  const currentActionDef = existingRule?.action
    ? actionDefinitionsByType[existingRule.action.type]
    : undefined;

  // console.log(existingRule?.filter.type);

  const validationResult = validateRule(existingRule);

  // console.log(validationResult);

  return (
    <div
      className={`flex flex-wrap gap-6 border ${
        validationResult.valid ? "border-green-500" : "border-red-500"
      } rounded p-4 items-center`}
    >
      <Button
        aria-label={`Delete rule ${existingRule?.name}`}
        title={`Delete rule ${existingRule?.name}`}
        variant="ghost"
        size="icon"
        className="rounded-full shrink-0 hover:bg-destructive hover:text-destructive-foreground "
        onClick={() => onDeleteRule(existingRule!)}
      >
        <X />
      </Button>
      <Label className="flex flex-col justify-center-center gap-2">
        Rule name
        <Input
          type="text"
          placeholder="My rule..."
          value={existingRule?.name}
          onChange={(e) => {
            const updatedRule = {
              ...existingRule,
              name: e.target.value,
            } as Rule;
            console.log("updatedRule", updatedRule);

            updateRule(updatedRule);
          }}
          minLength={1}
        />
      </Label>

      {/* filter */}
      <fieldset
        style={{ "--_min-col-w": MIN_WIDTH } as CSSProperties}
        className={`grid gap-2 rounded`}
      >
        <Label asChild>
          {/* TODO: this feels like a hack... grid and gap-2 SHOULD take care of this space */}
          <legend className="mb-2">Filter</legend>
        </Label>
        <div className="flex gap-2 items-center">
          {/* TODO: remove checkbox in Combobox to have behaviour similar to normal select element */}
          <Combobox
            emptyResultText="No filters matching."
            items={filterDefinitions.map((filter) => ({
              label: filter.type,
              value: filter.type,
            }))}
            placeholderText="Select filter..."
            initialValue={existingRule?.filter.type}
            onChange={(filterType) => {
              const updatedRule = {
                ...existingRule,
                filter: {
                  type: filterType,
                  parameters: {},
                },
              } as Rule;
              updateRule(updatedRule);
            }}
          />
          {/* current criteria's params */}
          {Object.entries(currentFilterDef?.parameters || {}).map(
            ([paramName, paramType]) => {
              const comboItems =
                paramType === "characters_in_GOOD"
                  ? createComboItemsForFoundCharacters(foundCharacters)
                  : [];

              return (
                <Combobox
                  key={paramName}
                  emptyResultText="No characters matching."
                  items={comboItems}
                  placeholderText="Select character..."
                  initialValue={
                    existingRule?.filter && existingRule?.filter[paramName]
                  }
                  onChange={(pickedCharacter) => {
                    const updatedRule = {
                      ...existingRule,
                      filter: {
                        type: existingRule?.filter.type,
                        characterName: pickedCharacter,
                      },
                    } as Rule;
                    updateRule(updatedRule);
                  }}
                />
              );
            }
          )}
        </div>
      </fieldset>
      {/* action */}
      <fieldset
        style={{ "--_min-col-w": MIN_WIDTH } as CSSProperties}
        className={`grid gap-2 rounded`}
      >
        <Label asChild>
          {/* TODO: this feels like a hack... grid and gap-2 SHOULD take care of this space */}
          <legend className="mb-2">Action</legend>
        </Label>
        <div className="flex gap-2 items-center">
          <Combobox
            emptyResultText="No actions matching."
            items={Object.values(actionDefinitionsByType).map((action) => ({
              label: action.type,
              value: action.type,
            }))}
            placeholderText="Select action..."
            initialValue={existingRule?.action?.type}
            onChange={(actionType) => {
              const updatedRule = {
                ...existingRule,
                action: {
                  type: actionType,
                  parameters: {},
                },
              } as Rule;
              updateRule(updatedRule);
            }}
          />
          {/* current action params */}
          {currentActionDef?.parameters?.to ? (
            <Combobox
              emptyResultText="No characters matching."
              items={createComboItemsForFoundCharacters(
                allLocationCharacterKeys
              )}
              placeholderText="Select character..."
              onChange={(character) => {
                const updatedRule = {
                  ...existingRule,
                  action: {
                    type: existingRule?.action.type,
                    to: character,
                  },
                } as Rule;
                updateRule(updatedRule);
              }}
            />
          ) : (
            <></>
          )}
        </div>
      </fieldset>
    </div>
  );
}

function createComboItemsForFoundCharacters(
  characterKeys: Set<LocationCharacterKey> | typeof allLocationCharacterKeys
) {
  const comboItems = [];

  for (const foundChar of characterKeys) {
    comboItems.push({
      // TODO: provide a localization?
      label: characterKeyToName(foundChar),
      value: foundChar,
    });
  }

  return comboItems;
}

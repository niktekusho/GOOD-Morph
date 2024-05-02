import { CSSProperties } from "react";
import { Button } from "./ui/button";
import { Combobox, MIN_WIDTH } from "./ui/combobox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  LocationCharacterKey,
  allLocationCharacterKeys,
} from "@/good/good_spec";
import { actions } from "../morph/actions";
import {
  filterDefs,
  filterDefByName as filterDefsByName,
} from "@/morph/filters";
import { Rule } from "@/morph/rule";
import { X } from "lucide-react";
import { UseRulesetAPI } from "@/morph/react/useRuleset";

// type FilterCriteria<Type extends string, Params extends Parameter[]> = {
//   type: Type;
//   parameters?: Params;
// };

// const equippingCharacterFilterCriteria: FilterCriteria<
//   "equipping_character",
//   [{ name: "character"; type: "string" }]
// > = {
//   type: "equipping_character",
//   parameters: [
//     {
//       name: "character",
//       type: "string",
//     },
//   ],
// } as const;

// type FilterInstance<T extends FilterCriteria<any, any>> = {
//   type: T["type"];
// } & {
//   [K in T["parameters"][number]["name"]]: Extract<
//     T["parameters"][number],
//     { name: K }
//   >["type"];
// };

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
      filter: { type: "", parameters: {} },
      name: "",
      action: { type: "", parameters: {} },
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
  console.log("rule", existingRule);

  const criteria = existingRule?.filter
    ? filterDefsByName.get(existingRule.filter.type)
    : undefined;

  const currentActionDef = existingRule?.action
    ? actions[existingRule.action.type]
    : undefined;

  return (
    <div className="flex flex-col gap-6 border border-slate-500 rounded p-4 pt-4 relative">
      <header className="flex justify-between items-center gap-4">
        <Label className="flex w-full items-center gap-4">
          <span className="shrink-0">Rule name</span>
          <Input
            type="ruleName"
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
        <Button
          aria-label={`Delete rule ${existingRule?.name}`}
          title={`Delete rule ${existingRule?.name}`}
          variant="ghost"
          size="icon"
          className="rounded-full shrink-0 hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => onDeleteRule(existingRule!)}
        >
          <X />
        </Button>
      </header>

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
            items={filterDefs.map((filter) => ({
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
          {criteria?.parameters?.map((p, index) => {
            const currentParamMeta = criteria?.parameters?.at(index)!;
            const comboItems =
              criteria.type === "equipping_character"
                ? createComboItemsForFoundCharacters(foundCharacters)
                : [];

            return (
              <Combobox
                key={p.name}
                emptyResultText="No characters matching."
                items={comboItems}
                placeholderText="Select character..."
                initialValue={
                  existingRule?.filter &&
                  existingRule?.filter.parameters[currentParamMeta.name]
                }
                onChange={(pickedCharacter) => {
                  const updatedRule = {
                    ...existingRule,
                    filter: {
                      type: existingRule?.filter.type,
                      parameters: {
                        characterName: pickedCharacter,
                      },
                    },
                  } as Rule;
                  updateRule(updatedRule);
                }}
              />
            );
          })}
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
            items={Object.values(actions).map((action) => ({
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
                    parameters: {
                      to: character,
                    },
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

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "vitest";
import { validateActionInstance } from "../actions";
import { validateRule } from "../rule";
import { Ruleset, applyRuleset, applyRulesetNew } from "../ruleset";
import { GOOD } from "@/good/good_spec";

test("validate 10.000 action instances", () => {
  const jsonFile = readFileSync(
    join(import.meta.dirname, "action-validation-bench-data.json"),
    "utf8"
  );
  const json = JSON.parse(jsonFile) as unknown[];

  let foundErrs = 0;

  console.time("validate 10.000 action instances");
  foundErrs = 0;

  for (const obj of json) {
    const res = validateActionInstance(obj);
    if (res?.failed) {
      foundErrs++;
    }
  }

  console.timeEnd("validate 10.000 action instances");
  console.log(`Found ${foundErrs} errors`);
});

test("validate 10.000 rules", () => {
  const jsonFile = readFileSync(
    join(import.meta.dirname, "rule-validation-bench-data.json"),
    "utf8"
  );
  const json = JSON.parse(jsonFile) as unknown[];

  let foundErrs = 0;

  console.time("validation of 10.000 rules");
  foundErrs = 0;

  for (const obj of json) {
    const res = validateRule(obj);
    if (res?.failed) {
      foundErrs++;
    }
  }

  console.timeEnd("validation of 10.000 rules");
  console.log(`Found ${foundErrs} errors`);
});

test("morph 10.000 artifacts with 100 rules", () => {
  const rulesetFile = readFileSync(
    join(import.meta.dirname, "ruleset-apply-rules-bench-data.json"),
    "utf8"
  );
  const ruleset = JSON.parse(rulesetFile) as Ruleset;

  const goodFile = readFileSync(
    join(import.meta.dirname, "ruleset-good-bench-data.json"),
    "utf8"
  );

  const good = JSON.parse(goodFile) as GOOD;

  const oldStart = Date.now();
  applyRuleset(ruleset, good);
  const oldEnd = Date.now();

  const newStart = Date.now();
  applyRulesetNew(ruleset, good);
  const newEnd = Date.now();
  
  const oldTime = oldEnd - oldStart;
  const newTime = newEnd - newStart;

  const speedup = (Math.max(newTime, oldTime)) / Math.min(newTime, oldTime);
  const stats = {
    oldTime,
    newTime,
    fastest: newTime < oldTime ? 'new' : 'old',
    speedup: `${speedup.toFixed(2)}x`
  }
  console.table(stats);
  
});

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "vitest";
import { validateActionInstance } from "../actions";
import { validateRule } from "../rule";

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

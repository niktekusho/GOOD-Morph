import { test, assert } from "vitest";
import { validateRule } from "./rule";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test("validateRule with undefined should return expected validation error", () => {
  // Arrange
  // Act
  // Assert
  assert.throws(() => validateRule(undefined), "Rule can't be undefined.");
});

test("validateRule with null should return expected validation error", () => {
  // Arrange
  // Act
  // Assert
  assert.throws(() => validateRule(null), "Rule can't be null.");
});

test("validateRule with not an object should return expected validation error", () => {
  // Arrange
  // Act
  const res = validateRule("test");

  // Assert
  assert.deepEqual(res, {
    errors: [{ cause: "notAnObject" }],
    failed: true,
    valid: false,
  });
});

test("validateRule with an array should return expected validation error", () => {
  // Arrange
  // Act
  const res = validateRule([
    {
      name: "test",
      filter: { type: "equippingCharacter", characterName: "ayaya" },
      action: { type: "unequip" },
    },
  ]);

  // Assert
  assert.deepEqual(res, {
    errors: [{ cause: "notAnObject" }],
    failed: true,
    valid: false,
  });
});

test("validateRule with an object without an id property should return expected validation error", () => {
  // Arrange
  // Act
  const res = validateRule({
    name: "test",
    filter: { type: "equippingCharacter", characterName: "ayaya" },
    action: { type: "equip", to: "ganyu" },
  });

  // Assert
  assert.deepEqual(res, {
    errors: [{ cause: "invalidOrMissingId" }],
    failed: true,
    valid: false,
  });
});

test("validateRule with an object without an action property should return expected validation error", () => {
  // Arrange
  // Act
  const res = validateRule({
    id: 1,
    name: "test",
    filter: { type: "equippingCharacter", characterName: "ayaya" },
  });

  // Assert
  assert.deepEqual(res, {
    errors: [{ cause: "missingAction" }],
    failed: true,
    valid: false,
  });
});

test("validateRule with an object without a filter property should return expected validation error", () => {
  // Arrange
  // Act
  const res = validateRule({
    id: 1,
    name: "test",
    action: { type: "unequip" },
  });

  // Assert
  assert.deepEqual(res, {
    errors: [{ cause: "missingFilter" }],
    failed: true,
    valid: false,
  });
});

test("validateRule with an object without an action and filter property should return expected validation error", () => {
  // Arrange
  // Act
  const res = validateRule({
    id: 1,
    name: "test",
  });

  // Assert
  assert.deepEqual(res, {
    errors: [{ cause: "missingAction" }, { cause: "missingFilter" }],
    failed: true,
    valid: false,
  });
});

test("validateRule with an object with action and filter properties should return validation success", () => {
  // Arrange
  // Act
  const res = validateRule({
    id: 1,
    some: "property to ignore",
    filter: { type: "equippingCharacter", characterName: "ayaya" },
    action: { type: "unequip" },
  });

  // Assert
  assert.deepEqual(res, {
    failed: false,
    valid: true,
    sanitized: {
      id: 1,
      filter: { type: "equippingCharacter", characterName: "ayaya" },
      action: { type: "unequip" },
    },
  });
});

test("validateRule with an object with name as an object, action and filter properties should return expected validation error", () => {
  // Arrange
  // Act
  const res = validateRule({
    id: 1,
    name: { a: "b" },
    filter: { type: "equippingCharacter", characterName: "ayaya" },
    action: { type: "unequip" },
  });

  // Assert
  assert.deepEqual(res, {
    failed: true,
    valid: false,
    errors: [{ cause: "invalidRuleName" }],
  });
});

test("validateRule with an object with name, action and filter properties should return validation success", () => {
  // Arrange
  // Act
  const res = validateRule({
    id: 1,
    name: "a rule",
    filter: { type: "equippingCharacter", characterName: "ayaya" },
    action: { type: "unequip" },
  });

  // Assert
  assert.deepEqual(res, {
    failed: false,
    valid: true,
    sanitized: {
      id: 1,
      name: "a rule",
      filter: { type: "equippingCharacter", characterName: "ayaya" },
      action: { type: "unequip" },
    },
  });
});

test("validation benchmark", () => {
  const jsonFile = readFileSync(
    join(import.meta.dirname, "benchmark", "rule-validation-bench-data.json"),
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

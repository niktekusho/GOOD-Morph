import { test, assert } from "vitest";
import { validateRule } from "./rule";

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

test("validateRule with an object without an action property should return expected validation error", () => {
  // Arrange
  // Act
  const res = validateRule({
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

test("validateRule with an object without an action property should return expected validation error", () => {
  // Arrange
  // Act
  const res = validateRule({
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
    some: "property to ignore",
    filter: { type: "equippingCharacter", characterName: "ayaya" },
    action: { type: "unequip" },
  });

  // Assert
  assert.deepEqual(res, {
    failed: false,
    valid: true,
    sanitized: {
      filter: { type: "equippingCharacter", characterName: "ayaya" },
      action: { type: "unequip" },
    },
  });
});

test("validateRule with an object with name, action and filter properties should return validation success", () => {
  // Arrange
  // Act
  const res = validateRule({
    name: "a rule",
    filter: { type: "equippingCharacter", characterName: "ayaya" },
    action: { type: "unequip" },
  });

  // Assert
  assert.deepEqual(res, {
    failed: false,
    valid: true,
    sanitized: {
      name: "a rule",
      filter: { type: "equippingCharacter", characterName: "ayaya" },
      action: { type: "unequip" },
    },
  });
});

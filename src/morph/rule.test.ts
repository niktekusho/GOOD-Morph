import { assert, test } from "vitest";
import { Rule, createRuleFunction, validateRule } from "./rule";
import { Artifact } from "@/good/good_spec";

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

test("createRuleFunction returns a function that takes in an artifact and returns a mutated artifact if the filter matches the artifact", () => {
  // Arrange
  const rule: Rule = {
    action: {
      type: "unequip",
    },
    filter: {
      type: "equippingCharacter",
      characterName: "KamisatoAyaka",
    },
    id: 1,
  };

  const ruleFn = createRuleFunction(rule);

  const matchingArtifact: Artifact = {
    level: 0,
    location: "KamisatoAyaka",
    lock: false,
    mainStatKey: "critDMG_",
    rarity: 5,
    setKey: "BlizzardStrayer",
    slotKey: "circlet",
    substats: [],
  };

  // Act
  const mutatedArtifact = ruleFn(matchingArtifact);

  // Assert
  assert.deepEqual(mutatedArtifact, {
    level: 0,
    location: "",
    lock: false,
    mainStatKey: "critDMG_",
    rarity: 5,
    setKey: "BlizzardStrayer",
    slotKey: "circlet",
    substats: [],
  });
});

test("createRuleFunction returns a function that takes in an artifact and returns the original artifact if the filter does not match the artifact", () => {
  // Arrange
  const rule: Rule = {
    action: {
      type: "unequip",
    },
    filter: {
      type: "equippingCharacter",
      characterName: "KamisatoAyaka",
    },
    id: 1,
  };

  const ruleFn = createRuleFunction(rule);

  const matchingArtifact: Artifact = {
    level: 0,
    location: "Barbara",
    lock: false,
    mainStatKey: "eleMas",
    rarity: 5,
    setKey: "FlowerOfParadiseLost",
    slotKey: "circlet",
    substats: [],
  };

  // Act
  const mutatedArtifact = ruleFn(matchingArtifact);

  // Assert
  assert.deepEqual(mutatedArtifact, {
    level: 0,
    location: "Barbara",
    lock: false,
    mainStatKey: "eleMas",
    rarity: 5,
    setKey: "FlowerOfParadiseLost",
    slotKey: "circlet",
    substats: [],
  });
});

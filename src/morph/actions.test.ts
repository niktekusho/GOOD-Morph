import type { Artifact, LocationCharacterKey } from "@/good/good_spec";
import { assert, test } from "vitest";
import { actionDefinitionsByType, validateActionInstance } from "./actions";

test("equipActionDef mutation factory returns function that equips an artifact to someone", () => {
  // Arrange
  const mutation = actionDefinitionsByType.equip.mutationFactory({
    to: "new character",
  });
  const artifact: Artifact = {
    setKey: "HeartOfDepth",
    rarity: 5,
    level: 20,
    slotKey: "goblet",
    mainStatKey: "hydro_dmg_",
    substats: [
      { key: "hp_", value: 4.7 },
      { key: "critDMG_", value: 14.8 },
      { key: "hp", value: 538 },
      { key: "critRate_", value: 14.4 },
    ],
    location: "Yelan",
    lock: true,
  };
  const artifactCopy = { ...artifact };

  // Act
  const newArtifact = mutation(artifactCopy);

  // Assert
  const expectedArtifact: Artifact = {
    setKey: "HeartOfDepth",
    rarity: 5,
    level: 20,
    slotKey: "goblet",
    mainStatKey: "hydro_dmg_",
    substats: [
      { key: "hp_", value: 4.7 },
      { key: "critDMG_", value: 14.8 },
      { key: "hp", value: 538 },
      { key: "critRate_", value: 14.4 },
    ],
    location: "new character" as LocationCharacterKey,
    lock: true,
  };
  assert.deepEqual(newArtifact, expectedArtifact);
});

test("unequipActionDef mutation factory returns function that unequips an artifact", () => {
  // Arrange
  const mutation = actionDefinitionsByType.unequip.mutationFactory();
  const artifact: Artifact = {
    setKey: "HeartOfDepth",
    rarity: 5,
    level: 20,
    slotKey: "goblet",
    mainStatKey: "hydro_dmg_",
    substats: [
      { key: "hp_", value: 4.7 },
      { key: "critDMG_", value: 14.8 },
      { key: "hp", value: 538 },
      { key: "critRate_", value: 14.4 },
    ],
    location: "Yelan",
    lock: true,
  };
  const artifactCopy = { ...artifact };

  // Act
  const newArtifact = mutation(artifactCopy);

  // Assert
  const expectedArtifact: Artifact = {
    setKey: "HeartOfDepth",
    rarity: 5,
    level: 20,
    slotKey: "goblet",
    mainStatKey: "hydro_dmg_",
    substats: [
      { key: "hp_", value: 4.7 },
      { key: "critDMG_", value: 14.8 },
      { key: "hp", value: 538 },
      { key: "critRate_", value: 14.4 },
    ],
    location: "",
    lock: true,
  };
  assert.deepEqual(newArtifact, expectedArtifact);
});

test("validateActionInstance with null should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateActionInstance(null);

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "missingAction",
      },
    ],
  });
});

test("validateActionInstance with undefined should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateActionInstance(undefined);

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "missingAction",
      },
    ],
  });
});

test("validateActionInstance with a non object value should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateActionInstance("test");

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "notAnObject",
      },
    ],
  });
});

test("validateActionInstance with an array should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateActionInstance([{ type: "unequip" }]);

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "notAnObject",
      },
    ],
  });
});

test("validateActionInstance with an object without type property should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateActionInstance({
    some: "properties that should be ignored",
  });

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [{ cause: "missingActionType" }],
  });
});

test("validateActionInstance with an unequip action object should return success validation result and sanitized object", () => {
  // Arrange
  // Act
  const result = validateActionInstance({
    type: "unequip",
    some: "properties that should be ignored",
  });

  // Assert
  assert.deepEqual(result, {
    failed: false,
    valid: true,
    sanitized: { type: "unequip" },
  });
});

test("validateActionInstance with an equip action object without the to property should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateActionInstance({
    type: "equip",
    some: "properties that should be ignored",
  });

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "missingToProperty",
      },
    ],
  });
});

test("validateActionInstance with an equip action object with blank to property should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateActionInstance({
    type: "equip",
    to: " ",
  });

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "missingToProperty",
      },
    ],
  });
});

test("validateActionInstance with an equip action object with a to property should return success validation result and sanitized object", () => {
  // Arrange
  // Act
  const result = validateActionInstance({
    type: "equip",
    to: " ayaya ",
  });

  // Assert
  assert.deepEqual(result, {
    failed: false,
    valid: true,
    sanitized: {
      type: "equip",
      to: "ayaya",
    },
  });
});

test("validateActionInstance with an unimplemented action type should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateActionInstance({
    type: "test",
    some: "properties that should be ignored",
  });

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "unrecognizedActionType",
      },
    ],
  });
});

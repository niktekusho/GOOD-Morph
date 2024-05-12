import { test, assert } from "vitest";
import type { Artifact } from "@/good/good_spec";
import { filterDefinitionsByType, validateFilterInstance } from "./filters";

test("equippingCharacter predicateFactory returns a function that returns true if the artifact is equipped to the specified character", () => {
  // Arrange
  const filter = filterDefinitionsByType.equippingCharacter.predicateFactory({
    characterName: "Yelan",
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

  // Act
  const artifactMatched = filter(artifact);

  // Assert
  assert.equal(artifactMatched, true);
});

test("equippingCharacter predicateFactory returns a function that returns false if the artifact is NOT equipped to the specified character", () => {
  // Arrange
  const filter = filterDefinitionsByType.equippingCharacter.predicateFactory({
    characterName: "bozo",
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

  // Act
  const artifactMatched = filter(artifact);

  // Assert
  assert.equal(artifactMatched, false);
});

test("validateFilterInstance with null should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateFilterInstance(null);

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "missingFilter",
      },
    ],
  });
});

test("validateFilterInstance with undefined should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateFilterInstance(null);

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "missingFilter",
      },
    ],
  });
});

test("validateFilterInstance with a non object value should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateFilterInstance("test");

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

test("validateFilterInstance with an array should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateFilterInstance([
    { type: "equippingCharacter", characterName: "test" },
  ]);

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

test("validateFilterInstance with an object without type property should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateFilterInstance({
    some: "properties that should be ignored",
  });

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [{ cause: "missingFilterType" }],
  });
});

test("validateFilterInstance with an object with an unrecognized type property should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateFilterInstance({
    type: "hiiii",
  });

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [{ cause: "unrecognizedFilterType" }],
  });
});

test("validateFilterInstance with an equippingFilter instance without characterName property should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateFilterInstance({
    type: "equippingCharacter",
    some: "properties that should be ignored",
  });

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [{ cause: "missingCharacterNameProperty" }],
  });
});

test("validateFilterInstance with an equippingFilter instance with a blank characterName property should return expected validation error", () => {
  // Arrange
  // Act
  const result = validateFilterInstance({
    type: "equippingCharacter",
    characterName: " ",
  });

  // Assert
  assert.deepEqual(result, {
    failed: true,
    valid: false,
    errors: [{ cause: "missingCharacterNameProperty" }],
  });
});

test("validateFilterInstance with an equippingFilter instance with a characterName property should return success result", () => {
  // Arrange
  // Act
  const result = validateFilterInstance({
    type: "equippingCharacter",
    characterName: " ayaya ",
    additional: "property",
  });

  // Assert
  assert.deepEqual(result, {
    failed: false,
    valid: true,
    sanitized: {
      type: "equippingCharacter",
      characterName: "ayaya",
    },
  });
});

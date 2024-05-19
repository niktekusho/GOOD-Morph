import { GOOD } from "@/good/good_spec";
import { assert, test } from "vitest";
import { Ruleset, applyRuleset, validateRuleset } from "./ruleset";

const GOODFile: GOOD = {
  format: "GOOD",
  source: "test",
  version: 1,
  artifacts: [
    {
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
    },
    {
      setKey: "EmblemOfSeveredFate",
      rarity: 5,
      level: 20,
      slotKey: "sands",
      mainStatKey: "hp_",
      substats: [
        { key: "enerRech_", value: 16.8 },
        { key: "atk", value: 16 },
        { key: "eleMas", value: 42 },
        { key: "critRate_", value: 8.9 },
      ],
      location: "Yelan",
      lock: true,
    },
    {
      setKey: "EmblemOfSeveredFate",
      rarity: 5,
      level: 20,
      slotKey: "circlet",
      mainStatKey: "critRate_",
      substats: [
        { key: "hp_", value: 15.7 },
        { key: "atk_", value: 10.5 },
        { key: "def_", value: 5.1 },
        { key: "critDMG_", value: 18.7 },
      ],
      location: "Yelan",
      lock: true,
    },
    {
      setKey: "EmblemOfSeveredFate",
      rarity: 5,
      level: 20,
      slotKey: "plume",
      mainStatKey: "atk",
      substats: [
        { key: "enerRech_", value: 11.7 },
        { key: "critDMG_", value: 28.8 },
        { key: "hp_", value: 4.1 },
        { key: "hp", value: 448 },
      ],
      location: "Yelan",
      lock: true,
    },
    {
      setKey: "EmblemOfSeveredFate",
      rarity: 5,
      level: 20,
      slotKey: "flower",
      mainStatKey: "hp",
      substats: [
        { key: "eleMas", value: 37 },
        { key: "critRate_", value: 3.1 },
        { key: "enerRech_", value: 21.4 },
        { key: "critDMG_", value: 7.8 },
      ],
      location: "Yelan",
      lock: true,
    },
    {
      setKey: "MarechausseeHunter",
      rarity: 5,
      level: 20,
      slotKey: "flower",
      mainStatKey: "hp",
      substats: [
        { key: "eleMas", value: 37 },
        { key: "critRate_", value: 3.1 },
        { key: "enerRech_", value: 21.4 },
        { key: "critDMG_", value: 7.8 },
      ],
      location: "Barbara",
      lock: true,
    },
  ],
};

test("applyRuleset with single rule that doesn't match should return same GOOD file", async () => {
  // Arrange
  const ruleset: Ruleset = {
    name: "test",
    rules: [
      {
        action: {
          type: "unequip",
        },
        filter: {
          parameters: {
            name: "Xingqiu",
          },
          type: "equippingCharacter",
        },
        id: 1,
        name: "test rule",
      },
    ],
  };

  // Act
  const morphedGOOD = applyRuleset(ruleset, GOODFile);

  // Assert
  assert.deepEqual(
    morphedGOOD,
    GOODFile,
    "Since the rule doesn't match, the morphed file should be the same"
  );
});

test("applyRuleset with single rule that does match should return expected morphed GOOD file", async () => {
  // Arrange
  const ruleset: Ruleset = {
    name: "test",
    rules: [
      {
        action: {
          type: "unequip",
        },
        filter: {
          characterName: "Yelan",
          type: "equippingCharacter",
        },
        id: 1,
      },
    ],
  };

  // Act
  const morphedGOOD = applyRuleset(ruleset, GOODFile);

  // Assert
  const expectedGOODFile: GOOD = {
    format: "GOOD",
    source: "test",
    version: 1,
    artifacts: [
      {
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
      },
      {
        setKey: "EmblemOfSeveredFate",
        rarity: 5,
        level: 20,
        slotKey: "sands",
        mainStatKey: "hp_",
        substats: [
          { key: "enerRech_", value: 16.8 },
          { key: "atk", value: 16 },
          { key: "eleMas", value: 42 },
          { key: "critRate_", value: 8.9 },
        ],
        location: "",
        lock: true,
      },
      {
        setKey: "EmblemOfSeveredFate",
        rarity: 5,
        level: 20,
        slotKey: "circlet",
        mainStatKey: "critRate_",
        substats: [
          { key: "hp_", value: 15.7 },
          { key: "atk_", value: 10.5 },
          { key: "def_", value: 5.1 },
          { key: "critDMG_", value: 18.7 },
        ],
        location: "",
        lock: true,
      },
      {
        setKey: "EmblemOfSeveredFate",
        rarity: 5,
        level: 20,
        slotKey: "plume",
        mainStatKey: "atk",
        substats: [
          { key: "enerRech_", value: 11.7 },
          { key: "critDMG_", value: 28.8 },
          { key: "hp_", value: 4.1 },
          { key: "hp", value: 448 },
        ],
        location: "",
        lock: true,
      },
      {
        setKey: "EmblemOfSeveredFate",
        rarity: 5,
        level: 20,
        slotKey: "flower",
        mainStatKey: "hp",
        substats: [
          { key: "eleMas", value: 37 },
          { key: "critRate_", value: 3.1 },
          { key: "enerRech_", value: 21.4 },
          { key: "critDMG_", value: 7.8 },
        ],
        location: "",
        lock: true,
      },
      {
        setKey: "MarechausseeHunter",
        rarity: 5,
        level: 20,
        slotKey: "flower",
        mainStatKey: "hp",
        substats: [
          { key: "eleMas", value: 37 },
          { key: "critRate_", value: 3.1 },
          { key: "enerRech_", value: 21.4 },
          { key: "critDMG_", value: 7.8 },
        ],
        location: "Barbara",
        lock: true,
      },
    ],
  };
  assert.deepEqual(morphedGOOD, expectedGOODFile);
});

test("applyRuleset with 2 rules that both match should return expected morphed GOOD", async () => {
  // Arrange
  const ruleset: Ruleset = {
    name: "test",
    rules: [
      {
        action: {
          type: "equip",
          to: "Xingqiu",
        },
        filter: {
          characterName: "Yelan",
          type: "equippingCharacter",
        },
        id: 1,
      },
      {
        action: {
          type: "equip",
          to: "Neuvillette",
        },
        filter: {
          characterName: "Barbara",
          type: "equippingCharacter",
        },
        id: 2,
      },
    ],
  };

  // Act
  const morphedGOOD = applyRuleset(ruleset, GOODFile);

  // Assert
  const expectedGOODFile: GOOD = {
    format: "GOOD",
    source: "test",
    version: 1,
    artifacts: [
      {
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
        location: "Xingqiu",
        lock: true,
      },
      {
        setKey: "EmblemOfSeveredFate",
        rarity: 5,
        level: 20,
        slotKey: "sands",
        mainStatKey: "hp_",
        substats: [
          { key: "enerRech_", value: 16.8 },
          { key: "atk", value: 16 },
          { key: "eleMas", value: 42 },
          { key: "critRate_", value: 8.9 },
        ],
        location: "Xingqiu",
        lock: true,
      },
      {
        setKey: "EmblemOfSeveredFate",
        rarity: 5,
        level: 20,
        slotKey: "circlet",
        mainStatKey: "critRate_",
        substats: [
          { key: "hp_", value: 15.7 },
          { key: "atk_", value: 10.5 },
          { key: "def_", value: 5.1 },
          { key: "critDMG_", value: 18.7 },
        ],
        location: "Xingqiu",
        lock: true,
      },
      {
        setKey: "EmblemOfSeveredFate",
        rarity: 5,
        level: 20,
        slotKey: "plume",
        mainStatKey: "atk",
        substats: [
          { key: "enerRech_", value: 11.7 },
          { key: "critDMG_", value: 28.8 },
          { key: "hp_", value: 4.1 },
          { key: "hp", value: 448 },
        ],
        location: "Xingqiu",
        lock: true,
      },
      {
        setKey: "EmblemOfSeveredFate",
        rarity: 5,
        level: 20,
        slotKey: "flower",
        mainStatKey: "hp",
        substats: [
          { key: "eleMas", value: 37 },
          { key: "critRate_", value: 3.1 },
          { key: "enerRech_", value: 21.4 },
          { key: "critDMG_", value: 7.8 },
        ],
        location: "Xingqiu",
        lock: true,
      },
      {
        setKey: "MarechausseeHunter",
        rarity: 5,
        level: 20,
        slotKey: "flower",
        mainStatKey: "hp",
        substats: [
          { key: "eleMas", value: 37 },
          { key: "critRate_", value: 3.1 },
          { key: "enerRech_", value: 21.4 },
          { key: "critDMG_", value: 7.8 },
        ],
        location: "Neuvillette",
        lock: true,
      },
    ],
  };
  assert.deepEqual(morphedGOOD, expectedGOODFile);
});

test("validateRuleset returns error when ruleset is not an object", () => {
  // Arrange
  // Act
  const res = validateRuleset([
    {
      name: "test",
      should: "be ignored",
      rules: [
        {
          id: 1,
          action: {
            type: "equip",
            to: "ayaya",
          },
          filter: {
            type: "equippingCharacter",
          },
        },
      ],
    },
  ]);

  // Assert
  assert.deepEqual(res, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "notAnObject",
      },
    ],
  });
});

test("validateRuleset returns error when ruleset name is blank", () => {
  // Arrange
  // Act
  const res = validateRuleset({
    name: " ",
    rules: [
      {
        id: 1,
        action: {
          type: "equip",
          to: "ayaya",
        },
        filter: {
          type: "equippingCharacter",
          characterName: "ganyu",
        },
      },
    ],
  });

  // Assert
  assert.deepEqual(res, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "missingRulesetName",
      },
    ],
  });
});

test("validateRuleset returns error when ruleset name is neither a string or a number", () => {
  // Arrange
  // Act
  const res = validateRuleset({
    name: {},
    rules: [
      {
        id: 1,
        action: {
          type: "equip",
          to: "ayaya",
        },
        filter: {
          type: "equippingCharacter",
          characterName: "ganyu",
        },
      },
    ],
  });

  // Assert
  assert.deepEqual(res, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "invalidRulesetName",
      },
    ],
  });
});

test("validateRuleset returns error when rules in ruleset is undefined", () => {
  // Arrange
  // Act
  const res = validateRuleset({
    name: "a rule",
  });

  // Assert
  assert.deepEqual(res, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "missingRules",
      },
    ],
  });
});

test("validateRuleset returns error when rules in ruleset is not an array", () => {
  // Arrange
  // Act
  const res = validateRuleset({
    name: "a rule",
    rules: {},
  });

  // Assert
  assert.deepEqual(res, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "invalidRules",
      },
    ],
  });
});

test("validateRuleset returns error when ruleset does not contain any rule", () => {
  // Arrange
  // Act
  const res = validateRuleset({
    name: "a rule",
    rules: [],
  });

  // Assert
  assert.deepEqual(res, {
    failed: true,
    valid: false,
    errors: [
      {
        cause: "missingRules",
      },
    ],
  });
});

test("validateRuleset returns success when ruleset has at least 1 rule and a name", () => {
  // Arrange
  const ruleset = {
    name: "test",
    should: "be ignored",
    rules: [
      {
        id: 1,
        action: {
          type: "equip",
          to: "ayaya",
        },
        filter: {
          type: "equippingCharacter",
          characterName: "ganyu",
        },
      },
    ],
  };

  // Act
  const res = validateRuleset(ruleset);

  // Assert
  assert.deepEqual(res, {
    failed: false,
    valid: true,
    sanitized: {
      name: "test",
      rules: [
        {
          id: 1,
          action: {
            type: "equip",
            to: "ayaya",
          },
          filter: {
            type: "equippingCharacter",
            characterName: "ganyu",
          },
        },
      ],
    },
  });
});

// @ts-check

// TODO: use objects from good_spec

const allLocationCharacterKeys = [
  "Albedo",
  "Alhaitham",
  "Aloy",
  "Amber",
  "AratakiItto",
  "Baizhu",
  "Barbara",
  "Beidou",
  "Bennett",
  "Candace",
  "Charlotte",
  "Chevreuse",
  "Chiori",
  "Chongyun",
  "Collei",
  "Cyno",
  "Dehya",
  "Diluc",
  "Diona",
  "Dori",
  "Eula",
  "Faruzan",
  "Fischl",
  "Freminet",
  "Furina",
  "Gaming",
  "Ganyu",
  "Gorou",
  "HuTao",
  "Jean",
  "KaedeharaKazuha",
  "Kaeya",
  "KamisatoAyaka",
  "KamisatoAyato",
  "Kaveh",
  "Keqing",
  "Kirara",
  "Klee",
  "KujouSara",
  "KukiShinobu",
  "Layla",
  "Lisa",
  "Lynette",
  "Lyney",
  "Mika",
  "Mona",
  "Nahida",
  "Navia",
  "Neuvillette",
  "Nilou",
  "Ningguang",
  "Noelle",
  "Qiqi",
  "RaidenShogun",
  "Razor",
  "Rosaria",
  "SangonomiyaKokomi",
  "Sayu",
  "Shenhe",
  "ShikanoinHeizou",
  "Sucrose",
  "Tartaglia",
  "Thoma",
  "Tighnari",
  "Venti",
  "Wanderer",
  "Wriothesley",
  "Xiangling",
  "Xianyun",
  "Xiao",
  "Xingqiu",
  "Xinyan",
  "YaeMiko",
  "Yanfei",
  "Yaoyao",
  "Yelan",
  "Yoimiya",
  "YunJin",
  "Zhongli",
  "Traveler",
]

const artifactSandsStatKeys = [
  "hp_",
  "def_",
  "atk_",
  "eleMas",
  "enerRech_",
]

const artifactGobletStatKeys = [
  "hp_",
  "def_",
  "atk_",
  "eleMas",
  "physical_dmg_",
  "anemo_dmg_",
  "geo_dmg_",
  "electro_dmg_",
  "hydro_dmg_",
  "pyro_dmg_",
  "cryo_dmg_",
  "dendro_dmg_",
]

const artifactCircletStatKeys = [
  "hp_",
  "def_",
  "atk_",
  "eleMas",
  "critRate_",
  "critDMG_",
  "heal_",
]

const allArtifactSetKeys = [
  "Adventurer",
  "ArchaicPetra",
  "Berserker",
  "BlizzardStrayer",
  "BloodstainedChivalry",
  "BraveHeart",
  "CrimsonWitchOfFlames",
  "DeepwoodMemories",
  "DefendersWill",
  "DesertPavilionChronicle",
  "EchoesOfAnOffering",
  "EmblemOfSeveredFate",
  "FlowerOfParadiseLost",
  "Gambler",
  "GildedDreams",
  "GladiatorsFinale",
  "GoldenTroupe",
  "HeartOfDepth",
  "HuskOfOpulentDreams",
  "Instructor",
  "Lavawalker",
  "LuckyDog",
  "MaidenBeloved",
  "MarechausseeHunter",
  "MartialArtist",
  "NighttimeWhispersInTheEchoingWoods",
  "NoblesseOblige",
  "NymphsDream",
  "OceanHuedClam",
  "PaleFlame",
  "PrayersForDestiny",
  "PrayersForIllumination",
  "PrayersForWisdom",
  "PrayersToSpringtime",
  "ResolutionOfSojourner",
  "RetracingBolide",
  "Scholar",
  "ShimenawasReminiscence",
  "SongOfDaysPast",
  "TenacityOfTheMillelith",
  "TheExile",
  "ThunderingFury",
  "Thundersoother",
  "TinyMiracle",
  "TravelingDoctor",
  "VermillionHereafter",
  "ViridescentVenerer",
  "VourukashasGlow",
  "WanderersTroupe",
]

const allArtifactSlotKeys = [
  "flower",
  "plume",
  "sands",
  "goblet",
  "circlet",
]

function random(max) {
  return Math.floor(Math.random() * max)
}

function selectRandomCharacter(excludedCharacters = []) {
  const charactersToPick = allLocationCharacterKeys.filter(char => !excludedCharacters.includes(char));
  const randomIdx = random(charactersToPick.length);
  return charactersToPick[randomIdx];
}

function createRandomArtifact(artifactId) {

  const setKey = allArtifactSetKeys[random(allArtifactSetKeys.length)]

  const level = random(20)

  const slotKey = allArtifactSlotKeys[random(allArtifactSlotKeys.length)]

  let mainStatKey;
  switch (slotKey) {
    case 'flower':
      mainStatKey = 'hp';
      break;
    case 'plume':
      mainStatKey = 'atk';
      break;
    case 'sands':
      mainStatKey = artifactSandsStatKeys[random(artifactSandsStatKeys.length)]
      break;
    case 'goblet':
      mainStatKey = artifactGobletStatKeys[random(artifactGobletStatKeys.length)]
      break;
    case 'circlet':
      mainStatKey = artifactCircletStatKeys[random(artifactCircletStatKeys.length)]
      break;
    default:
      throw new Error(`SlotKey not found: ${slotKey}`)
  }

  const location = selectRandomCharacter()

  return {
    "setKey": setKey,
    "rarity": 5,
    "level": level,
    "slotKey": slotKey,
    "mainStatKey": mainStatKey,
    "substats": [
      // { "key": "hp_", "value": 4.7 },
      // { "key": "critDMG_", "value": 14.8 },
      // { "key": "hp", "value": 538 },
      // { "key": "critRate_", "value": 14.4 }
    ],
    "location": location,
    "lock": true,
    "id": `artifact_${artifactId}`
  }
}

// Function to generate random objects
function generateRandomRule(id) {
  const actionType = Math.random() < 0.5 ? "equip" : "unequip";
  const filterCharacterName = selectRandomCharacter();

  const obj = {
    id,
    action:
      actionType === "equip"
        ? { type: "equip", to: selectRandomCharacter([filterCharacterName]) }
        : { type: "unequip" },
    filter: {
      type: "equippingCharacter",
      characterName: filterCharacterName,
    },
  };

  return obj;
}

// Generate 100 rules
const rulesToGenerate = 100
const rules = [];
for (let i = 0; i < rulesToGenerate; i++) {
  rules.push(generateRandomRule(i));
}

const ruleset = {
  name: 'bench ruleset',
  rules
}

import { writeFileSync } from "node:fs";
import { join } from "node:path";

const rulesetFilePath = join(import.meta.dirname, "ruleset-apply-rules-bench-data.json");

writeFileSync(rulesetFilePath, JSON.stringify(ruleset));

// Generate 10.000 artifacts
const artifactsToGenerate = 10_000;

const artifacts = []
for (let i = 0; i < artifactsToGenerate; i++) {
  artifacts.push(createRandomArtifact(i));
}

const goodFile = {
  format: "GOOD",
  dbVersion: 1,
  source: "Bench data",
  version: 1,
  artifacts,
}

const goodFilePath = join(import.meta.dirname, "ruleset-good-bench-data.json");

writeFileSync(goodFilePath, JSON.stringify(goodFile));

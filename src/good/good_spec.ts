export const allRarityKeys = [5, 4, 3, 2, 1] as const;
export type RarityKey = (typeof allRarityKeys)[number];
export const talentLimits = [1, 1, 2, 4, 6, 8, 10] as const;

export const allArtifactSetKeys = [
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
] as const;
export type ArtifactSetKey = (typeof allArtifactSetKeys)[number];

export const allArtifactSlotKeys = [
  "flower",
  "plume",
  "sands",
  "goblet",
  "circlet",
] as const;
export type ArtifactSlotKey = (typeof allArtifactSlotKeys)[number];

export const artMaxLevel: Record<RarityKey, number> = {
  1: 4,
  2: 4,
  3: 12,
  4: 16,
  5: 20,
} as const;

export const artSubstatRollData: Record<
  RarityKey,
  { low: number; high: number; numUpgrades: number }
> = {
  1: { low: 0, high: 0, numUpgrades: 1 },
  2: { low: 0, high: 1, numUpgrades: 2 },
  3: { low: 1, high: 2, numUpgrades: 3 },
  4: { low: 2, high: 3, numUpgrades: 4 },
  5: { low: 3, high: 4, numUpgrades: 5 },
} as const;

export const artifactSandsStatKeys = [
  "hp_",
  "def_",
  "atk_",
  "eleMas",
  "enerRech_",
] as const;
export type ArtifactSandsStatKey = (typeof artifactSandsStatKeys)[number];

export const artifactGobletStatKeys = [
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
] as const;
export type ArtifactGobletStatKey = (typeof artifactGobletStatKeys)[number];

export const artifactCircletStatKeys = [
  "hp_",
  "def_",
  "atk_",
  "eleMas",
  "critRate_",
  "critDMG_",
  "heal_",
] as const;
export type ArtifactCircletStatKey = (typeof artifactCircletStatKeys)[number];

export const artSlotMainKeys = {
  flower: ["hp"] as readonly MainStatKey[],
  plume: ["atk"] as readonly MainStatKey[],
  sands: artifactSandsStatKeys as readonly MainStatKey[],
  goblet: artifactGobletStatKeys as readonly MainStatKey[],
  circlet: artifactCircletStatKeys as readonly MainStatKey[],
} as const;

export const allMainStatKeys = [
  "hp",
  "hp_",
  "atk",
  "atk_",
  "def_",
  "eleMas",
  "enerRech_",
  "critRate_",
  "critDMG_",
  "physical_dmg_",
  "anemo_dmg_",
  "geo_dmg_",
  "electro_dmg_",
  "hydro_dmg_",
  "pyro_dmg_",
  "cryo_dmg_",
  "dendro_dmg_",
  "heal_",
] as const;
export const allSubstatKeys = [
  "hp",
  "hp_",
  "atk",
  "atk_",
  "def",
  "def_",
  "eleMas",
  "enerRech_",
  "critRate_",
  "critDMG_",
] as const;
export type MainStatKey = (typeof allMainStatKeys)[number];
export type SubstatKey = (typeof allSubstatKeys)[number];

// GO currently only support 3-5 star artifacts
export const allArtifactRarityKeys = [5, 4, 3] as const;
export type ArtifactRarity = (typeof allArtifactRarityKeys)[number];

const allArtifactSetCount = [1, 2, 3, 4, 5] as const;
export type SetNum = (typeof allArtifactSetCount)[number];

export const allAscensionKeys = [0, 1, 2, 3, 4, 5, 6] as const;
export type AscensionKey = (typeof allAscensionKeys)[number];

export const nonTravelerCharacterKeys = [
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
  "Somnia",
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
] as const;
export type NonTravelerCharacterKey = (typeof nonTravelerCharacterKeys)[number];

export const allTravelerKeys = [
  "TravelerAnemo",
  "TravelerGeo",
  "TravelerElectro",
  "TravelerDendro",
  "TravelerHydro",
] as const;
export type TravelerKey = (typeof allTravelerKeys)[number];

export const allCharacterKeys = [
  ...nonTravelerCharacterKeys,
  ...allTravelerKeys,
] as const;
export type CharacterKey = (typeof allCharacterKeys)[number];

export type CharacterTalent = {
  auto: number;
  skill: number;
  burst: number;
};

export type Character = {
  key: CharacterKey;
  level: number;
  constellation: number;
  ascension: AscensionKey;
  talent: CharacterTalent;
};

export const allWeaponTypeKeys = [
  "sword",
  "claymore",
  "polearm",
  "bow",
  "catalyst",
] as const;
export type WeaponTypeKey = (typeof allWeaponTypeKeys)[number];

export const allWeaponSwordKeys = [
  "AmenomaKageuchi",
  "AquilaFavonia",
  "BlackcliffLongsword",
  "CinnabarSpindle",
  "CoolSteel",
  "DarkIronSword",
  "DullBlade",
  "FavoniusSword",
  "FesteringDesire",
  "FilletBlade",
  "FinaleOfTheDeep",
  "FleuveCendreFerryman",
  "FreedomSworn",
  "HaranGeppakuFutsu",
  "HarbingerOfDawn",
  "IronSting",
  "KagotsurubeIsshin",
  "KeyOfKhajNisut",
  "LightOfFoliarIncision",
  "LionsRoar",
  "MistsplitterReforged",
  "PrimordialJadeCutter",
  "PrototypeRancour",
  "RoyalLongsword",
  "SacrificialSword",
  "SapwoodBlade",
  "SilverSword",
  "SkyriderSword",
  "SkywardBlade",
  "SplendorOfTranquilWaters",
  "SummitShaper",
  "SwordOfDescension",
  "SwordOfNarzissenkreuz",
  "TheAlleyFlash",
  "TheBlackSword",
  "TheDockhandsAssistant",
  "TheFlute",
  "ToukabouShigure",
  "TravelersHandySword",
  "UrakuMisugiri",
  "WolfFang",
  "XiphosMoonlight",
] as const;
export type WeaponSwordKey = (typeof allWeaponSwordKeys)[number];

export const allWeaponClaymoreKeys = [
  "Akuoumaru",
  "BeaconOfTheReedSea",
  "BlackcliffSlasher",
  "BloodtaintedGreatsword",
  "DebateClub",
  "FavoniusGreatsword",
  "FerrousShadow",
  "ForestRegalia",
  "KatsuragikiriNagamasa",
  "LithicBlade",
  "LuxuriousSeaLord",
  "MailedFlower",
  "MakhairaAquamarine",
  "OldMercsPal",
  "PortablePowerSaw",
  "PrototypeArchaic",
  "Rainslasher",
  "RedhornStonethresher",
  "RoyalGreatsword",
  "SacrificialGreatsword",
  "SerpentSpine",
  "SkyriderGreatsword",
  "SkywardPride",
  "SnowTombedStarsilver",
  "SongOfBrokenPines",
  "TalkingStick",
  "TheBell",
  "TheUnforged",
  "TidalShadow",
  "UltimateOverlordsMegaMagicSword",
  "Verdict",
  "WasterGreatsword",
  "Whiteblind",
  "WhiteIronGreatsword",
  "WolfsGravestone",
] as const;
export type WeaponClaymoreKey = (typeof allWeaponClaymoreKeys)[number];

export const allWeaponPolearmKeys = [
  "BalladOfTheFjords",
  "BeginnersProtector",
  "BlackcliffPole",
  "BlackTassel",
  "CalamityQueller",
  "CrescentPike",
  "Deathmatch",
  "DialoguesOfTheDesertSages",
  "DragonsBane",
  "DragonspineSpear",
  "EngulfingLightning",
  "FavoniusLance",
  "Halberd",
  "IronPoint",
  "KitainCrossSpear",
  "LithicSpear",
  "MissiveWindspear",
  "Moonpiercer",
  "PrimordialJadeWingedSpear",
  "ProspectorsDrill",
  "PrototypeStarglitter",
  "RightfulReward",
  "RoyalSpear",
  "SkywardSpine",
  "StaffOfHoma",
  "StaffOfTheScarletSands",
  "TheCatch",
  "VortexVanquisher",
  "WavebreakersFin",
  "WhiteTassel",
] as const;
export type WeaponPoleArmKey = (typeof allWeaponPolearmKeys)[number];

export const allWeaponBowKeys = [
  "AlleyHunter",
  "AmosBow",
  "AquaSimulacra",
  "BlackcliffWarbow",
  "CompoundBow",
  "ElegyForTheEnd",
  "EndOfTheLine",
  "FadingTwilight",
  "FavoniusWarbow",
  "Hamayumi",
  "HuntersBow",
  "HuntersPath",
  "IbisPiercer",
  "KingsSquire",
  "Messenger",
  "MitternachtsWaltz",
  "MouunsMoon",
  "PolarStar",
  "Predator",
  "PrototypeCrescent",
  "RangeGauge",
  "RavenBow",
  "RecurveBow",
  "RoyalBow",
  "Rust",
  "SacrificialBow",
  "ScionOfTheBlazingSun",
  "SeasonedHuntersBow",
  "SharpshootersOath",
  "SkywardHarp",
  "Slingshot",
  "SongOfStillness",
  "TheFirstGreatMagic",
  "TheStringless",
  "TheViridescentHunt",
  "ThunderingPulse",
  "WindblumeOde",
] as const;
export type WeaponBowKey = (typeof allWeaponBowKeys)[number];

export const allWeaponCatalystKeys = [
  "ApprenticesNotes",
  "AThousandFloatingDreams",
  "BalladOfTheBoundlessBlue",
  "BlackcliffAgate",
  "CashflowSupervision",
  "CranesEchoingCall",
  "DodocoTales",
  "EmeraldOrb",
  "EverlastingMoonglow",
  "EyeOfPerception",
  "FavoniusCodex",
  "FlowingPurity",
  "Frostbearer",
  "FruitOfFulfillment",
  "HakushinRing",
  "JadefallsSplendor",
  "KagurasVerity",
  "LostPrayerToTheSacredWinds",
  "MagicGuide",
  "MappaMare",
  "MemoryOfDust",
  "OathswornEye",
  "OtherworldlyStory",
  "PocketGrimoire",
  "PrototypeAmber",
  "QuantumCatalyst",
  "RoyalGrimoire",
  "SacrificialFragments",
  "SacrificialJade",
  "SkywardAtlas",
  "SolarPearl",
  "TheWidsith",
  "ThrillingTalesOfDragonSlayers",
  "TomeOfTheEternalFlow",
  "TulaytullahsRemembrance",
  "TwinNephrite",
  "WanderingEvenstar",
  "WineAndSong",
] as const;
export type WeaponCatalystKey = (typeof allWeaponCatalystKeys)[number];

export const allWeaponKeys = [
  ...allWeaponSwordKeys,
  ...allWeaponClaymoreKeys,
  ...allWeaponPolearmKeys,
  ...allWeaponBowKeys,
  ...allWeaponCatalystKeys,
] as const;
export type WeaponKey =
  | WeaponSwordKey
  | WeaponClaymoreKey
  | WeaponPoleArmKey
  | WeaponBowKey
  | WeaponCatalystKey;

export const weaponMaxLevel: Record<RarityKey, number> = {
  1: 70,
  2: 70,
  3: 90,
  4: 90,
  5: 90,
} as const;

export const allRefinementKeys = [1, 2, 3, 4, 5] as const;
export type RefinementKey = (typeof allRefinementKeys)[number];

export const allLocationCharacterKeys = [
  ...nonTravelerCharacterKeys,
  "Traveler",
] as const;
export type LocationCharacterKey = (typeof allLocationCharacterKeys)[number];

export type LocationKey = LocationCharacterKey | "";

export type Weapon = {
  key: WeaponKey; // "CrescentPike"
  level: number; // 1-90 inclusive
  ascension: AscensionKey; // 0-6 inclusive. need to disambiguate 80/90 or 80/80
  refinement: RefinementKey; // 1-5 inclusive
  location: LocationKey; // where "" means not equipped.
  lock: boolean;
};

export type Artifact = {
  setKey: ArtifactSetKey;
  slotKey: ArtifactSlotKey;
  level: number;
  rarity: ArtifactRarity;
  mainStatKey: MainStatKey;
  location: LocationCharacterKey | "";
  lock: boolean;
  substats: Substat[];
};

export type Substat = {
  key: SubstatKey | "";
  value: number;
};

export type GOOD = {
  format: "GOOD";
  source: string;
  version: number;
  characters?: Character[];
  artifacts?: Artifact[];
  weapons?: Weapon[];
};

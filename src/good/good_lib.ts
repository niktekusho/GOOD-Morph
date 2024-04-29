import {
  Artifact,
  ArtifactSetKey,
  ArtifactSlotKey,
  Character,
  CharacterKey,
  GOOD,
  LocationCharacterKey,
  MainStatKey,
  SubstatKey,
  allLocationCharacterKeys,
} from "./good_spec";

import { enLocalization } from "./localization/index";

export function getGOOD(json: string) {
  const parsed: GOOD = JSON.parse(json);
  return parsed;
}

export function getCharactersWithEquippedArtifactsFromGOOD(good: GOOD) {
  const chars = new Set<LocationCharacterKey>();

  if (good.artifacts) {
    good.artifacts
      .filter((artifact) => artifact.location.length > 0)
      .forEach((equippedArtifact) =>
        // The filter() removes the empty string ("") from the possible values,
        // so the type coercion is safe
        chars.add(equippedArtifact.location as LocationCharacterKey)
      );
  }

  return chars;
}

class LocalizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalizationError";
  }
}

type LocalizationNotFoundContext = {
  key: string;
  language: string;
};

type LocalizationNotFoundCallback = (
  ctx: LocalizationNotFoundContext
) => unknown;

class Localization {
  private onLocalizationNotFoundCallbacks:
    | LocalizationNotFoundCallback[]
    | undefined;

  constructor(
    private localizationData: Record<string, string>,
    private language: string,
    private fallbackLanguage?: string
  ) {}

  onLocalizationNotFound(callback: LocalizationNotFoundCallback) {
    if (!this.onLocalizationNotFoundCallbacks) {
      this.onLocalizationNotFoundCallbacks = [];
    }
    this.onLocalizationNotFoundCallbacks.push(callback);
  }

  getLocalizedString(key: string): string {
    let localizedString = this.localizationData[key];
    if (localizedString) return localizedString;
    this.notifyOnLocalizationNotFound({ key, language: this.language });

    if (this.fallbackLanguage) {
      // TODO load fallback language (cache it too) and return the value from the fallback
      this.notifyOnLocalizationNotFound({
        key,
        language: this.fallbackLanguage,
      });
    }
    throw new LocalizationError(
      `Translation not found for key ${key} in language ${this.language}.`
    );
  }

  private notifyOnLocalizationNotFound({
    key,
    language,
  }: LocalizationNotFoundContext) {
    if (this.onLocalizationNotFoundCallbacks) {
      for (const onLocalizationNotFoundCallback of this
        .onLocalizationNotFoundCallbacks) {
        onLocalizationNotFoundCallback({
          key,
          language,
        });
      }
    }
  }
}

// TODO: return correctly inferred types if possible

export function localizeArtifactSet(
  artifactSet: ArtifactSetKey,
  language: string
): string {
  const localization = new Localization(enLocalization, "en");
  return localization.getLocalizedString(artifactSet);
}

export function localizeArtifactStat(
  artifactStat: MainStatKey | SubstatKey,
  language: string
): string {
  const localization = new Localization(enLocalization, "en");
  return localization.getLocalizedString(artifactStat);
}

export function localizeArtifactSlot(
  artifactSlot: ArtifactSlotKey,
  language: string
): string {
  const localization = new Localization(enLocalization, "en");
  return localization.getLocalizedString(artifactSlot);
}

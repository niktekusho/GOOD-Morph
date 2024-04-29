import { localizeArtifactStat } from "@/good/good_lib";
import type { Artifact, SubstatKey } from "@/good/good_spec";

export type ArtifactCardProps = {
  artifact: Artifact;
};

export function ArtifactCard({ artifact }: ArtifactCardProps) {
  return (
    <div className="flex gap-1 border-zinc-100 border rounded">
      <div className="flex flex-col">
        <span>{localizeArtifactStat(artifact.mainStatKey, "en")}</span>
        {/* TODO icon */}
        <span>{artifact.level}</span>
      </div>
      <div className="flex-grow grid grid-cols-2">
        {artifact.substats
          .filter((substat) => substat.key.length > 0)
          .map((substat) => (
            <div key={substat.key} className="flex gap-1">
              {/*
                The filter() removes the empty string ("") from the possible values,
                so the type coercion is safe
               */}
              <div>{localizeArtifactStat(substat.key as SubstatKey, "en")}</div>
              {/* TODO icon */}
              <div>{substat.value}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

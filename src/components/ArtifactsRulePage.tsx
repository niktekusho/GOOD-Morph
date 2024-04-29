import {
  getCharactersWithEquippedArtifactsFromGOOD,
  getGOOD,
} from "@/good/good_lib";
import { UploadedFile } from "../app/page";
import { ArtifactCard } from "./ArtifactCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Plus, Play } from "lucide-react";
import { Rules } from "./Rules";
import { CSSProperties, useState } from "react";
import { useRulesets } from "@/morph/react/useRuleset";
import { useRenderCount } from "@/lib/utils";
import { applyRuleset } from "@/morph/ruleset";

type ArtifactsRulePageProps = {
  file: UploadedFile;
};
export function ArtifactsRulePage({ file }: ArtifactsRulePageProps) {
  const good = getGOOD(file.content);

  const {
    rulesets,
    currentRuleset,
    addRuleToCurrentRuleset,
    updateRuleInCurrentRuleset,
  } = useRulesets();

  const artifacts = good.artifacts || [];
  const foundCharacters = getCharactersWithEquippedArtifactsFromGOOD(good);

  useRenderCount("ArtifactsRulePage");

  const morphBtnHandler = () => {
    const newGOOD = applyRuleset(currentRuleset, good);

    const jsonStr = JSON.stringify(newGOOD);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${file.name}-edited.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col">
      <header className="flex justify-between items-center p-4 pt-2 border-b">
        <h2 className="font-semibold text-">Working on {file.name}</h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                {currentRuleset.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[...rulesets.values()].map((ruleset, index) => (
                <DropdownMenuItem key={index}>{ruleset.name}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant={"outline"} disabled>
            Save Ruleset
          </Button>
          <Button size="sm" onClick={morphBtnHandler}>
            <Play className="mr-2 size-4"></Play> Morph!
          </Button>
        </div>
      </header>
      {/* 2 pane layout */}
      <div
        className="grid grid-cols-auto gap-8 p-4"
        style={{ "--_min-col-w": "400px" } as CSSProperties}
      >
        {/* form */}
        <div className="bg-orange-200 p-2">
          {/* toolbar */}
          <div className="flex items-center justify-between ">
            <span>{currentRuleset.name}</span>
            <Button
              size="sm"
              onClick={() =>
                addRuleToCurrentRuleset({
                  action: { type: "", parameters: {} },
                  filter: { type: "", parameters: {} },
                  name: "",
                })
              }
            >
              <Plus className="mr-2 size-4"></Plus> Add rule
            </Button>
          </div>
          <Rules
            foundCharacters={foundCharacters}
            rules={currentRuleset.rules}
            addRuleToCurrentRuleset={addRuleToCurrentRuleset}
            updateRuleInCurrentRuleset={updateRuleInCurrentRuleset}
          />
        </div>
        {/* preview */}
        <div className="bg-blue-200 w-full h-full">
          {/* <ul className="list-none">
            {artifacts.map((artifact, index) => (
              <li key={index} className="my-2">
                <ArtifactCard artifact={artifact} />
              </li>
            ))}
          </ul> */}
        </div>
      </div>
    </div>
  );
}

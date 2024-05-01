import {
  getCharactersWithEquippedArtifactsFromGOOD,
  getGOOD,
} from "@/good/good_lib";
import { GOOD } from "@/good/good_spec";
import { type UseMorphFlow } from "@/lib/useMorphFlow";
import { useRenderCount } from "@/lib/utils";
import { useRulesets } from "@/morph/react/useRuleset";
import { applyRuleset } from "@/morph/ruleset";
import { Play, Plus } from "lucide-react";
import { CSSProperties, MouseEventHandler } from "react";
import { Rules } from "./Rules";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type ArtifactsRulePageProps = {
  file: NonNullable<UseMorphFlow["loadedFile"]>;
  onFileDownloadInitiated: UseMorphFlow["onFileDownloadInitiated"];
  morphedGOODFile: UseMorphFlow["morphedGOODFile"];
  onMorphStarted: UseMorphFlow["onMorphStarted"];
  onMorphCompleted: UseMorphFlow["onMorphCompleted"];
  showModal: UseMorphFlow["showModal"];
  onContinueCurrentSession: UseMorphFlow["onContinueCurrentSession"];
  onStartNewSession: UseMorphFlow["onStartNewSession"];
  appState: UseMorphFlow["appState"];
};

export function ArtifactsRulePage({
  morphedGOODFile,
  file,
  onFileDownloadInitiated,
  onMorphStarted,
  onMorphCompleted,
  showModal,
  onContinueCurrentSession,
  onStartNewSession,
  appState,
}: ArtifactsRulePageProps) {
  const good = getGOOD(file.content);

  const {
    rulesets,
    currentRuleset,
    addRuleToCurrentRuleset,
    updateRuleInCurrentRuleset,
  } = useRulesets();

  // const artifacts = good.artifacts || [];
  const foundCharacters = getCharactersWithEquippedArtifactsFromGOOD(good);

  useRenderCount("ArtifactsRulePage");

  const handleDownloadButton: MouseEventHandler = (e) => {
    onFileDownloadInitiated();
    const link = document.createElement("a");
    link.href = morphedGOODFile!.downloadUrl;
    link.setAttribute("download", morphedGOODFile!.name);
    document.body.appendChild(link);
    link.addEventListener("focus", () => {
      console.log("temp link focused");
    });
    link.addEventListener("blur", () => {
      console.log("temp link UNfocused");
    });
    link.click();
    document.body.removeChild(link);
  };

  const handleMorphButton = async () => {
    onMorphStarted();
    // Minimum amount of progress is 1 second
    const minimumProgressPromise = new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });

    const newGOODPromise = new Promise<GOOD>((resolve) =>
      resolve(applyRuleset(currentRuleset, good))
    );

    const promisesResult = await Promise.all([
      minimumProgressPromise,
      newGOODPromise,
    ]);

    const jsonStr = JSON.stringify(promisesResult[1]);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);

    onMorphCompleted(url);
  };

  return (
    <>
      <AlertDialog open={showModal}>
        {appState === "MorphInProgress" && (
          <MorphInProgressAlertDialogContent />
        )}
        {appState === "MorphCompleted" && (
          <MorphCompletedAlertDialogContent
            handleDownloadButton={handleDownloadButton}
          />
        )}
        {appState === "FileDownloaded" && (
          <FileDownloadedAlertDialogContent
            onContinueCurrentSession={onContinueCurrentSession}
            onStartNewSession={onStartNewSession}
            morphedGOODFile={morphedGOODFile!}
          />
        )}
      </AlertDialog>
      <div className="w-full flex flex-col">
        <header className="flex justify-between items-center p-4 pt-2 border-b">
          <h2 className="font-semibold text-xl">Working on {file.name}</h2>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  {currentRuleset.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[...rulesets.values()].map((ruleset, index) => (
                  <DropdownMenuItem key={index}>
                    {ruleset.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant={"outline"} disabled>
              Save Ruleset
            </Button>
            <Button size="sm" onClick={handleMorphButton}>
              <Play className="mr-2 size-4"></Play> Morph!
            </Button>
          </div>
        </header>
        {/* 2 pane layout */}
        <div className="grid gap-8 p-4">
          {/* form */}
          {/* TODO: bg-orange is only for debugging purposes only */}
          <div className="bg-orange-100 p-4 space-y-4 rounded">
            {/* toolbar */}
            <div className="flex items-center justify-between ">
              <span className="font-semibold">{currentRuleset.name}</span>
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
          {/* <div className="bg-blue-200 w-full h-full">
            <ul className="list-none">
            {artifacts.map((artifact, index) => (
              <li key={index} className="my-2">
                <ArtifactCard artifact={artifact} />
              </li>
            ))}
          </ul>
          </div> */}
        </div>
      </div>
    </>
  );
}

function MorphInProgressAlertDialogContent() {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Morph in progress...</AlertDialogTitle>
        <AlertDialogDescription>
          Morphing your GOOD file...
        </AlertDialogDescription>
      </AlertDialogHeader>
    </AlertDialogContent>
  );
}

function MorphCompletedAlertDialogContent({
  handleDownloadButton,
}: {
  handleDownloadButton: MouseEventHandler;
}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Your GOOD file is ready!</AlertDialogTitle>
        <AlertDialogDescription>
          Your GOOD file was morphed successfully!<br></br>You can download the
          copy of your file with the button below!
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={handleDownloadButton}>
          Download morphed file
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

function FileDownloadedAlertDialogContent({
  onContinueCurrentSession,
  onStartNewSession,
  morphedGOODFile,
}: {
  onContinueCurrentSession: MouseEventHandler;
  onStartNewSession: MouseEventHandler;
  morphedGOODFile: NonNullable<UseMorphFlow["morphedGOODFile"]>;
}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Would you like to start a new session?
        </AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="flex flex-col gap-4 py-4">
            <p>
              Starting a new session will close the current one and any unsaved
              changes to Rulesets will be lost.
            </p>
            <p className="muted text-balance">
              Here&apos;s the link in case you cancelled in the previous step:
              <br></br>
              <a
                download={morphedGOODFile.name}
                className="underline hover:text-primary text-accent-foreground"
                href={morphedGOODFile.downloadUrl}
              >
                {morphedGOODFile.name}
              </a>
            </p>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onStartNewSession}>
          Start new session
        </AlertDialogCancel>
        <AlertDialogAction onClick={onContinueCurrentSession}>
          Continue current session
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

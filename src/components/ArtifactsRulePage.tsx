import {
  getCharactersWithEquippedArtifactsFromGOOD,
  getGOOD,
} from "@/good/good_lib";
import { GOOD } from "@/good/good_spec";
import { type UseMorphFlow } from "@/lib/useMorphFlow";
import { useRulesets } from "@/morph/react/useRuleset";
import { applyRuleset, validateRuleset } from "@/morph/ruleset";
import { Play, Plus } from "lucide-react";
import { MouseEventHandler } from "react";
import { CircularProgressIndicator } from "./CircularProgress";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { isBlankString } from "@/morph/validation";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";

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
    addRuleset,
    currentRuleset,
    addRuleToCurrentRuleset,
    updateRuleInCurrentRuleset,
    deleteRuleInCurrentRuleset,
    updateCurrentRuleset,
    saveCurrentRuleset,
  } = useRulesets();

  const { toast } = useToast();

  // const artifacts = good.artifacts || [];
  const foundCharacters = getCharactersWithEquippedArtifactsFromGOOD(good);

  const handleDownloadButton: MouseEventHandler = (e) => {
    onFileDownloadInitiated();
    const link = document.createElement("a");
    link.href = morphedGOODFile!.downloadUrl;
    link.setAttribute("download", morphedGOODFile!.name);
    document.body.appendChild(link);
    // Unfortunately it's not possible to know the result of the save dialog shown to the user...
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

  const currentRulesetIsBlank = currentRuleset.name.length === 0;
  const currentRulesetLabel = currentRulesetIsBlank
    ? "Current ruleset"
    : currentRuleset.name;

  const onSaveRulesetHandler = () => {
    saveCurrentRuleset();
    toast({
      title: "Current ruleset saved",
      description: `"${currentRuleset.name}" was successfully saved.`,
    });
  };

  const handleAddRuleset = () => {
    addRuleset();
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
        <header className="flex justify-between items-center p-4 pt-2 border-b gap-2">
          <h2 className="font-semibold flex-grow flex-shrink text-xl">
            Working on {file.name}
          </h2>
          <div className="flex flex-shrink-0 flex-grow-0 items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* The following code is inspired by: https://stackoverflow.com/a/32833185 */}
                {/* We want to prevent the button to become too large by adding a max width to it and enable the ellipsis overflow... */}
                <Button
                  size="sm"
                  variant="outline"
                  className="max-w-[25ch] min-w-[10ch]"
                >
                  <span
                    className={`text-ellipsis overflow-hidden ${
                      currentRulesetIsBlank ? "italic" : ""
                    }`}
                  >
                    {currentRulesetLabel}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              {/* The CSS variable `--radix-dropdown-menu-trigger-width` allows the Dropdown content to have the same width as the Dropdown trigger. */}
              {/* See more at: https://www.radix-ui.com/primitives/docs/components/dropdown-menu#constrain-the-contentsub-content-size. */}
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                {[...rulesets.values()].map((ruleset, index) => (
                  <DropdownMenuItem key={index}>
                    <div
                      className={`text-ellipsis overflow-hidden ${
                        isBlankString(ruleset.name) ? "italic" : ""
                      }`}
                    >
                      {isBlankString(ruleset.name)
                        ? currentRulesetLabel
                        : ruleset.name}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem key="newRuleset" onClick={handleAddRuleset}>
                  New ruleset...
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              variant={"outline"}
              disabled={validateRuleset(currentRuleset).failed}
              onClick={onSaveRulesetHandler}
            >
              Save Ruleset
            </Button>
            <Button
              size="sm"
              disabled={validateRuleset(currentRuleset).failed}
              onClick={handleMorphButton}
            >
              <Play className="mr-2 size-4"></Play> Morph!
            </Button>
          </div>
        </header>
        {/* 2 pane layout */}
        <div className="grid gap-8 p-4">
          {/* form */}
          <div className="space-y-4 rounded">
            {/* toolbar */}
            <h2 className="flex items-center justify-between">
              <Label htmlFor="rulesetName" className="sr-only">
                Ruleset
              </Label>
              <Input
                className="flex-grow-0 flex-shrink w-1/2 text-ellipsis"
                id="rulesetName"
                type="text"
                value={currentRuleset.name}
                onChange={(e) => {
                  const newRulesetName = e.target.value;
                  const updatedRuleset = {
                    ...currentRuleset,
                    name: newRulesetName,
                  };
                  updateCurrentRuleset(updatedRuleset);
                }}
              />

              <Button
                size="sm"
                className="flex-shrink-0"
                onClick={() =>
                  addRuleToCurrentRuleset({
                    action: { type: "equip", parameters: {} },
                    filter: { type: "equippingCharacter", parameters: {} },
                    name: "",
                  })
                }
              >
                <Plus className="mr-2 size-4"></Plus> Add rule
              </Button>
            </h2>
            <Rules
              foundCharacters={foundCharacters}
              rules={currentRuleset.rules}
              addRuleToCurrentRuleset={addRuleToCurrentRuleset}
              updateRuleInCurrentRuleset={updateRuleInCurrentRuleset}
              deleteRuleInCurrentRuleset={deleteRuleInCurrentRuleset}
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
      <Toaster />
    </>
  );
}

function MorphInProgressAlertDialogContent() {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Morph in progress</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="grid place-items-center gap-4">
            Morphing your GOOD file...
            <CircularProgressIndicator twSize="size-10" />
          </div>
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

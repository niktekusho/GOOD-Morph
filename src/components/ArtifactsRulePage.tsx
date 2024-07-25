import {
  getCharactersWithEquippedArtifactsFromGOOD,
  getGOOD,
} from "@/good/good_lib";
import { type UseMorphFlow } from "@/lib/useMorphFlow";
import { useRulesets } from "@/morph/react/useRuleset";
import { Ruleset, validateRuleset } from "@/morph/ruleset";
import { isBlankString } from "@/morph/validation";
import { Play, Plus } from "lucide-react";
import { MouseEventHandler, useEffect, useRef } from "react";
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
import { ToastAction } from "./ui/toast";
import { Toaster } from "./ui/toaster";
import { useToast } from "./ui/use-toast";
import { EndMorphEventData, StartMorphEventData } from "./morph-worker";

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

  const workerRef = useRef<Worker>();

  const {
    rulesets,
    addRuleset,
    currentRuleset,
    addRuleToCurrentRuleset,
    updateRuleInCurrentRuleset,
    deleteRuleInCurrentRuleset,
    updateCurrentRuleset,
    saveCurrentRuleset,
    setSelectedRuleset,
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

    workerRef.current?.postMessage({
      type: "startMorph",
      currentRuleset,
      good,
    } satisfies StartMorphEventData);

    // Minimum amount of progress is 1 second
    const minimumProgressPromise = new Promise<void>((resolve) => {
      setTimeout(resolve, 1_000);
    });

    const newGOODPromise = new Promise<string>((resolve) => {
      workerRef.current!.onmessage = (ev: MessageEvent<EndMorphEventData>) => {
        resolve(ev.data.blobUrl);
      };
    });

    const promisesResult = await Promise.all([
      minimumProgressPromise,
      newGOODPromise,
    ]);

    const url = promisesResult[1];
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

  const onRulesetChangeHandler = (pickedRuleset: Ruleset) => {
    setSelectedRuleset(pickedRuleset.name);
  };

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./morph-worker.ts", import.meta.url)
    );

    // Setup error handling for the web-worker "together" with its init.
    workerRef.current.onerror = (errorEvent) => {
      errorEvent.preventDefault();
      console.error("Error from worker", errorEvent);

      openBugToast(toast, {
        context: "morph-worker communication",
        error: {
          column: errorEvent.colno,
          fileName: errorEvent.filename,
          line: errorEvent.lineno,
          message: errorEvent.message,
        },
      });
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [toast]);

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
                  <DropdownMenuItem
                    key={index}
                    onClick={() => onRulesetChangeHandler(ruleset)}
                  >
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

type Bug = {
  context: string;
  error?: Error;
};

type Error = {
  message?: string;
  line?: number;
  column?: number;
  fileName?: string;
};

function openBugToast(toast: ReturnType<typeof useToast>["toast"], bug: Bug) {
  const toastDesc = (
    <p>
      Sorry for the inconvenience!
      <br />
      You could help us fix this bug by opening an issue with the button below!
      <br />
      Thank you! ♡
    </p>
  );

  const userAgent = navigator.userAgent;

  let title;

  if (bug.error?.message) {
    title = `${bug.error?.message} (${bug.context})`;
  } else {
    title = `Bug: ${bug.context}`;
  }

  const issue = {
    labels: "bug",
    title,
    body: `
**Hi there! 👋👋👋**

Thank you for taking the time to report a bug.
Your feedback helps us improve.
Please fill out the details below, and we'll get to fixing it as soon as we can!

---

## How did it happen?

How can we see the issue happen? Please list the steps:

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## GOOD file

Could you add the \`.good\` file you used to show the problem?
This helps us reproduce your problem faster (and thus fix this bug quicker too 😉).

## Screenshots

If you can, could you add some screenshots to show the problem?
This helps us understand better.

## Technical details

Context: \`${bug.context}\`

User-Agent: \`${userAgent}\`

### Error:

\`\`\`
${bug.error ? JSON.stringify(bug.error, null, 4) : "No error info."}
\`\`\`

---

Thank you so much for your help! 🙌
`,
  };

  const issueUrl = new URL(
    "https://github.com/niktekusho/GOOD-Morph/issues/new"
  );

  for (const [key, val] of Object.entries(issue)) {
    issueUrl.searchParams.append(key, val);
  }

  const toastAction = (
    <ToastAction altText="Open issue on GitHub" className="" asChild>
      <a href={issueUrl.toString()} target="_blank">
        Open issue on GitHub
      </a>
    </ToastAction>
  );

  toast({
    title: "Bug found!",
    description: toastDesc,
    // duration: 1_000_000,
    variant: "destructive",
    action: toastAction,
    className:
      "grid gap-4 items-center justify-stretch p-6 space-x-0 sm:grid-cols-2 md:grid-cols-1",
  });
}

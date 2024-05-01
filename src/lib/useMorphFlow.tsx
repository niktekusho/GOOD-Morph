import { useEffect, useState } from "react";

/*
Flow of the app:
1. Initial
   - On previous session found: Transition to PromptPreviousSession
   - On no sessions found: Transition to NewSession
   2. PromptPreviousSession:
   - On "Continue previous session": Transition to DefiningRuleset
   - On "Start new session": Transition to NewSession
3. NewSession:
   - On file upload: Transition to DefiningRuleset
4. DefiningRuleset
   - On valid ruleset: Transition to ValidRuleset
   - On invalid ruleset: Stay in DefiningRuleset
5. ValidRuleset
   - On morph button clicked: Transition to MorphInProgress
   - On ruleset's edits: Transition to DefiningRuleset
6. MorphInProgress
   - On morph completed: Transition to MorphCompleted
7. MorphCompleted
   - On download initiated: Transition to FileDownloaded
8. FileDownloaded
   - On start new session: Transition to NewSession
   - On continue: Transition to DefiningRuleset
*/

// TODO: look into proper state machines
type MorphAppState =
  | "Initial"
  | "PromptPreviousSession"
  | "NewSession"
  | "DefiningRuleset"
  | "ValidRuleset"
  | "MorphInProgress"
  | "MorphCompleted"
  | "FileDownloaded";

const statesRequiringModal = Object.freeze(
  new Set<MorphAppState>([
    "PromptPreviousSession",
    "MorphInProgress",
    "MorphCompleted",
    "FileDownloaded",
  ])
);

type GOODFile = {
  name: string;
  content: string;
};

type MorphedGOODFile = {
  downloadUrl: string;
} & GOODFile;

const ssFileNameKey = "fileName";
const ssFileContentKey = "fileContent";

export function useMorphFlow() {
  const [appState, setState] = useState<MorphAppState>("Initial");

  const [morphedGOODFile, setMorphedGOODFile] = useState<MorphedGOODFile>();

  const [loadedFile, setLoadedFile] = useState<GOODFile>();

  const onMorphStarted = () => setState("MorphInProgress");
  const onMorphCompleted = (url: string) => {
    setState("MorphCompleted");
    const baseFileName = loadedFile!.name.replace(".json", "");
    setMorphedGOODFile({
      content: "TODO",
      downloadUrl: url,
      name: `${baseFileName}-morphed.json`,
    });
  };

  const onFilePicked = (pickedFile?: GOODFile) => {
    if (pickedFile) {
      // console.log("file content", fileContent);
      // TODO: I don't know if this is the way...
      sessionStorage.setItem("fileName", pickedFile.name);
      sessionStorage.setItem("fileContent", pickedFile.content);
    }
    setLoadedFile(pickedFile);
  };

  const onFileDownloadInitiated = () => setState("FileDownloaded");

  const onContinueCurrentSession = () => {
    loadFileFromSessionStorage();
    setState("ValidRuleset");
  };

  const onStartNewSession = () => {
    setMorphedGOODFile(undefined);
    setLoadedFile(undefined);
    setState("NewSession");
    sessionStorage.removeItem(ssFileNameKey);
    sessionStorage.removeItem(ssFileContentKey);
  };

  const loadFileFromSessionStorage = () => {
    const maybeFileName = sessionStorage.getItem(ssFileNameKey);
    const maybeFileContent = sessionStorage.getItem(ssFileContentKey)!;
    if (maybeFileName && maybeFileContent) {
      setLoadedFile({
        content: maybeFileContent,
        name: maybeFileName,
      });
    }
  };

  useEffect(() => {
    const maybeFileName = sessionStorage.getItem("fileName");
    if (maybeFileName) {
      // In dev we want to be faster, so we skip the modal
      if (process.env.NODE_ENV === "development") {
        loadFileFromSessionStorage();
      } else {
        setState("PromptPreviousSession");
      }
    }
  }, []);

  console.log("appState (useMorphFlow)", appState);

  const showModal = statesRequiringModal.has(appState);

  return {
    appState,
    loadedFile,
    morphedGOODFile,
    showModal,
    onMorphStarted,
    onMorphCompleted,
    onFileDownloadInitiated,
    onContinueCurrentSession,
    onStartNewSession,
    onFilePicked,
  };
}

export type UseMorphFlow = ReturnType<typeof useMorphFlow>;

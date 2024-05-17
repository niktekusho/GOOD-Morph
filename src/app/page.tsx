"use client";

import { InitialPage } from "../components/InitialPage";
import { ArtifactsRulePage } from "@/components/ArtifactsRulePage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMorphFlow } from "@/lib/useMorphFlow";

export default function Page() {
  const {
    appState,
    showModal,
    loadedFile,
    morphedGOODFile,
    onStartNewSession,
    onFilePicked,
    onContinueCurrentSession,
    onFileDownloadInitiated,
    onMorphCompleted,
    onMorphStarted,
  } = useMorphFlow();

  return (
    <>
      <AlertDialog open={appState === "PromptPreviousSession"}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Welcome Back!</AlertDialogTitle>
            <AlertDialogDescription>
              It looks like you had a previous session that wasn&apos;t
              completed.<br></br>Would you like to start a new session or
              continue where you left off?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onStartNewSession}>
              Start New Session
            </AlertDialogCancel>
            <AlertDialogAction onClick={onContinueCurrentSession}>
              Continue Previous Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <main className="min-h-[100dvh] grid p-2">
        {loadedFile ? (
          <ArtifactsRulePage
            file={loadedFile}
            appState={appState}
            morphedGOODFile={morphedGOODFile}
            onContinueCurrentSession={onContinueCurrentSession}
            onFileDownloadInitiated={onFileDownloadInitiated}
            onMorphCompleted={onMorphCompleted}
            onMorphStarted={onMorphStarted}
            onStartNewSession={onStartNewSession}
            showModal={showModal}
          />
        ) : (
          <InitialPage onFilePicked={onFilePicked} />
        )}
      </main>
    </>
  );
}

'use client';

import { ArtifactsRulePage } from "@/components/ArtifactsRulePage";
import { useMorphFlow } from "@/lib/useMorphFlow";

export default function SessionPage() {

    const {
        appState,
        showModal,
        loadedFile,
        morphedGOODFile,
        onStartNewSession,
        onContinueCurrentSession,
        onFileDownloadInitiated,
        onMorphCompleted,
        onMorphStarted,
      } = useMorphFlow();

      if (loadedFile == null) {
        return <div>Error!</div>
      }

    return <ArtifactsRulePage
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
}
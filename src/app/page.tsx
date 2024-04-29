"use client";

import { MouseEventHandler, useEffect, useRef, useState } from "react";
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

export type UploadedFile = {
  name: string;
  content: string;
};

export default function Component() {
  const [file, setFile] = useState<UploadedFile>();

  const [showModal, setShowModal] = useState(false);

  const loadFileFromSessionStorage = () => {
    const maybeFileName = sessionStorage.getItem("fileName");
    if (maybeFileName) {
      const fileContent = sessionStorage.getItem("fileContent")!;
      setFile({
        content: fileContent,
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
        setShowModal(true);
      }
    }
  }, []);

  const handleStartNewSessionBtn: MouseEventHandler = (_) => {
    console.log("Clearing sessionStorage");
    setShowModal(false);
    sessionStorage.clear();
  };

  const handleContinuePreviousSessionBtn: MouseEventHandler = (_) => {
    setShowModal(false);
    loadFileFromSessionStorage();
  };

  return (
    <>
      <AlertDialog open={showModal}>
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
            <AlertDialogCancel onClick={handleStartNewSessionBtn}>
              Start New Session
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleContinuePreviousSessionBtn}>
              Continue Previous Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <main className="min-h-[100dvh] grid p-2">
        {file ? (
          <ArtifactsRulePage file={file} />
        ) : (
          <InitialPage setFile={setFile} />
        )}
      </main>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { InitialPage } from "../components/InitialPage";
import { ArtifactsRulePage } from "@/components/ArtifactsRulePage";

export type UploadedFile = {
  name: string;
  content: string;
};

export default function Component() {
  const [file, setFile] = useState<UploadedFile>();

  // Check if sessionStorage has a previous session
  useEffect(() => {
    const maybeFileName = sessionStorage.getItem("fileName");
    if (maybeFileName) {
      const fileContent = sessionStorage.getItem("fileContent")!;
      setFile({
        content: fileContent,
        name: maybeFileName,
      });
    }
  }, []);

  return (
    <main className="min-h-[100dvh] grid p-2">
      {file ? (
        <ArtifactsRulePage file={file} />
      ) : (
        <InitialPage setFile={setFile} />
      )}
    </main>
  );
}

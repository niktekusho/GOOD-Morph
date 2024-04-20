"use client";

import { useState } from "react";
import { InitialPage } from "../components/InitialPage";

export type UploadedFile = {
  name: string;
  content: string;
};

export default function Component() {
  const [file, setFile] = useState<UploadedFile>();

  return (
    <main className="min-h-[100dvh] grid p-2">
      <InitialPage setFile={setFile} />
    </main>
  );
}

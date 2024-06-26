"use client";
import { Button } from "@/components/ui/button";
import { type UseMorphFlow } from "@/lib/useMorphFlow";
import { Upload } from "lucide-react";
import { ChangeEventHandler, createRef } from "react";

type InitialPageProps = {
  onFilePicked: UseMorphFlow["onFilePicked"];
};

const loadFileInputRef = createRef<HTMLInputElement>();

export function InitialPage({ onFilePicked }: InitialPageProps) {
  const handleLoadFile = () => {
    loadFileInputRef.current?.click();
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const selectedFile = e.currentTarget.files?.item(0);

    // console.log("input ref changed", selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onerror = (e) => console.error(e);
      reader.onloadend = (e) => {
        const fileContent = e.target!.result! as string;
        onFilePicked({ content: fileContent, name: selectedFile.name });
      };

      reader.readAsText(selectedFile);
    } else {
      onFilePicked(undefined);
    }
  };

  return (
    <section className="flex flex-col gap-8 px-4 place-self-center">
      <h1 className="text-3xl font-bold tracking-tighter">
        Upload your .GOOD file to the browser
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        Drag and drop (TODO) or select the file to upload.
        <br />
        Your data <strong>never</strong> leaves your browser.
      </p>

      <Button onClick={handleLoadFile}>
        <input
          ref={loadFileInputRef}
          type="file"
          className="hidden"
          accept="application/json"
          onChange={handleInputChange}
          onClick={(e) => e.stopPropagation()}
        />
        <Upload className="mr-2 size-4" /> Load .GOOD file
      </Button>
    </section>
  );
}

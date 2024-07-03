"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { ChangeEventHandler, useRef } from "react";

const onFilePicked = (obj: unknown) => {}

export function LoadGOODFileButton() {
    const loadFileInputRef = useRef<HTMLInputElement>(null);
  
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


    return <Button onClick={handleLoadFile}>
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
}
import { LoadGOODFileButton } from "./LoadGOODFileButton";

export default function HomePage() {
  return (
    <main className="min-h-[100dvh] grid p-2">
      <section className="flex flex-col gap-8 px-4 place-self-center">
        <h1 className="text-3xl font-bold tracking-tighter">
          Upload your .GOOD file to the browser
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Drag and drop (TODO) or select the file to upload.
          <br />
          Your data <strong>never</strong> leaves your browser.
        </p>

        <LoadGOODFileButton />
      </section>
    </main>
  );
}

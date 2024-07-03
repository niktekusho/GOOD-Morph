import { Suspense } from "react";
import SessionLoadingPage from "./loading";

export default function SessionPageLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <Suspense fallback={<SessionLoadingPage />}>
            {children}
        </Suspense>
    );
  }
  
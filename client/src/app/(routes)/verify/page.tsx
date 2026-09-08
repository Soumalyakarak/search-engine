import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f8f8] dark:bg-[#0b0f0d]">
          <p>Loading...</p>
        </div>
      }
    >
      <VerifyClient />
    </Suspense>
  );
}
"use client";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { Download, X } from "lucide-react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [close, setClose] = useState(false);
  useEffect(() => {
    // Catch event that fired before component mounted
    if ((window as any).__pwaPrompt) {
      setDeferredPrompt((window as any).__pwaPrompt);
      (window as any).__pwaPrompt = null;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt || close) return null; // Only show button if prompt is available

  return (
    <div className="sticky top-0 z-30  text-foreground lg:pl-35 ">
      <div className="flex gap-2 md:items-center bg-black/50 backdrop-blur-md  px-4 py-3 lg:rounded-bl-xl">
        <div className="flex grow gap-3 md:items-center">
          <div
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 max-md:mt-0.5"
          >
            <Download className="opacity-80" size={16} />
          </div>
          <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-0.5">
              <p className="font-medium text-sm">
                Install ZXCPRIME for a better experience
              </p>
              <p className="text-muted-foreground text-sm">
                Get faster access, a smoother experience, and use the app
                directly from your home screen.
              </p>
            </div>
            <div className="flex gap-2 max-md:flex-wrap">
              <Button
                className="text-sm"
                size="sm"
                onClick={async () => {
                  deferredPrompt.prompt();
                  const choice = await deferredPrompt.userChoice;
                  console.log("User choice:", choice.outcome);
                  setDeferredPrompt(null);
                }}
              >
                Install now
              </Button>
            </div>
          </div>
        </div>
        <Button
          aria-label="Close banner"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          variant="ghost"
          onClick={() => setClose(true)}
        >
          <X
            aria-hidden="true"
            className="opacity-60 transition-opacity group-hover:opacity-100"
            size={16}
          />
        </Button>
      </div>
    </div>
  );
}

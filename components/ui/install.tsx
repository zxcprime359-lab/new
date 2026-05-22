"use client";
import { useEffect, useState } from "react";
import { Button } from "./button";
import {
  IconBrandAndroid,
  IconDeviceDesktopDown,
  IconDownload,
} from "@tabler/icons-react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // Prevent the browser from showing it automatically
      setDeferredPrompt(e); // Save event for later
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt) return null; // Only show button if prompt is available

  return (
    <Button
      variant="secondary"
      onClick={async () => {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        console.log("User choice:", choice.outcome);
        setDeferredPrompt(null);
      }}
    >
      <IconDeviceDesktopDown /> Install
    </Button>
  );
}

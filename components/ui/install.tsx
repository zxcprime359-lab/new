// "use client";
// import { useEffect, useState } from "react";
// import { Button } from "./button";
// import {
//   IconBrandAndroid,
//   IconDeviceDesktopDown,
//   IconDownload,
// } from "@tabler/icons-react";

// export default function InstallButton() {
//   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

//   useEffect(() => {
//     const handler = (e: any) => {
//       e.preventDefault(); // Prevent the browser from showing it automatically
//       setDeferredPrompt(e); // Save event for later
//     };
//     window.addEventListener("beforeinstallprompt", handler);
//     return () => window.removeEventListener("beforeinstallprompt", handler);
//   }, []);

//   return (
//     <Button
//       variant="secondary"
//       disabled={!deferredPrompt}
//       onClick={async () => {
//         deferredPrompt.prompt();
//         const choice = await deferredPrompt.userChoice;
//         console.log("User choice:", choice.outcome);
//         setDeferredPrompt(null);
//       }}
//     >
//       <IconDeviceDesktopDown /> Install Now {!deferredPrompt && "(Unavailable)"}
//     </Button>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { IconDeviceDesktopDown } from "@tabler/icons-react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect if already installed (PWA mode)
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;

      setIsInstalled(isStandalone);
    };

    checkInstalled();

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // also re-check on focus (useful when user installs then returns)
    window.addEventListener("focus", checkInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("focus", checkInstalled);
    };
  }, []);

  if (isInstalled) {
    return (
      <Button disabled variant="secondary">
        App Already Installed
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      disabled={!deferredPrompt}
      onClick={async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        console.log("User choice:", choice.outcome);
        setDeferredPrompt(null);
      }}
    >
      <IconDeviceDesktopDown />
      Install App
    </Button>
  );
}

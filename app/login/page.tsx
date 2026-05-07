"use client";
import { Film, Monitor, Star } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { GoogleIcon } from "@/components/icon/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleCloseDrawer = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setTimeout(() => {
        router.back();
      }, 300);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(value) => handleCloseDrawer(value)}>
      <DialogContent className="lg:w-fit w-[calc(100%-20px)]">
        <DialogHeader className="sr-only">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex lg:w-4xl w-full rounded-2xl overflow-hidden  ">
          {/* Left — poster panel */}
          <div className="hidden md:flex flex-col justify-end w-84 shrink-0  relative p-6 overflow-hidden">
            {/* filmstrip bg */}
            <div className="absolute inset-0 opacity-20 p-1">
              <img
                src="https://image.tmdb.org/t/p/w780/w2M4SzbeKP4H4Q8rOVu1KC9Vbq2.jpg"
                className="h-full w-full object-cover"
                alt=""
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold leading-snug">
                Dive into
                <br />
                endless hours
                <br />
                of entertainment.
              </h2>
              <p className="text-muted-foreground text-sm mt-2 font-light">
                Thousands of titles, one account.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="flex-1 bg-card flex flex-col justify-center lg:p-10 p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Welcome back
            </p>
            <h1 className="lg:text-4xl text-2xl font-bold  mb-3">
              Sign in to continue
            </h1>
            <p className="lg:text-base text-sm text-muted-foreground font-light mb-10 leading-relaxed">
              Pick up right where you left off.
              <br />
              Your watchlist is waiting.
            </p>

            {/* Feature chips */}
            <div className="flex justify-between gap-4 mb-8 text-sm ">
              <span className="flex items-center gap-1.5">
                <Star className="size-4.5" />
                Watchlist sync
              </span>
              <span className="flex items-center gap-1.5">
                <Film className="size-4.5" />
                Continue watching
              </span>
              <span className="lg:flex hidden items-center gap-1.5">
                <Monitor className="size-4.5" />
                Multi-profile
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border " />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                one-click sign in
              </span>
              <div className="flex-1 h-px bg-border " />
            </div>

            <button
              // onClick={() =>
              //   signIn("google", { callbackUrl: "/login/profiles" })
              // }
              onClick={() =>
                window.open(
                  "/api/auth/signin/google?callbackUrl=/login/profiles",
                  "_blank",
                )
              }
              className="flex items-center justify-center gap-2.5 w-full py-2.5 px-5 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium text-neutral-800 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="text-xs text-muted-foreground text-center mt-5 leading-relaxed">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2 hover:text-neutral-600"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-neutral-600"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

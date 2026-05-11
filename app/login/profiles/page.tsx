"use client";
import { Profile1, Profile2, Profile4, Profile5 } from "@/assets/profiles";
import { useEffect, useState } from "react";
import { Plus, Pencil, LogOut } from "lucide-react";
import { KidsToggle } from "./kids-toggle";
import { AvatarPicker } from "./avatar-picker";
import { cn } from "@/lib/utils";
import { Profile, useProfiles } from "@/hook/account/get-profiles";
import { useRouter } from "next/navigation";
import { useVerifyPin } from "@/hook/account/post-verify";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { AnimatePresence, motion } from "motion/react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type View =
  | "select"
  | "selected"
  | "edit"
  | "managing"
  | "adding"
  | "changingPin";

const AVATAR_MAP: Record<string, React.ReactNode> = {
  svg1: <Profile1 />,
  svg2: <Profile2 />,
  svg3: <Profile5 />,
  svg4: <Profile4 />,
};

const EMPTY_FORM = {
  name: "",
  avatar_type: "svg1",
  is_kids: false,
  pin: "",
};

export default function WhoIsWatching() {
  const { update } = useSession();
  const router = useRouter();
  const {
    profiles,
    isLoading,
    createProfile,
    isCreating,
    deleteProfile,
    updateProfile,
    isUpdating,
    isDeleting,
  } = useProfiles();
  const {
    mutateAsync: verifyPin,
    isPending: isVerifying,
    isError: pinError,
    reset: resetPin,
  } = useVerifyPin();

  const [view, setView] = useState<View>("select");
  const [selected, setSelected] = useState<Profile | null>(null);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [pinValue, setPinValue] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [pinForm, setPinForm] = useState({
    current: "",
    next: "",
    currentError: false,
  });
  useEffect(() => {
    console.log("[WhoIsWatching] MOUNTED at", performance.now());
    return () => console.log("[WhoIsWatching] UNMOUNTED at", performance.now());
  }, []);
  const handleProfileClick = (profile: Profile) => {
    if (view === "managing") {
      setEditing(profile);
      setEditForm({
        name: profile.name,
        avatar_type: profile.avatar_type,
        is_kids: profile.is_kids,
        pin: "",
      });
      setView("edit");
    } else {
      setSelected(profile);
      setView("selected");
    }
  };

  const handleAddProfile = async () => {
    if (!form.name.trim()) return;
    await createProfile({
      name: form.name.trim(),
      avatar_type: form.avatar_type,
      is_kids: form.is_kids,
      pin: form.pin || null,
    });
    setForm(EMPTY_FORM);
    setView("select");
  };

  const handleDelete = async () => {
    if (!editing?.id) return;
    await deleteProfile(editing.id);
    setEditing(null);
    setView("managing");
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    await updateProfile({
      id: editing.id,
      name: editForm.name,
      avatar_type: editForm.avatar_type,
      is_kids: editForm.is_kids,
      ...(editForm.pin ? { pin: editForm.pin } : {}),
    });
    setEditing(null);
    setView("managing");
  };
  const handleVerifyPin = async () => {
    if (!selected) return;

    if (selected.has_pin) {
      const res = await verifyPin({ profileId: selected.id, pin: pinValue });
      if (!res.success) return;
    }

    const res = await fetch("/api/profiles/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId: selected.id }),
    });

    if (res.ok) {
      await update();
      router.push("/");
    }
  };
  // const handleVerifyPin = async () => {
  //   if (!selected) return;

  //   const sessionPayload = {
  //     activeProfileId: selected.id,
  //     avatarType: selected.avatar_type,
  //     profileName: selected.name,
  //     isKids: selected.is_kids,
  //   };

  //   if (!selected.has_pin) {
  //     await update(sessionPayload);
  //     router.push("/");
  //     return;
  //   }

  //   const res = await verifyPin({ profileId: selected.id, pin: pinValue });
  //   if (res.success) {
  //     await update(sessionPayload);
  //     router.push("/");
  //   }
  // };
  const handleChangePin = async () => {
    if (!editing) return;

    // if profile has existing pin, verify it first
    if (editing.has_pin) {
      try {
        await verifyPin({ profileId: editing.id, pin: pinForm.current });
      } catch {
        setPinForm((prev) => ({ ...prev, currentError: true }));
        return;
      }
    }

    await updateProfile({
      id: editing.id,
      name: editing.name,
      avatar_type: editing.avatar_type,
      is_kids: editing.is_kids,
      pin: pinForm.next,
    });

    setPinForm({ current: "", next: "", currentError: false });
    setView("edit");
  };
  const sharedBtnOutline =
    "px-6 py-2 text-sm uppercase tracking-widest text-muted-foreground border border-input hover:text-foreground hover:border-foreground/50 transition-all duration-200";
  const sharedBtnSolid =
    "px-6 py-2 text-sm uppercase tracking-widest bg-white text-black hover:bg-gray-200 transition-all duration-200";

  const isManaging = view === "managing";

  return (
    <AnimatePresence>
      <div className="overflow-hidden">
        {view === "selected" && selected ? (
          <motion.div
            key="selected"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-h-screen bg-background flex flex-col items-center justify-center "
          >
            <div className="relative w-40 h-40 border-4 border-white overflow-hidden">
              {AVATAR_MAP[selected.avatar_type]}
            </div>
            {selected.is_kids && (
              <span className="mt-3 px-3 py-0.5 text-xs uppercase tracking-widest bg-red-600  rounded-sm">
                Kids
              </span>
            )}
            <p className=" text-3xl font-light mt-3 text-center max-w-xs">
              {selected.name}
            </p>
            <div className="flex flex-col mt-6 space-y-3">
              {selected.has_pin && (
                <>
                  <InputOTP
                    maxLength={4}
                    pattern={REGEXP_ONLY_DIGITS}
                    value={pinValue}
                    onChange={(value) => {
                      setPinValue(value);
                      resetPin();
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} masked />
                      <InputOTPSlot index={1} masked />
                      <InputOTPSlot index={2} masked />
                      <InputOTPSlot index={3} masked />
                    </InputOTPGroup>
                  </InputOTP>
                  {pinError && (
                    <p className="text-red-400 text-sm mb-4 tracking-wide text-center">
                      PIN is incorrect!
                    </p>
                  )}
                </>
              )}
              <button
                onClick={handleVerifyPin}
                disabled={
                  isVerifying || (selected.has_pin && pinValue.length !== 4)
                }
                className={sharedBtnOutline}
              >
                {isVerifying ? "Verifying..." : "Enter"}
              </button>
              <button
                onClick={() => {
                  setSelected(null);
                  setPinValue("");
                  resetPin();
                  setView("select");
                }}
                className={sharedBtnOutline}
              >
                Back to Profiles
              </button>
            </div>
          </motion.div>
        ) : view === "changingPin" && editing ? (
          <motion.div
            key="changingPin"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-h-screen bg-background flex flex-col items-center justify-center gap-6"
          >
            <h1 className=" text-4xl font-light tracking-wide">Change PIN</h1>

            {editing.has_pin && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-[#6D6D6D] text-sm tracking-wide">
                  Current PIN
                </p>
                <InputOTP
                  maxLength={4}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={pinForm.current}
                  onChange={(value) =>
                    setPinForm((prev) => ({
                      ...prev,
                      current: value,
                      currentError: false,
                    }))
                  }
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} masked />
                    <InputOTPSlot index={1} masked />
                    <InputOTPSlot index={2} masked />
                    <InputOTPSlot index={3} masked />
                  </InputOTPGroup>
                </InputOTP>
                {pinForm.currentError && (
                  <p className="text-red-400 text-sm tracking-wide text-center">
                    Current PIN is incorrect!
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col items-center gap-2">
              <p className="text-[#6D6D6D] text-sm tracking-wide">New PIN</p>
              <InputOTP
                maxLength={4}
                pattern={REGEXP_ONLY_DIGITS}
                value={pinForm.next}
                onChange={(value) =>
                  setPinForm((prev) => ({ ...prev, next: value }))
                }
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} masked />
                  <InputOTPSlot index={1} masked />
                  <InputOTPSlot index={2} masked />
                  <InputOTPSlot index={3} masked />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleChangePin}
                disabled={
                  isVerifying ||
                  isUpdating ||
                  (editing.has_pin && pinForm.current.length !== 4) ||
                  pinForm.next.length !== 4
                }
                className={`${sharedBtnSolid} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isVerifying || isUpdating ? "Saving..." : "Save PIN"}
              </button>
              <button
                onClick={() => {
                  setPinForm({ current: "", next: "", currentError: false });
                  setView("edit");
                }}
                className={sharedBtnOutline}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : view === "edit" && editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-h-screen bg-background flex flex-col items-center justify-center"
          >
            <h1 className=" text-4xl font-light mb-10 tracking-wide">
              Edit Profile
            </h1>
            <AvatarPicker
              value={editForm.avatar_type}
              onChange={(value) =>
                setEditForm((prev) => ({ ...prev, avatar_type: value }))
              }
            />

            <KidsToggle
              value={editForm.is_kids}
              onChange={(value) =>
                setEditForm((prev) => ({ ...prev, is_kids: value }))
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleSaveEdit} className={sharedBtnSolid}>
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(null);
                  setView("managing");
                }}
                className={sharedBtnOutline}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPinForm({ current: "", next: "", currentError: false });
                  setView("changingPin");
                }}
                className={cn("col-span-2", sharedBtnOutline)}
              >
                {editing.has_pin ? "Change PIN" : "Set PIN"}
              </button>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="mt-6 text-sm uppercase tracking-widest text-[#6D6D6D] hover:text-red-500 transition-colors duration-300">
                  Delete Profile
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this profile?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This profile and its viewing history, preferences, and saved
                    data will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <Button disabled={isDeleting} onClick={handleDelete}>
                    {isDeleting ? " Deleting..." : " Delete Profile"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        ) : view === "adding" ? (
          <motion.div
            key="adding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-h-screen bg-background flex  items-center justify-center"
          >
            <div className="flex flex-col items-center">
              <h1 className=" text-4xl font-light mb-10 tracking-wide">
                Add Profile
              </h1>
              <AvatarPicker
                value={form.avatar_type}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, avatar_type: value }))
                }
                random={true}
              />
              <KidsToggle
                value={form.is_kids}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, is_kids: value }))
                }
              />
              <input
                className="bg-card  text-center h-10 w-full  px-3 mb-6 border border-[#555] focus:outline-none focus:border-white"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                autoFocus
              />
              <div className="mb-6 flex flex-col items-center gap-2">
                <p className="text-[#6D6D6D] text-sm tracking-wide">
                  4-digit PIN (optional)
                </p>
                <InputOTP
                  maxLength={4}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={form.pin}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, pin: value }))
                  }
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} masked />
                    <InputOTPSlot index={1} masked />
                    <InputOTPSlot index={2} masked />
                    <InputOTPSlot index={3} masked />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddProfile}
                  disabled={!form.name.trim() || isCreating}
                  className={`${sharedBtnSolid} disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  Continue
                </button>
                <button
                  onClick={() => {
                    setForm({
                      name: "",
                      avatar_type: "svg1",
                      is_kids: false,
                      pin: "",
                    });

                    setView("select");
                  }}
                  className={sharedBtnOutline}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-h-screen bg-background flex flex-col items-center justify-center "
          >
            <div className="absolute top-0 px-8 py-6 flex justify-between items-center inset-x-0">
              <div className="size-10">
                {/* <img className="h-full w-full object-contain" src={logo.src} alt="" /> */}
              </div>
              <span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <LogOut className="size-6" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Log out of your account?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        You’ll be signed out of your account and will need to
                        log in again to access your data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button onClick={() => signOut({ callbackUrl: "/" })}>
                        Log out <LogOut />
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </span>
            </div>
            <h1 className=" lg:text-5xl text-2xl font-light mb-12 tracking-wide">
              {isManaging ? "Manage Profiles" : "Who's watching?"}
            </h1>
            <div className="flex flex-wrap justify-center lg:gap-6 mb-12 max-w-3xl">
              {isLoading ? (
                <>
                  <div>
                    <Skeleton className="lg:size-36 size-25" />
                    <Skeleton className="h-4 w-20 mt-5 mx-auto" />
                  </div>
                  <div>
                    <Skeleton className="lg:size-36 size-25" />
                    <Skeleton className="h-4 w-20 mt-5 mx-auto" />
                  </div>{" "}
                  <div>
                    <Skeleton className="lg:size-36 size-25" />
                    <Skeleton className="h-4 w-20 mt-5 mx-auto" />
                  </div>
                </>
              ) : (
                profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex flex-col items-center cursor-pointer group lg:w-36 w-25"
                    onClick={() => handleProfileClick(profile)}
                  >
                    <div className="relative lg:size-36 size-25 border-4 border-[#1f1f1f] group-hover:border-white transition-all duration-300 overflow-hidden">
                      {AVATAR_MAP[profile.avatar_type]}
                      {isManaging && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Pencil className=" size-7" />
                        </div>
                      )}
                      {profile.is_kids && !isManaging && (
                        <span className="absolute bottom-0 left-0 right-0 text-center text-xs uppercase tracking-wider bg-red-600  py-0.5">
                          Kids
                        </span>
                      )}
                    </div>
                    <span className="mt-4 text-base text-[#6D6D6D] group-hover: transition-colors duration-300 text-center leading-snug">
                      {profile.name}
                    </span>
                  </div>
                ))
              )}
              {profiles.length < 5 && !isLoading && (
                <div
                  className="flex flex-col items-center cursor-pointer group w-36"
                  onClick={() => setView("adding")}
                >
                  <div className="lg:size-36 size-25 border-4 border-[#1f1f1f] group-hover:border-white transition-all duration-300 overflow-hidden flex justify-center items-center">
                    <Plus className="size-10 text-[#6D6D6D] group-hover: transition-colors duration-300" />
                  </div>
                  <span className="mt-4 text-base text-[#6D6D6D] group-hover: transition-colors duration-300 text-center leading-snug">
                    Add profile
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setView(isManaging ? "select" : "managing")}
              className={sharedBtnOutline}
            >
              {isManaging ? "Done" : "Manage Profiles"}
            </button>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}

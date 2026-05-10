"use client";
import { Profile1, Profile2, Profile4, Profile5 } from "@/assets/profiles";
import { useState } from "react";
import { Plus, Pencil, LogOut } from "lucide-react";
import { KidsToggle } from "./kids-toggle";
import { AvatarPicker } from "./avatar-picker";
import { cn } from "@/lib/utils";
import { Profile, useProfiles } from "@/hook/account/get-profiles";
import { useRouter } from "next/navigation";
import { useVerifyPin } from "@/hook/account/post-verify";
import { useSession } from "next-auth/react";
import logo from "@/assets/brand.svg";
import { signOut } from "next-auth/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
type View = "select" | "selected" | "edit" | "managing" | "adding";

const AVATAR_MAP: Record<string, React.ReactNode> = {
  svg1: <Profile1 />,
  svg2: <Profile2 />,
  svg3: <Profile5 />,
  svg4: <Profile4 />,
};

export default function WhoIsWatching() {
  const { update } = useSession();
  const router = useRouter();
  const { profiles, createProfile, isCreating, deleteProfile, updateProfile } =
    useProfiles();
  const { mutateAsync: verifyPin, isPending: isVerifying } = useVerifyPin();
  const [view, setView] = useState<View>("select");
  const [selected, setSelected] = useState<Profile | null>(null);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [pinState, setPinState] = useState({
    value: "",
    error: false,
  });
  const [form, setForm] = useState({
    name: "",
    avatar_type: "svg1",
    is_kids: false,
    pin: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    avatar_type: "svg1",
    is_kids: false,
    pin: "",
  });

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

    setForm({
      name: "",
      avatar_type: "svg1",
      is_kids: false,
      pin: "",
    });
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
      pin: editForm.pin || null,
    });

    setEditing(null);
    setView("managing");
  };

  // const handleVerifyPin = async () => {
  //   if (!selected) return;

  //   try {
  //     const res = await verifyPin({
  //       profileId: selected.id,
  //       pin: pinState.value,
  //     });

  //     if (res.success) {
  //       // 🔥 THIS IS THE NEXT STEP
  //       await update({
  //         activeProfileId: selected.id,
  //         avatarType: selected.avatar_type,
  //         profileName: selected.name,
  //         isKids: selected.is_kids,
  //       });

  //       router.push("/");
  //     }
  //   } catch (err: any) {
  //     setPinState((prev) => ({
  //       ...prev,
  //       error: true,
  //     }));
  //   }
  // };

  const handleVerifyPin = async () => {
    if (!selected) return;

    // No PIN set — go straight in
    if (!selected.has_pin) {
      await update({
        activeProfileId: selected.id,
        avatarType: selected.avatar_type,
        profileName: selected.name,
        isKids: selected.is_kids,
      });
      router.push("/");
      return;
    }

    // Has PIN — verify it
    try {
      const res = await verifyPin({
        profileId: selected.id,
        pin: pinState.value,
      });

      if (res.success) {
        await update({
          activeProfileId: selected.id,
          avatarType: selected.avatar_type,
          profileName: selected.name,
          isKids: selected.is_kids,
        });
        router.push("/");
      }
    } catch (err: any) {
      setPinState((prev) => ({ ...prev, error: true }));
    }
  };
  const sharedBtnOutline =
    "px-6 py-2 text-sm uppercase tracking-widest text-[#6D6D6D] border border-[#6D6D6D] hover:text-white hover:border-white transition-all duration-300";
  const sharedBtnSolid =
    "px-6 py-2 text-sm uppercase tracking-widest bg-white text-black hover:bg-gray-200 transition-all duration-300";

  if (view === "selected" && selected) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center animate-[fadeIn_400ms_ease_both]">
        <div className="relative w-40 h-40 border-4 border-white overflow-hidden">
          {AVATAR_MAP[selected.avatar_type]}
        </div>
        {selected.is_kids && (
          <span className="mt-3 px-3 py-0.5 text-xs uppercase tracking-widest bg-red-600 text-white rounded-sm">
            Kids
          </span>
        )}
        <p className="text-white text-3xl font-light mt-3 text-center max-w-xs">
          {selected.name}
        </p>
        <div className="flex flex-col mt-6 space-y-3">
          {selected.has_pin && (
            <>
              <InputOTP
                maxLength={4}
                pattern={REGEXP_ONLY_DIGITS}
                value={pinState.value}
                onChange={(value) => setPinState({ value, error: false })}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} masked />
                  <InputOTPSlot index={1} masked />
                  <InputOTPSlot index={2} masked />
                  <InputOTPSlot index={3} masked />
                </InputOTPGroup>
              </InputOTP>

              {pinState.error && (
                <p className="text-red-400 text-sm mb-4 tracking-wide text-center">
                  PIN is incorrect!
                </p>
              )}
            </>
          )}

          <button
            onClick={handleVerifyPin}
            className={sharedBtnOutline}
            disabled={selected.has_pin && pinState.value.length !== 4}
          >
            Enter
          </button>

          <button
            onClick={() => {
              setSelected(null);
              setView("select");
            }}
            className={sharedBtnOutline}
          >
            Back to Profiles
          </button>
        </div>
      </div>
    );
  }

  if (view === "edit" && editing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center animate-[fadeIn_400ms_ease_both]">
        <h1 className="text-white text-4xl font-light mb-10 tracking-wide">
          Edit Profile
        </h1>
        <AvatarPicker
          value={editForm.avatar_type}
          onChange={(value) =>
            setEditForm((prev) => ({ ...prev, avatar_type: value }))
          }
        />
        <div className="col-span-2 flex flex-col items-center gap-2">
          <p className="text-[#6D6D6D] text-sm tracking-wide">
            New PIN (leave blank to keep current)
          </p>
          <InputOTP
            maxLength={4}
            pattern={REGEXP_ONLY_DIGITS}
            value={editForm.pin}
            onChange={(value) =>
              setEditForm((prev) => ({ ...prev, pin: value }))
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
          <button className={cn("col-span-2", sharedBtnOutline)}>
            Change 4 digit PIN
          </button>
        </div>

        <button
          onClick={handleDelete}
          className="mt-6 text-sm uppercase tracking-widest text-[#6D6D6D] hover:text-red-500 transition-colors duration-300"
        >
          Delete Profile
        </button>
      </div>
    );
  }

  if (view === "adding") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center animate-[fadeIn_400ms_ease_both]">
        <h1 className="text-white text-4xl font-light mb-10 tracking-wide">
          Add Profile
        </h1>
        <AvatarPicker
          value={form.avatar_type}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, avatar_type: value }))
          }
        />
        <KidsToggle
          value={form.is_kids}
          onChange={(value) => setForm((prev) => ({ ...prev, is_kids: value }))}
        />
        <input
          className="bg-card text-white text-center h-10 w-64 px-3 mb-6 border border-[#555] focus:outline-none focus:border-white"
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
            onChange={(value) => setForm((prev) => ({ ...prev, pin: value }))}
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
    );
  }

  const isManaging = view === "managing";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center animate-[fadeIn_500ms_ease_200ms_both]">
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
                <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  You’ll be signed out of your account and will need to log in
                  again to access your data.
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
      <h1 className="text-white lg:text-5xl text-2xl font-light mb-12 tracking-wide">
        {isManaging ? "Manage Profiles" : "Who's watching?"}
      </h1>
      <div className="flex flex-wrap justify-center lg:gap-6 mb-12 max-w-3xl">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex flex-col items-center cursor-pointer group lg:w-36 w-25"
            onClick={() => handleProfileClick(profile)}
          >
            <div className="relative lg:size-36 size-25 border-4 border-[#1f1f1f] group-hover:border-white transition-all duration-300 overflow-hidden">
              {AVATAR_MAP[profile.avatar_type]}
              {isManaging && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Pencil className="text-white size-7" />
                </div>
              )}
              {profile.is_kids && !isManaging && (
                <span className="absolute bottom-0 left-0 right-0 text-center text-xs uppercase tracking-wider bg-red-600 text-white py-0.5">
                  Kids
                </span>
              )}
            </div>
            <span className="mt-4 text-base text-[#6D6D6D] group-hover:text-white transition-colors duration-300 text-center leading-snug">
              {profile.name}
            </span>
          </div>
        ))}
        {profiles.length < 5 && (
          <div
            className="flex flex-col items-center cursor-pointer group w-36"
            onClick={() => setView("adding")}
          >
            <div className="lg:size-36 size-25 border-4 border-[#1f1f1f] group-hover:border-white transition-all duration-300 overflow-hidden flex justify-center items-center">
              <Plus className="size-10 text-[#6D6D6D] group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="mt-4 text-base text-[#6D6D6D] group-hover:text-white transition-colors duration-300 text-center leading-snug">
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
    </div>
  );
}

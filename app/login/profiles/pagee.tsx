"use client";
import { Profile1, Profile2, Profile4, Profile5 } from "@/assets/profiles";
import { useState, useEffect } from "react";
import logo from "@/assets/brand.svg";
import { Plus, Pencil } from "lucide-react";
import { KidsToggle } from "./kids-toggle";
import { AvatarPicker } from "./avatar-picker";

type Profile = {
  id: string;
  name: string;
  avatar_type: string;
  is_kids: boolean;
};

type View = "select" | "selected" | "edit" | "managing" | "adding";

const AVATAR_MAP: Record<string, React.ReactNode> = {
  svg1: <Profile1 />,
  svg2: <Profile2 />,
  svg3: <Profile5 />,
  svg4: <Profile4 />,
};

function Logo() {
  return (
    <div className="size-12 mb-10">
      <img className="h-full w-full object-contain" src={logo.src} alt="" />
    </div>
  );
}

export default function WhoIsWatching() {
  const [view, setView] = useState<View>("select");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [editing, setEditing] = useState<Profile | null>(null);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("svg1");
  const [editKids, setEditKids] = useState(false);

  // Add form state
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("svg1");
  const [newKids, setNewKids] = useState(false);

  // Loading / error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // ── Fetch all profiles on mount ──────────────────────────────────────────
  useEffect(() => {
    async function loadProfiles() {
      try {
        const res = await fetch("/api/profiles");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load profiles.");
        setProfiles(data.profiles);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setPageLoading(false);
      }
    }
    loadProfiles();
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const clearError = () => setError(null);

  const handleProfileClick = (profile: Profile) => {
    clearError();
    if (view === "managing") {
      setEditing(profile);
      setEditName(profile.name);
      setEditType(profile.avatar_type);
      setEditKids(profile.is_kids);
      setView("edit");
    } else {
      setSelected(profile);
      setView("selected");
    }
  };

  // ── Create ───────────────────────────────────────────────────────────────
  const handleAddProfile = async () => {
    if (!newName.trim()) return;
    clearError();
    setLoading(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          avatar_type: newType,
          is_kids: newKids,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create profile.");
      setProfiles((prev) => [...prev, data.profile]);
      setNewName("");
      setNewType("svg1");
      setNewKids(false);
      setView("select");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Update ───────────────────────────────────────────────────────────────
  const handleSaveEdit = async () => {
    if (!editing) return;
    clearError();
    setLoading(true);
    try {
      const res = await fetch(`/api/profiles/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          avatar_type: editType,
          is_kids: editKids,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile.");
      setProfiles((prev) =>
        prev.map((p) => (p.id === editing.id ? data.profile : p)),
      );
      setEditing(null);
      setView("managing");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!editing) return;
    clearError();
    setLoading(true);
    try {
      const res = await fetch(`/api/profiles/${editing.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete profile.");
      setProfiles((prev) => prev.filter((p) => p.id !== editing.id));
      setEditing(null);
      setView("managing");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const sharedBtnOutline =
    "px-6 py-2 text-sm uppercase tracking-widest text-[#6D6D6D] border border-[#6D6D6D] hover:text-white hover:border-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed";
  const sharedBtnSolid =
    "px-6 py-2 text-sm uppercase tracking-widest bg-white text-black hover:bg-gray-200 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed";

  // ── Page loading ──────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Logo />
        <p className="text-[#6D6D6D] text-sm uppercase tracking-widest animate-pulse">
          Loading profiles…
        </p>
      </div>
    );
  }

  // ── Selected (PIN) view ───────────────────────────────────────────────────
  if (view === "selected" && selected) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center animate-[fadeIn_400ms_ease_both]">
        <Logo />
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
          <input
            className="border-2 mt-3 h-10 text-center bg-transparent text-white"
            placeholder="Enter your PIN"
            type="password"
            maxLength={4}
          />
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

  // ── Edit view ─────────────────────────────────────────────────────────────
  if (view === "edit" && editing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center animate-[fadeIn_400ms_ease_both]">
        <Logo />
        <h1 className="text-white text-4xl font-light mb-10 tracking-wide">
          Edit Profile
        </h1>
        <AvatarPicker value={editType} onChange={setEditType} />
        <input
          className="bg-[#333] text-white text-center h-10 w-64 px-3 mb-6 border border-[#555] focus:outline-none focus:border-white"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
        <KidsToggle value={editKids} onChange={setEditKids} />
        {error && (
          <p className="text-red-400 text-sm mb-4 tracking-wide">{error}</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={handleSaveEdit}
            disabled={loading || !editName.trim()}
            className={sharedBtnSolid}
          >
            {loading ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => {
              clearError();
              setEditing(null);
              setView("managing");
            }}
            disabled={loading}
            className={sharedBtnOutline}
          >
            Cancel
          </button>
        </div>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="mt-6 text-sm uppercase tracking-widest text-[#6D6D6D] hover:text-red-500 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Deleting…" : "Delete Profile"}
        </button>
      </div>
    );
  }

  // ── Add view ──────────────────────────────────────────────────────────────
  if (view === "adding") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center animate-[fadeIn_400ms_ease_both]">
        <Logo />
        <h1 className="text-white text-4xl font-light mb-10 tracking-wide">
          Add Profile
        </h1>
        <AvatarPicker value={newType} onChange={setNewType} />
        <input
          className="bg-[#333] text-white text-center h-10 w-64 px-3 mb-6 border border-[#555] focus:outline-none focus:border-white"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          autoFocus
        />
        <KidsToggle value={newKids} onChange={setNewKids} />
        {error && (
          <p className="text-red-400 text-sm mb-4 tracking-wide">{error}</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={handleAddProfile}
            disabled={loading || !newName.trim()}
            className={sharedBtnSolid}
          >
            {loading ? "Creating…" : "Continue"}
          </button>
          <button
            onClick={() => {
              clearError();
              setNewName("");
              setNewType("svg1");
              setNewKids(false);
              setView("select");
            }}
            disabled={loading}
            className={sharedBtnOutline}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Select / Manage view ──────────────────────────────────────────────────
  const isManaging = view === "managing";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center animate-[fadeIn_500ms_ease_200ms_both]">
      <Logo />
      <h1 className="text-white text-5xl font-light mb-12 tracking-wide">
        {isManaging ? "Manage Profiles" : "Who's watching?"}
      </h1>
      {error && (
        <p className="text-red-400 text-sm mb-6 tracking-wide">{error}</p>
      )}
      <div className="flex flex-wrap justify-center gap-6 mb-12 max-w-3xl">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex flex-col items-center cursor-pointer group w-36"
            onClick={() => handleProfileClick(profile)}
          >
            <div className="relative w-36 h-36 border-4 border-[#1f1f1f] group-hover:border-white transition-all duration-300 overflow-hidden">
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
        {profiles.length < 5 && !isManaging && (
          <div
            className="flex flex-col items-center cursor-pointer group w-36"
            onClick={() => {
              clearError();
              setView("adding");
            }}
          >
            <div className="w-36 h-36 border-4 border-[#1f1f1f] group-hover:border-white transition-all duration-300 overflow-hidden flex justify-center items-center">
              <Plus className="size-10 text-[#6D6D6D] group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="mt-4 text-base text-[#6D6D6D] group-hover:text-white transition-colors duration-300 text-center leading-snug">
              Add profile
            </span>
          </div>
        )}
      </div>
      <button
        onClick={() => {
          clearError();
          setView(isManaging ? "select" : "managing");
        }}
        className={sharedBtnOutline}
      >
        {isManaging ? "Done" : "Manage Profiles"}
      </button>
    </div>
  );
}

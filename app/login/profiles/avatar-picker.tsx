import { Profile1, Profile2, Profile4, Profile5 } from "@/assets/profiles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Check, Pencil } from "lucide-react";
import { useEffect } from "react";

export function AvatarPicker({
  value,
  onChange,
  random = false,
}: {
  value: string;
  onChange: (type: string) => void;
  random?: boolean;
}) {
  const AVATAR_MAP: Record<string, React.ReactNode> = {
    svg1: <Profile1 />,
    svg2: <Profile2 />,
    svg3: <Profile5 />,
    svg4: <Profile4 />,
  };

  const AVATAR_OPTIONS = ["svg1", "svg2", "svg3", "svg4"];

  useEffect(() => {
    if (!random) return;

    const randomAvatar =
      AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];

    onChange(randomAvatar);
  }, [random]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative size-35 border-4 border-white overflow-hidden mb-8 cursor-pointer group">
          {AVATAR_MAP[value]}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Pencil className="text-white size-6" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a1a] border-[#333] text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white text-center tracking-wide uppercase text-sm font-light">
            Choose an avatar
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {AVATAR_OPTIONS.map((type) => (
            <DialogClose asChild key={type}>
              <div
                onClick={() => onChange(type)}
                className="relative cursor-pointer"
              >
                <div
                  className={`w-full aspect-square overflow-hidden transition-all duration-200 ${
                    value === type
                      ? "border-4 border-white scale-105"
                      : "border-4 border-[#333] hover:border-[#555]"
                  }`}
                >
                  {AVATAR_MAP[type]}
                </div>
                {value === type && (
                  <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5">
                    <Check className="size-3 text-black" />
                  </div>
                )}
              </div>
            </DialogClose>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

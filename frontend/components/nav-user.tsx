"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  CircleUserRoundIcon,
  CircleHelpIcon,
  EllipsisVerticalIcon,
  LogOutIcon,
  Settings2Icon,
} from "lucide-react";

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({ user }: NavUserProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-lg p-2 transition hover:bg-sidebar-accent"
      >
        <Avatar className="size-8 rounded-lg">
          <AvatarImage src={user.avatar} />

          <AvatarFallback className="rounded-lg">
            {(user.name?.charAt(0) ?? "U").toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-left overflow-hidden">
          <p className="truncate text-sm font-medium">{user.name}</p>

          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>

        <EllipsisVerticalIcon className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute bottom-14 left-0 z-50 w-64 rounded-lg border bg-background shadow-xl">
          <div className="border-b p-4">
            <p className="font-medium">{user.name}</p>

            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <button
            onClick={() => {
              setOpen(false);
              router.push("/profile");
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-muted"
          >
            <CircleUserRoundIcon size={18} />
            Perfil
          </button>

          <button
            onClick={() => {
              setOpen(false);
              router.push("/settings");
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-muted"
          >
            <Settings2Icon size={18} />
            Configurações
          </button>

          <button
            onClick={() => {
              setOpen(false);
              router.push("/help");
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-muted"
          >
            <CircleHelpIcon size={18} />
            Ajuda
          </button>

          <div className="my-1 border-t" />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOutIcon size={18} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

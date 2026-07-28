"use client";

import { Bell, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <h2 className="text-xl font-semibold">BuildFlow ERP</h2>

      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer" />

        <UserCircle size={34} />
      </div>
    </header>
  );
}

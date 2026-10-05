"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Messages } from "@/i18n/messages";
import { cn } from "@/lib/utils";
import { ctaVariants } from "../site/button-link";

export function AdminLoginForm({ messages }: { messages: Messages["admin"] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          password: String(data.get("password") ?? ""),
        }),
      });
      if (res.status === 429) {
        setError(messages.errors.rateLimited);
        return;
      }
      if (!res.ok) {
        setError(messages.errors.invalid);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError(messages.errors.generic);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-semibold">{messages.email}</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="h-12 w-full rounded-xl border border-cream-300 bg-cream-50 px-4"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-semibold">{messages.password}</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          className="h-12 w-full rounded-xl border border-cream-300 bg-cream-50 px-4"
        />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={cn(ctaVariants({ variant: "primary", size: "lg" }), "w-full")}
      >
        {messages.submit}
      </button>
    </form>
  );
}

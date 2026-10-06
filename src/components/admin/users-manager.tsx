"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type User = { id: string; name: string; email: string; created_at: string };

export function UsersManager({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="space-y-8">
      <form
        className="grid gap-3 rounded-2xl border border-cream-300 bg-cream-50 p-4 sm:p-5 md:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form);
          setPending(true);
          setError(null);
          void fetch("/api/admin/users", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              name: String(data.get("name") ?? ""),
              email: String(data.get("email") ?? ""),
              password: String(data.get("password") ?? ""),
            }),
          })
            .then(async (res) => {
              if (!res.ok) throw new Error((await res.json()).error ?? "failed");
              form.reset();
              router.refresh();
            })
            .catch((err: Error) => setError(err.message))
            .finally(() => setPending(false));
        }}
      >
        <input
          name="name"
          required
          placeholder="Ad Soyad"
          className="h-11 rounded-xl border border-cream-300 bg-white px-3 text-base"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="E-posta"
          className="h-11 rounded-xl border border-cream-300 bg-white px-3 text-base"
        />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Parola (≥8)"
          className="h-11 rounded-xl border border-cream-300 bg-white px-3 text-base"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-xl bg-navy-800 font-semibold text-cream-50"
        >
          Admin ekle
        </button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <ul className="space-y-3">
        {users.map((user) => (
          <li key={user.id} className="rounded-2xl border border-cream-300 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-navy-900">
                  {user.name}{" "}
                  {user.id === currentUserId ? (
                    <span className="text-xs font-medium text-ink-500">(siz)</span>
                  ) : null}
                </p>
                <p className="truncate text-sm text-ink-600">{user.email}</p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                <button
                  type="button"
                  className="h-11 rounded-xl border border-cream-300 px-3 text-sm font-semibold sm:h-9 sm:rounded-lg"
                  onClick={() => {
                    const password = window.prompt("Yeni parola (≥8 karakter)");
                    if (!password) return;
                    void fetch("/api/admin/users", {
                      method: "PATCH",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ id: user.id, password }),
                    }).then((res) => {
                      if (!res.ok) setError("Parola güncellenemedi");
                      else setError(null);
                    });
                  }}
                >
                  Parola değiştir
                </button>
                {user.id !== currentUserId ? (
                  <button
                    type="button"
                    className="h-11 rounded-xl border border-destructive/40 px-3 text-sm font-semibold text-destructive sm:h-9 sm:rounded-lg"
                    onClick={() => {
                      if (!window.confirm(`${user.email} silinsin mi?`)) return;
                      void fetch("/api/admin/users", {
                        method: "DELETE",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ id: user.id }),
                      }).then(async (res) => {
                        if (!res.ok) {
                          const body = await res.json();
                          setError(
                            body.error === "last_admin" ? "Son admin silinemez." : "Silinemedi",
                          );
                          return;
                        }
                        router.refresh();
                      });
                    }}
                  >
                    Sil
                  </button>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

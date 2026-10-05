import "server-only";

import { cookies } from "next/headers";

export const REQUEST_SUCCESS_COOKIE = "rdh_request_success";

export async function setRequestSuccessCookie(email: string) {
  const jar = await cookies();
  jar.set(REQUEST_SUCCESS_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
}

export async function consumeRequestSuccessEmail(): Promise<string | null> {
  const jar = await cookies();
  const email = jar.get(REQUEST_SUCCESS_COOKIE)?.value ?? null;
  if (email) jar.delete(REQUEST_SUCCESS_COOKIE);
  return email;
}

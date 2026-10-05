import "server-only";

import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { REQUEST_FILES_BUCKET } from "./config";
import type { ValidatedUpload } from "./validate";

function extForMime(mime: string): string {
  switch (mime) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    case "image/svg+xml":
      return "svg";
    case "application/pdf":
      return "pdf";
    default:
      return "bin";
  }
}

export async function storeValidatedUpload(
  upload: ValidatedUpload,
  kind: "logo" | "reference" | "other",
): Promise<{ storageKey: string }> {
  const admin = createAdminClient();
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const storageKey = `${y}/${m}/${kind}/${randomUUID()}.${extForMime(upload.mime)}`;

  const { error } = await admin.storage
    .from(REQUEST_FILES_BUCKET)
    .upload(storageKey, upload.bytes, {
      contentType: upload.mime,
      upsert: false,
    });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  return { storageKey };
}

export async function createSignedDownloadUrl(storageKey: string, expiresInSec = 120) {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(REQUEST_FILES_BUCKET)
    .createSignedUrl(storageKey, expiresInSec);
  if (error || !data?.signedUrl) throw new Error(error?.message ?? "signed_url_failed");
  return data.signedUrl;
}

export async function deleteStorageObjects(keys: string[]) {
  if (!keys.length) return;
  const admin = createAdminClient();
  const { error } = await admin.storage.from(REQUEST_FILES_BUCKET).remove(keys);
  if (error) throw new Error(error.message);
}

/** Talep + dosyaları kalıcı siler (Faz 3 arayüzü bunu kullanacak). */
export async function deleteRequestWithFiles(requestId: string) {
  const admin = createAdminClient();
  const { data: files, error: listError } = await admin
    .from("request_files")
    .select("storage_key")
    .eq("request_id", requestId);
  if (listError) throw new Error(listError.message);

  const keys = (files ?? []).map((f) => f.storage_key as string);
  await deleteStorageObjects(keys);

  const { error } = await admin.from("requests").delete().eq("id", requestId);
  if (error) throw new Error(error.message);
}

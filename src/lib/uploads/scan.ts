/**
 * Zararlı dosya tarama adaptörü.
 * Geliştirmede no-op; üretimde ClamAV vb. bağlanabilir.
 */
export type ScanResult = { clean: true } | { clean: false; reason: string };

export async function scanFile(bytes: Uint8Array, mime: string): Promise<ScanResult> {
  void bytes;
  void mime;
  if (process.env.UPLOAD_SCAN_ENABLED === "true") {
    // Hook noktası — henüz harici tarayıcı yok.
    return { clean: true };
  }
  return { clean: true };
}

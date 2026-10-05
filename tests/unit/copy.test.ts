import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import tr from "@/i18n/messages/tr";

/** Bölüm 3–4: yasak ifadeler hiçbir metinde geçmemeli. */
const FORBIDDEN = [
  /numune/i,
  /\bsampl(e|es|ing)\b/i,
  /kalite ve güvenin adresi/i,
  /hayallerinizi gerçeğe/i,
  /tekstilde yenilikçi çözümler/i,
  /geleceği örüyoruz/i,
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

describe("metin kuralları", () => {
  it("kaynak kodda yasak ifade yok", () => {
    const offenders = walk(path.resolve(__dirname, "../../src")).flatMap((file) => {
      const text = readFileSync(file, "utf8");
      return FORBIDDEN.filter((re) => re.test(text)).map(
        (re) => `${path.relative(process.cwd(), file)}: ${re}`,
      );
    });
    expect(offenders).toEqual([]);
  });

  it("TR ve EN arayüz sözlükleri aynı anahtarlara sahip", () => {
    const keys = (obj: object, prefix = ""): string[] =>
      Object.entries(obj).flatMap(([k, v]) =>
        typeof v === "object" && v !== null
          ? keys(v as object, `${prefix}${k}.`)
          : [`${prefix}${k}`],
      );
    expect(keys(en).sort()).toEqual(keys(tr).sort());
  });
});

/**
 * SVG içinden script / harici referans / event handler temizler.
 * Sanitized SVG asla satır içi çalıştırılmaz; yalnızca depolanır.
 */
export function sanitizeSvg(input: string): string {
  let out = input;
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  out = out.replace(/\shref\s*=\s*("|')\s*javascript:[^"']*\1/gi, "");
  out = out.replace(/\sxlink:href\s*=\s*("|')\s*javascript:[^"']*\1/gi, "");
  out = out.replace(
    /<(?:use|image|feImage)\b[^>]*\b(?:href|xlink:href)\s*=\s*("|')https?:[^"']*\1[^>]*>/gi,
    "",
  );
  return out;
}

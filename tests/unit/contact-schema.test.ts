import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import tr from "@/i18n/messages/tr";
import { contactFormSchema, parseErrorCode } from "@/lib/validation/contact";

const valid = {
  fullName: "Ayşe Yılmaz",
  company: "",
  email: "ayse@firma.com",
  phone: "+90 555 000 00 00",
  country: "TR",
  productInterest: "",
  quantityRange: "",
  message: "500 adet jakarlı kulüp atkısı için tasarım önerisi istiyoruz.",
  privacyConsent: true as const,
};

const issuesOf = (input: Record<string, unknown>) => {
  const result = contactFormSchema.safeParse(input);
  const issues: Record<string, string> = {};
  if (!result.success) {
    for (const issue of result.error.issues) issues[String(issue.path[0])] ??= issue.message;
  }
  return issues;
};

describe("iletişim formu şeması", () => {
  it("geçerli girişi kabul eder ve boş opsiyonel alanları temizler", () => {
    const result = contactFormSchema.parse(valid);
    expect(result.company).toBeUndefined();
    expect(result.country).toBe("TR");
  });

  it("zorunlu alanları ve onayı doğrular", () => {
    const issues = issuesOf({ ...valid, fullName: "", message: "", privacyConsent: false });
    expect(issues.fullName).toBe("required");
    expect(issues.message).toBe("required");
    expect(issues.privacyConsent).toBe("consentRequired");
  });

  it("e-posta ve telefon biçimini doğrular", () => {
    const issues = issuesOf({ ...valid, email: "ayse@", phone: "abc" });
    expect(issues.email).toBe("invalidEmail");
    expect(issues.phone).toBe("invalidPhone");
    expect(issuesOf({ ...valid, phone: "" })).toEqual({});
  });

  it("uzunluk sınırlarını parametreli kodla bildirir", () => {
    expect(issuesOf({ ...valid, message: "kısa" }).message).toBe("tooShort:10");
    expect(parseErrorCode("tooShort:10")).toEqual({ code: "tooShort", params: { min: "10" } });
    expect(parseErrorCode("tooLong:120")).toEqual({ code: "tooLong", params: { max: "120" } });
  });

  it("her hata kodunun TR ve EN çevirisi vardır", () => {
    for (const code of [
      "required",
      "tooShort",
      "tooLong",
      "invalidEmail",
      "invalidPhone",
      "consentRequired",
    ] as const) {
      expect(tr.form.errors[code].length).toBeGreaterThan(0);
      expect(en.form.errors[code].length).toBeGreaterThan(0);
    }
  });
});

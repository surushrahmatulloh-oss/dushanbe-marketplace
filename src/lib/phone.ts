/** Normalize Tajik phone numbers for storage and lookup */

export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";

  // 992XXXXXXXXX (12 digits)
  if (digits.startsWith("992") && digits.length === 12) {
    return `+${digits}`;
  }
  // 0XXXXXXXXX → +992XXXXXXXXX
  if (digits.startsWith("0") && digits.length === 10) {
    return `+992${digits.slice(1)}`;
  }
  // 9XXXXXXXXX (9 digits, local mobile)
  if (digits.length === 9 && digits.startsWith("9")) {
    return `+992${digits}`;
  }
  // Already 992... with extra
  if (digits.length >= 9) {
    const last9 = digits.slice(-9);
    if (last9.startsWith("9")) return `+992${last9}`;
  }

  return digits.startsWith("+") ? digits : `+${digits}`;
}

export function isPhoneLike(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.includes("@")) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 9;
}

export function isEmailLike(value: string): boolean {
  return value.trim().includes("@");
}

/** Placeholder email when user registers with phone only */
export function emailFromPhone(phone: string): string {
  const normalized = normalizePhone(phone).replace(/\+/g, "");
  return `${normalized}@phone.bozor.tj`;
}

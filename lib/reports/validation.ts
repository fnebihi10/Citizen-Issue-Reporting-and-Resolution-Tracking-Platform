export const REPORT_LIMITS = {
  titleMin: 5,
  titleMax: 160,
  descriptionMin: 10,
  descriptionMax: 5000,
  addressMax: 240,
  imageMaxBytes: 10 * 1024 * 1024,
} as const;

export const ACCEPTED_REPORT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type ReportDraftInput = {
  title: string;
  description: string;
  categoryId: string;
  addressText: string;
  latitude: number | null;
  longitude: number | null;
};

export function validateCitizenReport(input: ReportDraftInput): string | null {
  const title = input.title.trim();
  const description = input.description.trim();
  const address = input.addressText.trim();

  if (title.length < REPORT_LIMITS.titleMin || title.length > REPORT_LIMITS.titleMax) {
    return `Titulli duhet të ketë ${REPORT_LIMITS.titleMin}–${REPORT_LIMITS.titleMax} karaktere.`;
  }
  if (description.length < REPORT_LIMITS.descriptionMin || description.length > REPORT_LIMITS.descriptionMax) {
    return `Përshkrimi duhet të ketë ${REPORT_LIMITS.descriptionMin}–${REPORT_LIMITS.descriptionMax} karaktere.`;
  }
  if (!input.categoryId.trim()) return 'Zgjidh një kategori për raportimin.';
  if (address.length > REPORT_LIMITS.addressMax) return `Përshkrimi i vendit nuk mund të kalojë ${REPORT_LIMITS.addressMax} karaktere.`;
  if (input.latitude === null || input.longitude === null || !Number.isFinite(input.latitude) || !Number.isFinite(input.longitude)) {
    return 'Zgjidh lokacionin e problemit në hartë.';
  }
  if (input.latitude < -90 || input.latitude > 90 || input.longitude < -180 || input.longitude > 180) {
    return 'Lokacioni i zgjedhur nuk është i vlefshëm.';
  }

  return null;
}

export function validateReportImage(file: { type: string; size: number } | null): string | null {
  if (!file) return null;
  if (!(ACCEPTED_REPORT_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return 'Fotografia duhet të jetë në formatin JPG, PNG ose WebP.';
  }
  if (file.size < 1 || file.size > REPORT_LIMITS.imageMaxBytes) {
    return 'Fotografia duhet të jetë më e vogël se 10 MB dhe të mos jetë bosh.';
  }
  return null;
}

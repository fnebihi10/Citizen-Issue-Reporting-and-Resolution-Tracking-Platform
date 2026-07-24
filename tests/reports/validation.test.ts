import { describe, expect, it } from 'vitest';
import {
  REPORT_LIMITS,
  validateCitizenReport,
  validateReportImage,
} from '@/lib/reports/validation';

const validDraft = {
  title: 'Ndriçim publik i dëmtuar',
  description: 'Përshkrim sintetik i mjaftueshëm për verifikim.',
  categoryId: 'b2222222-2222-2222-2222-222222222222',
  addressText: '',
  latitude: 42,
  longitude: 20,
};

describe('citizen report validation', () => {
  it('accepts a complete report draft', () => {
    expect(validateCitizenReport(validDraft)).toBeNull();
  });

  it('rejects a report without coordinates', () => {
    expect(validateCitizenReport({
      ...validDraft,
      latitude: null,
      longitude: null,
    })).toContain('lokacionin');
  });

  it('rejects out-of-range coordinates', () => {
    expect(validateCitizenReport({
      ...validDraft,
      latitude: 91,
    })).toContain('vlefshëm');
    expect(validateCitizenReport({
      ...validDraft,
      longitude: -181,
    })).toContain('vlefshëm');
  });

  it('enforces text boundaries after trimming', () => {
    expect(validateCitizenReport({
      ...validDraft,
      title: '  abc  ',
    })).toContain('5–160');
    expect(validateCitizenReport({
      ...validDraft,
      description: 'short',
    })).toContain('10–5000');
    expect(validateCitizenReport({
      ...validDraft,
      addressText: 'x'.repeat(REPORT_LIMITS.addressMax + 1),
    })).toContain(`${REPORT_LIMITS.addressMax}`);
  });

  it('rejects unsupported and oversized evidence files', () => {
    expect(validateReportImage({
      type: 'application/pdf',
      size: 1024,
    })).toContain('JPG');
    expect(validateReportImage({
      type: 'image/jpeg',
      size: REPORT_LIMITS.imageMaxBytes + 1,
    })).toContain('10 MB');
  });

  it('accepts a non-empty image exactly at the size limit', () => {
    expect(validateReportImage({
      type: 'image/webp',
      size: REPORT_LIMITS.imageMaxBytes,
    })).toBeNull();
  });
});

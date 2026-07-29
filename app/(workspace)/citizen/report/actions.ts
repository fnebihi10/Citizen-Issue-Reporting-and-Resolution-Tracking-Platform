'use server';

import { requireWorkspaceRequestContext } from '@/lib/auth/serverContext';
import { createClient } from '@/lib/supabase/server';
import { validateCitizenReport, type ReportDraftInput } from '@/lib/reports/validation';

type CreateCitizenReportResult =
  | { ok: true; report: { id: string; reportNumber: number } }
  | { ok: false; error: string };

function friendlyCreateReportError(error: { message?: string } | null) {
  if (error?.message === 'REPORT_RATE_LIMIT_EXCEEDED') {
    return 'Ke arritur kufirin prej 5 raportimeve brenda 5 minutave. Provo përsëri pas pak.';
  }

  return 'Raportimi nuk mund të ruhej tani. Provo përsëri pas pak.';
}

export async function createCitizenReport(input: ReportDraftInput): Promise<CreateCitizenReportResult> {
  const validationError = validateCitizenReport(input);
  if (validationError) return { ok: false, error: validationError };

  const context = await requireWorkspaceRequestContext('/citizen/report');
  const supabase = await createClient();

  if (context.role !== 'citizen') {
    return { ok: false, error: 'Vetëm llogaritë me rolin qytetar mund të dorëzojnë raportime.' };
  }

  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('id', input.categoryId)
    .eq('is_active', true)
    .maybeSingle();

  if (!category) return { ok: false, error: 'Kategoria e zgjedhur nuk është më aktive.' };

  const { data: report, error } = await supabase
    .from('reports')
    .insert({
      title: input.title.trim(),
      description: input.description.trim(),
      category_id: input.categoryId,
      citizen_id: context.userId,
      status: 'submitted',
      priority: 'normal',
      department_id: null,
      assigned_official_id: null,
      is_public: false,
      location: `SRID=4326;POINT(${input.longitude} ${input.latitude})`,
      address_text: input.addressText.trim() || null,
    })
    .select('id, report_number')
    .single();

  if (error || !report) {
    console.error('Citizen report creation failed', error);
    return { ok: false, error: friendlyCreateReportError(error) };
  }

  return { ok: true, report: { id: report.id, reportNumber: report.report_number } };
}

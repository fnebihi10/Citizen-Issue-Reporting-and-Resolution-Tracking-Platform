import { ArrowRight, CheckCircle2, Play, SearchCheck, XCircle } from 'lucide-react';
import { transitionOfficialReport } from '@/app/(workspace)/workflow/actions';
import { SubmitButton } from '@/components/ui/SubmitButton';
import type {
  Department,
  Profile,
  ReportPriority,
  ReportStatus,
  UserRole,
} from '@/types/database';

type StaffOption = Pick<Profile, 'id' | 'full_name' | 'role' | 'department_id'>;
type DepartmentOption = Pick<Department, 'id' | 'name'>;

const priorityLabels: Record<ReportPriority, string> = {
  low: 'I ulët',
  normal: 'Normal',
  high: 'I lartë',
  urgent: 'Urgjent',
};

function TransitionFields({
  reportId,
  currentStatus,
  targetStatus,
}: {
  reportId: string;
  currentStatus: ReportStatus;
  targetStatus: ReportStatus;
}) {
  return (
    <>
      <input type="hidden" name="reportId" value={reportId} />
      <input type="hidden" name="currentStatus" value={currentStatus} />
      <input type="hidden" name="targetStatus" value={targetStatus} />
    </>
  );
}

export function OfficialWorkflowPanel({
  report,
  actor,
  departments,
  staff,
}: {
  report: {
    id: string;
    status: ReportStatus;
    priority: ReportPriority;
    public_title: string | null;
    public_summary: string | null;
  };
  actor: { id: string; role: UserRole; departmentId: string | null };
  departments: DepartmentOption[];
  staff: StaffOption[];
}) {
  if (report.status === 'submitted' || report.status === 'reopened') {
    return (
      <form action={transitionOfficialReport}>
        <TransitionFields
          reportId={report.id}
          currentStatus={report.status}
          targetStatus="under_review"
        />
        <label htmlFor="review-note" className="text-sm font-bold text-slate-900">
          Shënim fillestar opsional
        </label>
        <textarea
          id="review-note"
          name="note"
          maxLength={2000}
          rows={3}
          className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Çfarë do të verifikohet?"
        />
        <div className="mt-4">
          <SubmitButton pendingLabel="Duke hapur verifikimin...">
            <SearchCheck className="h-4 w-4" aria-hidden="true" />
            Fillo verifikimin
          </SubmitButton>
        </div>
      </form>
    );
  }

  if (report.status === 'under_review') {
    const officialDepartment =
      actor.role === 'official'
        ? departments.find((department) => department.id === actor.departmentId)
        : null;
    const assignmentStaff =
      actor.role === 'official'
        ? staff.filter((member) => member.id === actor.id)
        : staff;

    return (
      <div className="space-y-6">
        <form action={transitionOfficialReport} className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">
          <TransitionFields
            reportId={report.id}
            currentStatus={report.status}
            targetStatus="assigned"
          />
          <h3 className="text-base font-black text-slate-950">Cakto përgjegjësinë</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-slate-800">
              Departamenti
              {actor.role === 'official' ? (
                <>
                  <input
                    type="hidden"
                    name="departmentId"
                    value={actor.departmentId ?? ''}
                  />
                  <span className="mt-2 flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-3.5 font-semibold">
                    {officialDepartment?.name ?? 'Departamenti mungon'}
                  </span>
                </>
              ) : (
                <select
                  name="departmentId"
                  required
                  className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Zgjidh departamentin</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              )}
            </label>

            <label className="text-sm font-bold text-slate-800">
              Zyrtari përgjegjës
              {actor.role === 'official' ? (
                <>
                  <input type="hidden" name="assignedOfficialId" value={actor.id} />
                  <span className="mt-2 flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-3.5 font-semibold">
                    Ti
                  </span>
                </>
              ) : (
                <select
                  name="assignedOfficialId"
                  required
                  className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Zgjidh zyrtarin</option>
                  {assignmentStaff.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.full_name}
                    </option>
                  ))}
                </select>
              )}
            </label>

            <label className="text-sm font-bold text-slate-800">
              Prioriteti
              <select
                name="priority"
                defaultValue={report.priority}
                required
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {(Object.keys(priorityLabels) as ReportPriority[]).map((priority) => (
                  <option key={priority} value={priority}>
                    {priorityLabels[priority]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
            <label className="flex min-h-11 items-center gap-2 text-sm font-bold text-slate-800">
              <input
                type="checkbox"
                name="isPublic"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Publikoje në hartë me lokacion të përgjithësuar
            </label>
            <div className="mt-3 grid gap-3">
              <label className="text-sm font-bold text-slate-800">
                Titulli publik
                <input
                  name="publicTitle"
                  minLength={5}
                  maxLength={160}
                  defaultValue={report.public_title ?? ''}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <label className="text-sm font-bold text-slate-800">
                Përmbledhja publike
                <textarea
                  name="publicSummary"
                  minLength={10}
                  maxLength={1000}
                  defaultValue={report.public_summary ?? ''}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>
          </div>

          <label className="mt-4 block text-sm font-bold text-slate-800">
            Shënim i caktimit
            <textarea
              name="note"
              maxLength={2000}
              rows={3}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <div className="mt-4">
            <SubmitButton pendingLabel="Duke caktuar...">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              Cakto raportimin
            </SubmitButton>
          </div>
        </form>

        <form action={transitionOfficialReport} className="rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
          <TransitionFields
            reportId={report.id}
            currentStatus={report.status}
            targetStatus="rejected"
          />
          {actor.role === 'admin' ? (
            <label className="block text-sm font-bold text-rose-950">
              Departamenti përgjegjës
              <select
                name="departmentId"
                required
                className="mt-2 h-11 w-full rounded-xl border border-rose-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-4 focus:ring-rose-100"
              >
                <option value="">Zgjidh departamentin</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="mt-3 block text-sm font-bold text-rose-950">
            Arsyeja e refuzimit
            <textarea
              name="note"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              className="mt-2 w-full rounded-xl border border-rose-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none focus:ring-4 focus:ring-rose-100"
            />
          </label>
          <div className="mt-4">
            <SubmitButton variant="danger" pendingLabel="Duke refuzuar...">
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Refuzo raportimin
            </SubmitButton>
          </div>
        </form>
      </div>
    );
  }

  if (report.status === 'assigned') {
    return (
      <form action={transitionOfficialReport}>
        <TransitionFields
          reportId={report.id}
          currentStatus={report.status}
          targetStatus="in_progress"
        />
        <label className="block text-sm font-bold text-slate-800">
          Shënim opsional
          <textarea
            name="note"
            maxLength={2000}
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>
        <div className="mt-4">
          <SubmitButton pendingLabel="Duke filluar...">
            <Play className="h-4 w-4" aria-hidden="true" />
            Fillo punën
          </SubmitButton>
        </div>
      </form>
    );
  }

  if (report.status === 'in_progress') {
    return (
      <form action={transitionOfficialReport}>
        <TransitionFields
          reportId={report.id}
          currentStatus={report.status}
          targetStatus="resolved"
        />
        <label className="block text-sm font-bold text-slate-800">
          Përshkrimi i zgjidhjes
          <textarea
            name="note"
            required
            minLength={10}
            maxLength={2000}
            rows={5}
            className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Dokumento ndërhyrjen dhe rezultatin..."
          />
        </label>
        <div className="mt-4">
          <SubmitButton pendingLabel="Duke zgjidhur...">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Shëno si të zgjidhur
          </SubmitButton>
        </div>
      </form>
    );
  }

  return (
    <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
      Ky raportim nuk ka veprim tjetër të disponueshëm për stafin në statusin aktual.
    </p>
  );
}

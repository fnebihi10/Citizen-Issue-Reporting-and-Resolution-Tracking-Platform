import { LoadingState } from '@/components/ui/FeedbackState';

export default function OfficialReportDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <LoadingState label="Duke ngarkuar raportimin..." />
    </div>
  );
}

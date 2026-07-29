import { LoadingState } from '@/components/ui/FeedbackState';

export default function NotificationsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <LoadingState label="Duke ngarkuar njoftimet..." />
    </div>
  );
}

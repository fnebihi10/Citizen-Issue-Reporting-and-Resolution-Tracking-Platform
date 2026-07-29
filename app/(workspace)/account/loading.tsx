import { LoadingState } from '@/components/ui/FeedbackState';

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <LoadingState label="Duke ngarkuar profilin dhe sigurinë..." />
    </div>
  );
}

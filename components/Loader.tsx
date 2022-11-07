import { Spinner } from './Icons/Spinner';

export const Loader = ({ message }: { message?: string }) => (
  <div className="flex animate-pulse gap-2 rounded border border-faded p-4 text-gray-500 shadow-sm">
    <Spinner />
    <p>{message}</p>
  </div>
);

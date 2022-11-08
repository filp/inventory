import { useToaster } from 'react-hot-toast';

export const Toaster = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <div
      onMouseEnter={startPause}
      onMouseLeave={endPause}
      className="flex flex-col items-center gap-2 py-2"
    >
      {toasts
        .filter((toast) => toast.visible)
        .map((toast) => (
          <div
            key={toast.id}
            {...toast.ariaProps}
            className="rounded-lg bg-black px-4 py-2 text-center text-white shadow-lg"
          >
            {toast.message?.toString()}
          </div>
        ))}
    </div>
  );
};

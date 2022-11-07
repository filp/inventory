import { trpc } from '@lib/trpc';

export const useCreateArea = () => trpc.createArea.useMutation();

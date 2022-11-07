import { trpc } from '@lib/trpc';

export const useCreateCollection = () => trpc.createCollection.useMutation();

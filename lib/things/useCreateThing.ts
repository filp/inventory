import { trpc } from '@lib/trpc';

export const useCreateThing = () => trpc.createThing.useMutation();

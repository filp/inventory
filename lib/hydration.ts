import {
  QueryClient,
  dehydrate as queryClientDehydrate,
} from '@tanstack/react-query';
import superjson from 'superjson';

// Takes a function that is given a QueryClient.
// Standard pre-fetching/pre-caching methods can be called on this client
// (e.g queryClient.prefetchQuery) to add state to it.
//
// At the end of the function execution, the client is dehydrated and ready to
// be returned from `getServerSideProps` for re-hydration.
export const dehydrate = async (
  fn: (client: QueryClient) => void | Promise<void>,
  options: {
    client?: QueryClient;
  } = {}
) => {
  const client = options?.client || new QueryClient();
  await fn(client);

  return {
    props: {
      dehydratedState: superjson.stringify(queryClientDehydrate(client)),
    },
  };
};

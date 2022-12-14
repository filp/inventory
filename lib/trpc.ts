import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '@server/router';

export const getBaseUrl = ({ useAbsolute }: { useAbsolute?: boolean } = {}) => {
  if (typeof window !== 'undefined' && !useAbsolute)
    // browser should use relative path
    return '';

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCNext<AppRouter>({
  config: () => ({
    links: [
      httpBatchLink({
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         **/
        url: `${getBaseUrl()}/api/trpc`,
      }),
    ],
    /**
     * @link https://tanstack.com/query/v4/docs/reference/QueryClient
     **/
    // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
  }),

  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: true,
});

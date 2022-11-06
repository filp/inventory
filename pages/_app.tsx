import '../styles/globals.css';
import superjson from 'superjson';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';

import {
  QueryClientProvider,
  QueryClient,
  Hydrate,
} from '@tanstack/react-query';
import { useState } from 'react';

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient());

  const dehydratedState = pageProps.dehydratedState;
  const hydrationState = dehydratedState && superjson.parse(dehydratedState);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={hydrationState}>
        <>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} position="bottom-left" />
        </>
      </Hydrate>
    </QueryClientProvider>
  );
};

export default App;

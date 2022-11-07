import '../styles/globals.css';
import Head from 'next/head';
import type { AppType } from 'next/app';
import { trpc } from '@lib/trpc';
import { CollectionPicker } from '@components/Collections/CollectionPicker';

const InventoryApp: AppType = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Inventory</title>
    </Head>
    <div className="container w-screen">
      <header className="flex flex-row items-center gap-4 border-b border-faded p-4">
        <div className="font-heading text-lg text-black">inventory</div>
        <CollectionPicker />
      </header>

      <div className="w-screen">
        <Component {...pageProps} />
      </div>
    </div>
  </>
);

export default trpc.withTRPC(InventoryApp);

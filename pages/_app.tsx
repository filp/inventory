import '../styles/globals.css';
import Head from 'next/head';
import type { AppType } from 'next/app';
import { trpc } from '@lib/trpc';
import { CollectionPicker } from '@components/Collections/CollectionPicker';
import { Toaster } from '@components/Toaster';

const InventoryApp: AppType = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Inventory</title>
    </Head>
    <div className="w-screen">
      <header className="flex h-[70px] w-screen flex-row items-center gap-4 border-b border-faded px-4 md:px-6">
        <div className="font-heading text-lg text-black">inventory</div>
        <CollectionPicker />
      </header>

      <div className="">
        <Component {...pageProps} />
      </div>

      <div className="fixed bottom-0 z-50 w-screen">
        <Toaster />
      </div>
    </div>
  </>
);

export default trpc.withTRPC(InventoryApp);

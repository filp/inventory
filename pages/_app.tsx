import '../styles/globals.css';
import { useMemo, useState } from 'react';
import Head from 'next/head';
import type { AppType } from 'next/app';
import { trpc } from '@lib/trpc';
import { CurrentCollectionSelector } from '@components/Collections/CollectionSelector';
import { Toaster } from '@components/Toaster';
import { Button } from '@components/Button';
import { CreateThingsModal } from '@components/Things/CreateThingsModal';
import { CommandPanel, type Command } from '@components/CommandPanel';
import { ArrowLongRight } from '@components/Icons/ArrowLongRight';

const InventoryApp: AppType = ({ Component, pageProps }) => {
  const [createThingsModalIsOpen, setCreateThingsModalIsOpen] = useState(false);
  const commands = useMemo<Command[]>(
    () => [
      {
        title: 'Add things',
        icon: <ArrowLongRight />,
        execute: (command, query) => {
          console.log('exec', command, query);
          setCreateThingsModalIsOpen(true);
        },
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Inventory</title>
      </Head>
      <div className="w-screen">
        <header className="page-content flex h-[var(--header-height)] w-screen flex-row items-center justify-between gap-4 border-b border-faded">
          <div className="font-heading text-lg text-black">inventory</div>
          <CurrentCollectionSelector />

          <div className="flex flex-row items-center gap-2">
            <Button onPress={() => setCreateThingsModalIsOpen(true)}>
              Add things
            </Button>
            <CommandPanel commands={commands} />
          </div>
        </header>

        <div className="">
          <Component {...pageProps} />
        </div>

        <div className="fixed bottom-0 z-50 w-screen">
          <Toaster />
        </div>

        <CreateThingsModal
          isOpen={createThingsModalIsOpen}
          onClose={() => setCreateThingsModalIsOpen(false)}
        />
      </div>
    </>
  );
};

export default trpc.withTRPC(InventoryApp);

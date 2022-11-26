import React from 'react';
import { Dialog } from '@headlessui/react';
import { IconButton } from '@components/Button';
import { CloseIcon } from '@components/Icons/CloseIcon';

export const Modal = ({
  title,
  isOpen,
  onClose,
  children,
}: React.PropsWithChildren<{
  title: string;
  isOpen: boolean;
  onClose: () => void;
}>) => (
  <Dialog open={isOpen} onClose={onClose}>
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 md:p-12 ">
      <Dialog.Panel className="h-full w-full overflow-y-scroll border-faded bg-white shadow-sm md:rounded md:border">
        <Dialog.Title className="page-content flex h-[var(--header-height)] flex-row items-center justify-between border-b border-faded font-heading text-xl">
          {title}
          <IconButton icon={<CloseIcon />} onPress={onClose} />
        </Dialog.Title>
        <div className="page-content py-4">{children}</div>
      </Dialog.Panel>
    </div>
  </Dialog>
);

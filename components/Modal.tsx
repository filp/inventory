import React from 'react';
import cn from 'classnames';
import { Dialog } from '@headlessui/react';
import { IconButton } from '@components/Button';
import { CloseIcon } from '@components/Icons/CloseIcon';

export const Modal = ({
  title,
  isOpen,
  onClose,
  children,
  bare,
  centerHorizontally,
  centerVertically,
}: React.PropsWithChildren<{
  title: string;
  isOpen: boolean;
  onClose: () => void;
  bare?: boolean;
  centerVertically?: boolean;
  centerHorizontally?: boolean;
}>) => (
  <Dialog open={isOpen} onClose={onClose}>
    <div
      className={cn('fixed inset-0 flex bg-black bg-opacity-50 md:p-12', {
        'items-center':
          centerVertically || typeof centerVertically === 'undefined',
        'justify-center':
          centerHorizontally || typeof centerHorizontally === 'undefined',
      })}
    >
      <Dialog.Panel
        className={
          bare
            ? undefined
            : 'h-full w-full overflow-y-scroll border-faded bg-white shadow-sm md:rounded md:border'
        }
      >
        {bare ? (
          children
        ) : (
          <>
            <Dialog.Title className="page-content flex h-[var(--header-height)] flex-row items-center justify-between border-b border-faded font-heading text-xl">
              {title}
              <IconButton icon={<CloseIcon />} onPress={onClose} />
            </Dialog.Title>
            <div className="page-content py-4">{children}</div>
          </>
        )}
      </Dialog.Panel>
    </div>
  </Dialog>
);

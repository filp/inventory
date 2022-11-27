import React, { useEffect, useState } from 'react';
import { IconButton } from './Button';
import { CogIcon } from './Icons/CogIcon';
import { Modal } from './Modal';

export type Command = {
  icon: JSX.Element;
  title: string;
  hints?: string[];
  execute: (command: Command, query: string) => void;
};

export const CommandPanel = ({ commands }: { commands: Command[] }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener('keydown', onGlobalKeyDown);

    return () => document.removeEventListener('keydown', onGlobalKeyDown);
  });

  return (
    <>
      <IconButton icon={<CogIcon />} onPress={() => setIsOpen(true)} />
      <Modal
        title="Command Panel"
        bare
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        centerVertically={false}
      >
        <div className="min-w-[440px] rounded-lg bg-white shadow-lg">
          <input
            type="text"
            placeholder="Start typing to search commands"
            className="w-full rounded-lg py-2 px-4 text-xl outline-none"
          />
          <ul className="border-t border-faded py-2 px-4">
            {commands.map((command, i) => (
              <li
                key={i}
                className="flex flex-row items-center gap-2 border-b-faded"
                onClick={() => {
                  setIsOpen(false);
                  command.execute(command, '');
                }}
              >
                <span className="text-gray-400">{command.icon}</span>{' '}
                {command.title}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </>
  );
};

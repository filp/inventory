import React from 'react';
import copytoClipboard from 'copy-to-clipboard';

export const ThingUID = ({ children }: { children: React.ReactNode }) => {
  const onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    copytoClipboard(children as string);
  };

  return (
    <span
      className="cursor-copy rounded-lg border border-faded bg-white px-2 py-1 text-xs text-gray-800"
      onClick={onClick}
    >
      {children}
    </span>
  );
};

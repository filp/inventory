import React from 'react';
import cn from 'classnames';
import { EyeSlash } from './Icons/EyeSlash';

type DefinitionListProps = {
  header?: string;
  description?: string;
};

export const DefinitionList = ({
  header,
  description,
  children,
}: React.PropsWithChildren<DefinitionListProps>) => (
  <div className="overflow-hidden bg-white">
    {header && (
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {header}
        </h3>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
        )}
      </div>
    )}
    <dl>{children}</dl>
  </div>
);

export const DefinitionRow = ({
  label,
  children,
}: React.PropsWithChildren<{ label: string; idx?: number }>) => (
  <div
    className={cn(
      'px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6',
      'odd:bg-transparent even:bg-gray-50'
    )}
  >
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      {children}
    </dd>
  </div>
);

const validTypes = ['string', 'number'];
export const QuickDefinitionList = ({
  items,
  pruneFalsy,
  ...definitionListProps
}: {
  items: Record<string, unknown>;
  pruneFalsy?: boolean;
} & DefinitionListProps) => (
  <DefinitionList {...definitionListProps}>
    {Object.entries(items)
      .filter((p) => !pruneFalsy || !!p[1])
      .map((pair) => {
        const [key, value] = pair;

        return (
          <DefinitionRow key={key} label={key}>
            {validTypes.includes(typeof value) ? (
              (value as string)
            ) : (
              <span title="Cannot display value" className="text-faded">
                <EyeSlash />
              </span>
            )}
          </DefinitionRow>
        );
      })}
  </DefinitionList>
);

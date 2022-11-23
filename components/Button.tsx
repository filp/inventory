import React from 'react';
import cn from 'classnames';

const baseButtonKlass =
  'flex flex-row items-center gap-1 rounded-xl bg-black px-4 py-2 text-sm text-white transition-all hover:bg-indigo-700 active:bg-indigo-900 active:text-indigo-200 cursor-pointer';

const buttonDisabledKlass =
  'bg-white text-gray-500 outline outline-gray-300 outline-dashed cursor-default pointer-events-none';

type ButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
};

export const SubmitButton = ({
  label,
  disabled,
}: Pick<ButtonProps, 'disabled'> & { label?: string }) => {
  const klass = cn(baseButtonKlass, disabled && buttonDisabledKlass);

  return <input type="submit" value={label || 'Submit'} className={klass} />;
};

export const IconButton = ({
  icon,
  onPress,
}: Pick<ButtonProps, 'onPress' | 'disabled'> & { icon: JSX.Element }) => {
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    onPress && onPress();
  };

  return (
    <button
      onClick={onClick}
      className="focus-ring rounded border border-transparent p-1 hover:border-faded hover:shadow-sm"
    >
      {icon}
    </button>
  );
};

export const Button = ({
  disabled,
  onPress,
  children,
  iconLeft,
  iconRight,
}: React.PropsWithChildren<ButtonProps>) => {
  const onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    onPress && onPress();
  };

  const klass = cn(baseButtonKlass, disabled && buttonDisabledKlass);

  return (
    <button className={klass} onClick={onClick} disabled={disabled}>
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
};

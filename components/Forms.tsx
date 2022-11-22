import React from 'react';
import cn from 'classnames';

const baseInputClass =
  'rounded border border-faded w-full focus:shadow-inner focus:text-black text-gray-700';

type FormInputProps = {
  label?: string;
  name?: string;
  required?: boolean;
};

export const FormInput = ({
  children,
  label,
  name,
  required,
}: React.PropsWithChildren<FormInputProps>) => (
  <div className="flex flex-row items-center gap-2 even:bg-gray-50">
    <div className="min-w-[120px] self-start py-4 px-2">
      <label htmlFor={name} className="text-sm">
        {label || 'Field'}
        {required && <span className="ml-1 text-gray-500">*</span>}
      </label>{' '}
    </div>
    <div className="flex-1 p-2 md:max-w-prose">{children}</div>
  </div>
);

export const TextInput = React.forwardRef<
  HTMLInputElement,
  FormInputProps & React.HTMLProps<HTMLInputElement>
>((props, ref) => {
  const { label, name, required, ...inputProps } = props;

  return (
    <FormInput label={label || name} name={name} required={required}>
      <input
        {...inputProps}
        ref={ref}
        name={name}
        className={cn(baseInputClass, 'p-2')}
        type="text"
      />
    </FormInput>
  );
});

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  FormInputProps & React.HTMLProps<HTMLTextAreaElement>
>((props, ref) => {
  const { label, name, required, ...textAreaProps } = props;

  return (
    <FormInput label={label} name={name} required={required}>
      <textarea
        {...textAreaProps}
        name={name}
        className={cn(baseInputClass, 'px-2 py-4')}
        ref={ref}
      ></textarea>
    </FormInput>
  );
});

import { Dialog, Tab } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import { CollectionSelector } from '@components/Collections/CollectionSelector';
import { useCollections } from '@lib/collections/useCollections';
import { IconButton, SubmitButton } from '@components/Button';
import { CloseIcon } from '@components/Icons/CloseIcon';
import { FileUploader } from '@components/FileUploader';

const CreateSingleThingForm = () => {
  const { collections } = useCollections();
  const { handleSubmit, control, setValue } = useForm({});

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="collection"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <CollectionSelector
            name={field.name}
            collections={collections || []}
            onPickCollection={(collection) => {
              setValue(field.name, collection);
            }}
          />
        )}
      />

      <FileUploader
        acceptedTypes={{
          'image/jpeg': ['.jpg', '.jpeg'],
        }}
        maxFiles={1}
        extractImageText
      />

      <SubmitButton label="Submit" />
    </form>
  );
};

export const CreateThingsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => (
  <Dialog open={isOpen} onClose={onClose}>
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 md:p-12 ">
      <Dialog.Panel className="h-full w-full overflow-y-scroll border-faded bg-white shadow-sm md:rounded md:border">
        <Dialog.Title className="page-content flex h-[var(--header-height)] flex-row items-center justify-between border-b border-faded font-heading text-xl">
          Add things to inventory
          <IconButton icon={<CloseIcon />} onPress={onClose} />
        </Dialog.Title>
        <div className="page-content py-4">
          <Tab.Group>
            <Tab.List className="flex w-fit flex-row items-center rounded border border-faded text-sm shadow-sm">
              <Tab className="border-r border-faded px-2 py-1 ui-selected:bg-indigo-100">
                Add a single thing
              </Tab>
              <Tab className="border-r border-faded px-2 py-1 ui-selected:bg-indigo-100">
                Add things from plain text
              </Tab>
              <Tab className="px-2 py-1 ui-selected:bg-indigo-100">
                Import from a file
              </Tab>
            </Tab.List>
            <Tab.Panels className="py-2">
              <Tab.Panel>
                <CreateSingleThingForm />
              </Tab.Panel>
              <Tab.Panel>Plain text input</Tab.Panel>
              <Tab.Panel>Import from file</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
);

import { Tab } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CollectionSelector } from '@components/Collections/CollectionSelector';
import { useCollectionFromPath } from '@lib/collections/useCollectionFromPath';
import { SubmitButton } from '@components/Button';
import { FileUploader, imageTypes } from '@components/FileUploader';
import { FormInput, TextArea, TextInput } from '@components/Forms';
import { useCreateThing } from '@lib/things/useCreateThing';
import { Modal } from '@components/Modal';

type CreateSingleThingFormData = {
  name: string;
  description: string;
  collectionId: number;
  fileIds: number[];
};

const CreateSingleThingForm = () => {
  const { otherCollections, currentCollection } = useCollectionFromPath();
  const { mutate: createThing } = useCreateThing();
  const { handleSubmit, control, register, setValue, reset } =
    useForm<CreateSingleThingFormData>({
      defaultValues: {
        collectionId: currentCollection?.id,
        fileIds: [],
      },
    });

  const onSubmit = (data: CreateSingleThingFormData) => {
    createThing({ ...data, spotId: 1 });
    reset();
    toast('Created new Thing!');
  };

  const collections = [
    ...(currentCollection ? [currentCollection] : []),
    ...otherCollections,
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput required label="Collection">
        <Controller
          name="collectionId"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CollectionSelector
              name={field.name}
              defaultCollection={currentCollection}
              collections={collections || []}
              onPickCollection={(collection) => {
                setValue(field.name, collection.id);
              }}
            />
          )}
        />
      </FormInput>

      <TextInput
        {...register('name', { required: true })}
        label="Name"
        placeholder="Thing Name"
        required
      />

      <TextArea {...register('description')} label="Description"></TextArea>

      <FormInput name="fileIds" label="Photos">
        <Controller
          name="fileIds"
          control={control}
          render={({ field }) => (
            <FileUploader
              acceptedTypes={imageTypes}
              onFilesReady={(uploadedFiles) => {
                const previousFieldValues = field.value || [];

                setValue(field.name, [
                  ...previousFieldValues,
                  ...uploadedFiles.map((uf) => uf.id),
                ]);
              }}
              maxFiles={32}
              inputName={field.name}
            />
          )}
        />
      </FormInput>

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
  <Modal isOpen={isOpen} onClose={onClose} title="Add things to inventory">
    <Tab.Group>
      <Tab.List className="flex w-fit flex-row items-center rounded border border-faded text-sm shadow-sm">
        <Tab className="border-r border-faded p-4 ui-selected:bg-indigo-100 md:px-2 md:py-1">
          Quick Add
        </Tab>
        <Tab
          disabled
          className="border-r border-faded p-4 text-faded ui-selected:bg-indigo-100 md:px-2 md:py-1"
        >
          Plain Text
        </Tab>
        <Tab
          disabled
          className="p-4 text-faded ui-selected:bg-indigo-100 md:px-2 md:py-1"
        >
          Import File
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
  </Modal>
);

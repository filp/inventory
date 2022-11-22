import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import cn from 'classnames';
import { getBaseUrl } from '@lib/trpc';
import type { UploadMediaResponse } from '@api/media';

const isImageFile = (mimeType: string) => mimeType.split('/')[0] === 'image';

const uploadFile = async (file: File) => {
  const formData = new FormData();

  formData.append('name', file.name);
  formData.append('mimeType', file.type);
  formData.append('data', file);

  const response = await fetch(`${getBaseUrl()}/api/media`, {
    body: formData,
    method: 'post',
  });

  return response.json() as Promise<UploadMediaResponse>;
};

const ImagePreview = ({ file }: { file: File }) => {
  const [objectUrl, setObjectUrl] = useState<string>();

  useEffect(() => {
    if (!objectUrl) {
      setObjectUrl(URL.createObjectURL(file));
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file, objectUrl]);

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={objectUrl} alt="" />;
};

const FilePreview = ({ file }: { file: File }) => {
  const fileName = file.name;
  const isImage = isImageFile(file.type);

  if (isImage) return <ImagePreview file={file} />;

  return <div>{fileName}</div>;
};

type FileUploaderProps = {
  message?: string;
  acceptedTypes?: {
    [mimeType: string]: `.${string}`[];
  };
  maxFiles?: number;
  inputName?: string;
  onFilesReady?: () => void;
};

export const FileUploader = (
  { message, acceptedTypes, maxFiles, inputName }: FileUploaderProps = {
    message: 'Drop files in the box above to upload them',
    acceptedTypes: undefined,
    maxFiles: 1,
    inputName: 'file',
  }
) => {
  const [files, setFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: acceptedTypes,
    maxFiles,
    onDrop: async (fileList) => {
      setFiles([...files, ...fileList]);

      await Promise.all(fileList.map(async (f) => uploadFile(f)));
    },
  });

  const containerClass = cn('rounded border border-dashed border-faded p-8', {
    'ring ring-indigo-500': isDragAccept,
  });

  return (
    <div className="py-4">
      <div className={containerClass} {...getRootProps()}>
        <input {...getInputProps()} name={inputName} />
        {files.map((file, i) => (
          <FilePreview file={file} key={i} />
        ))}
      </div>
      <p className="p-2 text-center text-sm text-gray-500">{message}</p>
    </div>
  );
};

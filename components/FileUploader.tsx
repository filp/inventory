import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import cn from 'classnames';
import { getBaseUrl } from '@lib/trpc';
import type { UploadMediaResponse } from '@api/media';
import { isImageFile } from '@lib/files/isImageFile';

const isProbablySameFile = (fileA: File, fileB: File) =>
  fileA.name === fileB.name &&
  fileA.type === fileB.type &&
  fileA.lastModified === fileB.lastModified;

export const imageTypes = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={objectUrl}
      alt=""
      className="max-w-[32%] rounded border border-faded text-sm"
    />
  );
};

const FilePreview = ({ file }: { file: File }) => {
  const fileName = file.name;
  const isImage = isImageFile(file.type);

  if (isImage) return <ImagePreview file={file} />;

  return <div>{fileName}</div>;
};

type UploadedFile = {
  id: number;
  url: string;
  sourceFile: File;
};

type FileUploaderProps = {
  message?: string;
  acceptedTypes?: {
    [mimeType: string]: string[];
  };
  maxFiles?: number;
  inputName?: string;
  onFilesReady?: (uploadedFiles: UploadedFile[]) => void;
  onProcessingFiles?: (files: File[]) => void;
};

export const FileUploader = (
  {
    message,
    acceptedTypes,
    maxFiles,
    inputName,
    onFilesReady,
    onProcessingFiles,
  }: FileUploaderProps = {
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
    disabled: maxFiles ? files.length >= maxFiles : false,
    preventDropOnDocument: true,
    validator: (file) => {
      const fileAlreadySelected = files.some((otherFile) =>
        isProbablySameFile(file, otherFile)
      );

      if (fileAlreadySelected) {
        return {
          code: 'duplicate_file',
          message: 'File already selected (naive check)',
        };
      }

      return null;
    },
    onDrop: async (fileList) => {
      onProcessingFiles && onProcessingFiles(fileList);

      setFiles([...files, ...fileList]);

      const uploadedFiles: UploadedFile[] = await Promise.all(
        fileList.map(async (f) => {
          const uploadedFile = await uploadFile(f);

          return {
            id: uploadedFile.id,
            url: uploadedFile.url,
            sourceFile: f,
          };
        })
      );

      onFilesReady && onFilesReady(uploadedFiles);
    },
  });

  const containerClass = cn('rounded border border-dashed border-faded p-4', {
    'ring ring-indigo-500': isDragAccept,
  });

  return (
    <div>
      <div className={containerClass} {...getRootProps()}>
        <input {...getInputProps()} name={inputName} />

        {files.length > 0 ? (
          <div className="flex flex-row flex-wrap gap-2">
            {files.map((file, i) => (
              <FilePreview file={file} key={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">
            {message || 'Drop photos or click here to upload files'}
          </p>
        )}
      </div>
    </div>
  );
};

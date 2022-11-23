import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';
import type { NextApiHandler, NextApiRequest } from 'next';
import formidable from 'formidable';
import { getBaseUrl } from '@lib/trpc';
import prisma from '@server/prisma';
import { isImageFile } from '@lib/files/isImageFile';
import type { File } from '@server/files/schema';

export type UploadMediaResponse = Omit<File, 'uri'> & { url: string };

type UploadData = {
  name: string;
  mimeType: string;
};

const parseMultipart = async (
  req: NextApiRequest
): Promise<{
  fields: UploadData;
  files: formidable.Files;
}> => {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({ fields: fields as UploadData, files });
    });
  });
};

const uploadMedia: NextApiHandler<UploadMediaResponse> = async (req, res) => {
  if (req.method !== 'POST') return res.status(404).end();

  const { fields, files } = await parseMultipart(req);
  const { name, mimeType } = fields;
  const file = files['data'] as formidable.File;

  const newPath = path.join(
    process.env.UPLOAD_PATH as string,
    file.newFilename
  );

  await fs.promises.rename(file.filepath, newPath);

  const { width, height } = isImageFile(file.mimetype || '')
    ? sizeOf(newPath)
    : {
        width: null,
        height: null,
      };

  const fileEntity = await prisma.file.create({
    data: {
      mimeType: file.mimetype || mimeType,
      name: name,
      uri: `file:///${file.newFilename}`,
      width,
      height,
    },
  });

  res.json({
    id: fileEntity.id,
    mimeType,
    name: name,
    width: width || null,
    height: height || null,
    url: `${getBaseUrl()}/api/media/${fileEntity.id}`,
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default uploadMedia;

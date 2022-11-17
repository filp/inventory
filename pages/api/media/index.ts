import fs from 'fs';
import path from 'path';
import type { NextApiHandler, NextApiRequest } from 'next';
import formidable from 'formidable';
import { getBaseUrl } from '@lib/trpc';
import prisma from '@server/prisma';

export type UploadMediaResponse = {
  id: number;
  name: string;
  mimeType: string;
  url: string;
};

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

  const fileEntity = await prisma.file.create({
    data: {
      mimeType: file.mimetype || mimeType,
      name: name,
      uri: `file:///${file.newFilename}`,
    },
  });

  res.json({
    id: fileEntity.id,
    mimeType,
    name: name,
    url: `${getBaseUrl()}/api/media/${fileEntity.id}`,
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default uploadMedia;

import fs from 'fs';
import path from 'path';
import type { NextApiHandler } from 'next';
import prisma from '@server/prisma';

const getMedia: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') return res.status(404).end();

  const fileId = parseInt(req.query.fileId as string);
  const fileEntity = await prisma.file.findFirst({
    where: {
      id: fileId,
    },
  });

  if (!fileEntity) {
    return res.status(404).end();
  }

  const filePath = path.join(
    process.env.UPLOAD_PATH as string,
    fileEntity.uri.split('///')[1]
  );

  const stat = await fs.promises.stat(filePath);
  const readStream = fs.createReadStream(filePath);

  res.writeHead(200, {
    'Content-Type': fileEntity.mimeType,
    'Content-Length': stat.size,
  });

  readStream.pipe(res);
};

export default getMedia;

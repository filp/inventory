export const isImageFile = (mimeType: string) =>
  mimeType.split('/')[0] === 'image';

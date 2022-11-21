import { useEffect, useState } from 'react';
import { createWorker, type Worker } from 'tesseract.js';

let worker: Worker;

const getTesseractWorker = async () => {
  if (!worker) {
    const newWorker = createWorker();

    await newWorker.load();
    await newWorker.loadLanguage('eng');
    await newWorker.initialize('eng');

    worker = newWorker;
  }

  return worker;
};

export const useImageTextRecognition = () => {
  const [workerInst, setWorkerInst] = useState<Worker>();

  useEffect(() => {
    const assignTesseractWorker = async () => {
      setWorkerInst(await getTesseractWorker());
    };

    void assignTesseractWorker();
  });

  return workerInst;
};

import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const CANVAS_SIZE = 444;
const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const sourceDirectory = path.join(
  projectRoot,
  'assets',
  'illustrations',
  'plants-source',
);
const outputDirectory = path.join(
  projectRoot,
  'assets',
  'illustrations',
  'plants',
);

await mkdir(outputDirectory, { recursive: true });

const entries = await readdir(sourceDirectory, {
  withFileTypes: true,
});
const pngFiles = entries
  .filter(
    (entry) =>
      entry.isFile() &&
      path.extname(entry.name).toLowerCase() === '.png',
  )
  .map((entry) => entry.name)
  .sort((first, second) =>
    first.localeCompare(second),
  );

let convertedCount = 0;
const errors = [];

for (const fileName of pngFiles) {
  const sourcePath = path.join(
    sourceDirectory,
    fileName,
  );
  const outputPath = path.join(
    outputDirectory,
    fileName,
  );

  try {
    await sharp(sourcePath)
      .resize(CANVAS_SIZE, CANVAS_SIZE, {
        fit: 'contain',
        background: {
          r: 0,
          g: 0,
          b: 0,
          alpha: 0,
        },
      })
      .png()
      .toFile(outputPath);

    convertedCount += 1;
  } catch (error) {
    errors.push({
      fileName,
      message:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
}

console.log(
  `Converted ${convertedCount}/${pngFiles.length} PNG files.`,
);

for (const error of errors) {
  console.error(`${error.fileName}: ${error.message}`);
}

if (errors.length > 0) {
  process.exitCode = 1;
}

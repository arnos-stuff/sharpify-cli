#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const sharp = require('sharp');
const ico = require('sharp-ico');
const path = require('path');
const fs = require('fs');

const argv = yargs(hideBin(process.argv))
  .epilog("This CLI tool generates multiple sizes of an image and converts it to multiple formats.")
  .option('input', {
    alias: 'i',
    type: 'string',
    description: 'Input image file',
    demandOption: true,
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Output directory',
    default: '.',
  })
  .option('sizes', {
    alias: 's',
    type: 'array',
    description: 'Output sizes',
    default: ['16x16', '32x32', '64x64', '96x96', '128x128', '192x192', '254x254'],
  })
  .option('formats', {
    alias: 'f',
    type: 'array',
    description: 'Output formats',
    default: ['jpeg', 'png', 'webp'],
  })
  .option('quality', {
    alias: 'q',
    type: 'number',
    description: 'Quality level for output images',
    default: 80,
  })
  .argv;
  const sizes = argv.sizes.map(size => size.split('x').map(Number));
  const formats = argv.formats;
  const quality = argv.quality;
  const outputDir = argv.output;
  const inputName = path.parse(argv.input).name;

  fs.mkdirSync(outputDir, { recursive: true });
  
  async function resizeImage(image, width, height) {
    if (width && !height) {
      return sharp(image).resize(width, null);
    } else if (height && !width) {
      return sharp(image).resize(null, height);
    } else {
      return sharp(image).resize(width, height);
    }
  }
  
  async function convertImage(image, format, quality) {
    return image[format]({ quality });
  }
  
  async function processImage(input, width, height, format, quality) {
    const image = await resizeImage(input, width, height);
    const output = await convertImage(image, format, quality);
    await output.toFile(path.join(outputDir, `${inputName}-${width}x${height}.${format}`));
  }
  
  sizes.forEach(([width, height]) => {
    formats.forEach(format => {
      processImage(argv.input, width, height, format, argv.quality)
        .then(() => console.log(`Created ${inputName}-${width}x${height}.${format}`))
        .catch(err => console.error(err));
    });
  });
  

ico
    .sharpsToIco(
        [
            sharp(argv.input).resize(16, 16),
            sharp(argv.input).resize(32, 32),
            sharp(argv.input).resize(64, 64),
            sharp(argv.input).resize(96, 96),
        ],
        path.join(outputDir, `${inputName}.ico`),
        { sizes: [12, 16, 24, 32, 48, 64, 96, 128, 254] },
    );

console.log(
    `Created ${inputName}.`
    );
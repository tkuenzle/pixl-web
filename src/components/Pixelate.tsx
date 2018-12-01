import * as React from 'react';

import { Zip } from 'service/zip';

import { ImageItemValues } from './ImageItem';

function toBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(result => resolve(result));
  });
}

class Pixelate extends React.PureComponent<{}> {
  public canvas = React.createRef<HTMLCanvasElement>();
  private zip = new Zip();

  public async pixelate(imageItem: ImageItemValues, increase: () => void) {
    if (!this.canvas.current) {
      throw new Error('No canvas available.');
    }
    const canvas = this.canvas.current;
    const context = this.canvas.current.getContext('2d');
    const img = imageItem.image.file;
    const { crop } = imageItem.image;

    // const width = crop  && crop.width ? Math.floor(img.width * crop.width / 100) : img.width;
    const height = crop && crop.height ? Math.floor((img.height * crop.height) / 100) : img.height;
    const offX = crop && crop.x ? Math.floor((img.width * crop.x) / 100) : 0;
    const offY = crop && crop.y ? Math.floor((img.height * crop.y) / 100) : 0;
    const numberOfPixelsX = imageItem.minNumberOfPixelsX;
    const numberOfPixelsY = imageItem.minNumberOfPixelsY;
    const numberOfImages = Math.min(
      Math.log(height / numberOfPixelsY) / Math.log(2),
      imageItem.numberOfImages,
    );
    const aspectRatio = numberOfPixelsX / numberOfPixelsY;
    const newWidth = Math.floor(aspectRatio * height);
    canvas.width = newWidth;
    canvas.height = height;
    const folder = this.zip.addFolder(imageItem.title);
    for (let i = 0; i < numberOfImages; i += 1) {
      const nh = i !== numberOfImages - 1 ? numberOfPixelsY * 2 ** i : height;
      const nw = aspectRatio * nh;
      if (context) {
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        context.drawImage(img, offX, offY, newWidth, height, 0, 0, nw, nh);
        context.drawImage(canvas, 0, 0, nw, nh, 0, 0, newWidth, height);
        const blob = await toBlob(canvas);
        if (blob) {
          await folder.addFile({ name: `${imageItem.title}-${i}.jpg`, data: blob });
        }
      }
      increase();
    }
  }

  public async download() {
    await this.zip.download();
  }

  public render() {
    return <canvas style={{ display: 'none' }} ref={this.canvas} />;
  }
}

export default Pixelate;

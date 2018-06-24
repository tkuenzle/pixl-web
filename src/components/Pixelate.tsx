import * as React from 'react';

import { Zip } from 'service/zip';

import { ImageItemValues } from './ImageItem';

function loadImage(image: HTMLImageElement): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = (error: ErrorEvent) => reject(error);
  });
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(result => resolve(result));
  });
}

class Pixelate extends React.PureComponent<{}> {
  public canvas = React.createRef<HTMLCanvasElement>();
  private zip = new Zip();

  public async pixelate(imageItem: ImageItemValues) {
    if (!this.canvas.current) {
      throw new Error('No canvas available.');
    }
    const canvas = this.canvas.current;
    const context = this.canvas.current.getContext('2d');
    const url = URL.createObjectURL(imageItem.image);
    const img = new Image();

    img.src = url;
    await loadImage(img);
    const { width, height } = img;
    const numberOfPixels = imageItem.minNumberOfPixels;
    const numberOfImages = Math.log(height / numberOfPixels) / Math.log(2);
    const aspectRatio = Math.floor(numberOfPixels * (width / height)) / numberOfPixels;
    const newWidth = Math.floor(aspectRatio * height);
    canvas.width = newWidth;
    canvas.height = height;
    const folder = this.zip.addFolder(imageItem.title);
    for (let i = 0; i < numberOfImages; i += 1) {
      const nh = i !== numberOfImages - 1 ? numberOfPixels * 2 ** i : height;
      const nw = aspectRatio * nh;
      if (context) {
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        context.drawImage(img, 0, 0, nw, nh);
        context.drawImage(canvas, 0, 0, nw, nh, 0, 0, newWidth, height);
        const blob = await toBlob(canvas);
        if (blob) {
          await folder.addFile({ name: `${imageItem.title}-${i}.jpg`, data: blob });
        }
      }
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

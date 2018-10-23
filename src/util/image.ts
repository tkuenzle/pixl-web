import { Crop } from 'react-image-crop';

const getPercentageOffset = (offset: number, delta: number) =>
  delta === 100 ? 50 : (100 * offset) / (100 - delta);

export function getImagePosition(image?: HTMLImageElement, crop?: Crop) {
  if (!image || !crop) {
    return;
  }
  const { width, height, x, y } = crop;
  if (width == null || height == null) {
    return;
  }
  const newRatio = ((width / 100) * image.width) / ((height / 100) * image.height);
  const backgroundSize =
      newRatio > 4 / 3 ? `auto ${(100 / height) * 100}%` : `${(100 / width) * 100}% auto`;
  const backgroundPosition = `${getPercentageOffset(x, width)}% ${getPercentageOffset(
      y,
      height,
    )}%`;
  return { backgroundSize, backgroundPosition };
}

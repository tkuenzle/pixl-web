export function readImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.title = file.name;
    image.src = url;
    resolve(image);
  });
}

export function loadImage(image: HTMLImageElement): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = (error: ErrorEvent) => reject(error);
  });
}

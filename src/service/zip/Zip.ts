import * as JSZip from 'jszip';

import download from 'service/download';

interface FileZip  {
  name: string;
  data: Blob;
}

class Zip {
  public zip: JSZip;
  constructor() {
    this.zip = new JSZip();
  }
  public addFile(file: FileZip) {
    this.zip.file(file.name, file.data);
  }
  public addFolder(folder: string): Zip {
    const folderZip = this.zip.folder(folder);
    const otherZip = new Zip();
    otherZip.zip = folderZip;
    return otherZip;
  }

  public async download() {
    const blob = await this.zip.generateAsync({ type: 'blob' });
    download(blob, 'download.zip', 'application/zip');
  }
}

export default Zip;

import * as React from 'react';

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import { loadImage, readImage } from 'util/promisify';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.grey['200'],
      flex: 1,
      height: '40px',
    },
    fileInput: {
      display: 'none',
    },
    handle: {
      backgroundColor: 'black',
      height: '10px',
      position: 'absolute',
      width: '10px',
    },
    preview: {
      //   backgroundRepeat: 'no-repeat',
      //   backgroundSize: 'contain',
      position: 'relative',
    },
    selection: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      position: 'absolute',
    },
  });

interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}

// tslint:disable
interface ImageCropperProps extends WithStyles<typeof styles> {}

interface ImageCropperState {
  image: HTMLImageElement | undefined;
  crop: Crop | undefined;
  isCropActive: boolean;
}

class ImageCropper extends React.PureComponent<ImageCropperProps, ImageCropperState> {
  private evData: {
    lastX: number,
    lastY: number,
  };
  public state: ImageCropperState = {
    image: undefined,
    crop: undefined,
    isCropActive: false,
  };

  public componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  public componentWillUnmount() {
    const { image } = this.state;
    if (image) {
      URL.revokeObjectURL(image.src);
    }
  }

  private inputRef: React.RefObject<HTMLInputElement> = React.createRef();
  private imageRef: React.RefObject<HTMLImageElement> = React.createRef();

  private handleClick = () => {
    const { current } = this.inputRef;
    if (current) {
      current.click();
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    const { isCropActive, image, crop } = this.state;
    const { current: curImage } = this.imageRef;
    if (!image) {
      return;
    }
    if (!isCropActive) {
      return;
    }
    if (!curImage) {
      return;
    }
    if (!crop) {
      return;
    }

    const offsetX = event.clientX - this.evData.lastX;
    const offsetY = event.clientY - this.evData.lastY;
    const { width, height } = curImage;

    this.evData = {
      lastX: event.clientX,
      lastY: event.clientY,
    }

    this.setState({
      crop: {
        ...crop,
        x: crop.x + (offsetX / width) * image.width,
        y: crop.y + (offsetY / height) * image.height,
      },
    });
    console.log({ event });
  };

  private handleMouseUp = (e: any) => {
    this.setState({ isCropActive: false });
  };

  private handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || files.length > 1) {
      return;
    }
    const image = await readImage(files[0]);
    await loadImage(image);
    this.setState({ image, crop: { x: 0, y: 0, width: image.width, height: image.height } });
    console.log(this.state);
  };

  private handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log({ event });
    this.evData = {
      lastX: event.clientX,
      lastY: event.clientY,
    };
    this.setState({ isCropActive: true });
  };

  private renderCropper() {
    const { classes } = this.props;
    const { image, crop } = this.state;
    if (!image || !crop) {
      return null;
    }
    const cropValues = {
      left: `${(crop.x / image.width) * 100}%`,
      top: `${(crop.y / image.height) * 100}%`,
      right: `${100 - ((crop.x + crop.width) / image.width) * 100}%`,
      bottom: `${100 - ((crop.y + crop.height) / image.height) * 100}%`,
    };
    console.log({ cropValues });
    return (
      <div className={classes.preview}>
        <img ref={this.imageRef} src={image.src} width={'100%'} />
        <div className={classes.selection} style={{ ...cropValues }}>
          <div
            className={classes.handle}
            onMouseDown={this.handleMouseDown}
            style={{
              top: 0,
              left: 0,
              transform: 'translate(-50%,-50%)',
            }}
          />
        </div>
      </div>
    );
  }

  public render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.container} onClick={this.handleClick}>
          <input
            ref={this.inputRef}
            className={classes.fileInput}
            type="file"
            accept="image/jpg"
            onChange={this.handleChange}
          />
        </div>
        {this.renderCropper()}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ImageCropper);

import { createStyles } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { MyTheme } from 'theme';

const defaultCrop = {
  width: 100,
  x: 0,
  y: 0,
};

const styles = (theme: MyTheme) =>
  createStyles({
    base: {
      alignItems: 'stretch',
      backgroundColor: theme.palette.grey['200'],
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
    buttons: {},
    controls: {
      alignItems: 'center',
      display: 'flex',
      flexBasis: theme.sizes.row,
      flexGrow: 0,
      flexShrink: 0,
      justifyContent: 'flex-end',
      padding: `0 ${theme.spacing.unit * 3}px`,
    },
    image: {
      flex: 1,
      position: 'relative',
    },
    innerImage: {
      backgroundColor: theme.palette.grey['600'],
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      textAlign: 'center',
      top: 0,
    },
  });

interface ImageEditorProps extends WithStyles<typeof styles> {
  image: string;
  crop: Crop;
  aspect: number | undefined;
  onChange: (crop: Crop) => void;
}

interface ImageEditorState {
  constrainDimension: string;
}

class ImageEditor extends React.PureComponent<ImageEditorProps, ImageEditorState> {
  public static defaultProps = {
    crop: defaultCrop,
  };

  public state = {
    constrainDimension: 'height',
  };

  public viewRef: React.RefObject<HTMLDivElement> = React.createRef();

  public componentDidUpdate(prevProps: ImageEditorProps) {
    const { aspect, onChange, crop } = this.props;
    if (aspect && prevProps.aspect !== aspect) {
      onChange({ ...crop, aspect, width: undefined });
    }
  }

  public handleCropChange = (crop: Crop, pixelCrop: PixelCrop) => {
    const { onChange } = this.props;
    onChange(crop);
  }

  public setConstraintDimension = (image: HTMLImageElement) => {
    const { current } = this.viewRef;
    if (!current) {
      return;
    }
    const viewRatio = current.clientWidth / current.clientHeight;
    const dim = image.width / image.height > viewRatio ? 'width' : 'height';
    this.setState({ constrainDimension: dim });
  }

  public render() {
    const { classes, aspect, image, crop } = this.props;
    const { constrainDimension } = this.state;
    return (
      <div className={classes.base}>
        <div className={classes.image}>
          <div ref={this.viewRef} className={classes.innerImage}>
            <ReactCrop
              style={constrainDimension === 'height' ? { height: '100%' } : { width: '100%' }}
              imageStyle={{ maxHeight: '100%' }}
              onChange={this.handleCropChange}
              src={image}
              onImageLoaded={this.setConstraintDimension}
              crop={{ ...crop, aspect }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ImageEditor);

import { createStyles, IconButton, Typography } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import CropIcon from '@material-ui/icons/Crop';
import * as React from 'react';
import Dropzone, { FileWithPreview } from 'react-dropzone';
import { FieldRenderProps } from 'react-final-form';
import { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { classNames, MyTheme } from 'theme';
import { getImagePosition } from 'util/image';
import { loadImage } from 'util/promisify';

import { ImageEditor } from './components';

const styles = (theme: MyTheme) =>
  createStyles({
    accept: {
      borderColor: theme.palette.primary.main,
    },
    active: {
      borderStyle: 'solid',
      borderWidth: 2,
    },
    base: {
      '&:hover': {
        backgroundColor: theme.palette.grey['300'],
      },
      '&:hover > #overlay': {
        display: 'flex',
      },
      alignItems: 'center',
      backgroundColor: theme.palette.grey['200'],
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      boxSizing: 'border-box',
      cursor: 'pointer',
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
    controls: {
      display: 'flex',
    },
    crop: {
      position: 'absolute',
      right: theme.spacing.unit,
      top: theme.spacing.unit,
    },
    overlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      color: theme.palette.common.white,
      display: 'none',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
    reject: {
      borderColor: theme.palette.error.main,
    },
  });

interface ImageFieldProps extends WithStyles<typeof styles>, FieldRenderProps {
  pixelX: number;
  pixelY: number;
}

interface ImageFieldState {
  cropping: boolean;
}

class ImageSelect extends React.PureComponent<ImageFieldProps, ImageFieldState> {
  public state = {
    cropping: false,
  };

  public onDrop = async (acceptedFiles: FileWithPreview[], rejectedFiles: FileWithPreview[]) => {
    const { onChange, value } = this.props.input;
    const [file] = acceptedFiles;
    const image = new Image();
    if (file.preview) {
      image.src = file.preview;
      await loadImage(image);
      onChange({ ...value, file: image });
    }
  }

  public renderText() {
    const { input, meta } = this.props;
    const { touched, error } = meta;
    const { src: preview } = input.value && input.value.file;
    const label = touched && error ? error : 'Click here or drop an image.';
    const color = touched && error ? 'error' : 'default';
    return !preview ? <Typography {...{ color }}>{label}</Typography> : null;
  }

  public renderOverlay() {
    const { value } = this.props.input;
    const { src: preview } = value && value.file;
    const { classes, pixelX, pixelY } = this.props;
    const label = 'Click here to chose another image.';
    return preview ? (
      <div id="overlay" className={classes.overlay}>
        <IconButton
          disabled={!(pixelX / pixelY) || !isFinite(pixelX / pixelY)}
          color="inherit"
          className={classes.crop}
          onClick={this.startCrop}
        >
          <CropIcon />
        </IconButton>
        <Typography color="inherit">{label}</Typography>
      </div>
    ) : null;
  }

  public renderDropzone() {
    const { classes, input, meta } = this.props;
    const { touched, error } = meta;
    const { file, crop } = input.value;
    const classNamesArr = [classes.base];
    if (touched && error) {
      classNamesArr.push(classes.active);
      classNamesArr.push(classes.reject);
    }
    return (
      <Dropzone
        activeClassName={classes.active}
        acceptClassName={classes.accept}
        rejectClassName={classes.reject}
        className={classNames(classNamesArr)}
        onDrop={this.onDrop}
        multiple={false}
        accept={'image/jpeg, image/png'}
        style={{ backgroundImage: `url(${file && file.src})`, ...getImagePosition(file, crop) }}
      >
        {this.renderText()}
        {this.renderOverlay()}
      </Dropzone>
    );
  }

  public handleCropChange = (crop: Crop) => {
    const { onChange, value } = this.props.input;
    //tslint:disable
    console.log({ crop });
    onChange({ ...value, crop });
    this.setState({ cropping: false });
  };

  public handleCropCancel = () => this.setState({ cropping: false });

  public renderCrop() {
    const { value } = this.props.input;
    const { pixelX, pixelY } = this.props;
    const { file } = value;
    return (
      <ImageEditor
        image={file.src}
        crop={value.crop}
        onChange={this.handleCropChange}
        onCancel={this.handleCropCancel}
        aspect={pixelX / pixelY}
      />
    );
  }

  public render() {
    const { cropping } = this.state;
    if (cropping) {
      return this.renderCrop();
    }
    return this.renderDropzone();
  }

  private startCrop = (e: any) => {
    e.stopPropagation();
    this.setState({ cropping: true });
  };
}

export default withStyles(styles)(ImageSelect);

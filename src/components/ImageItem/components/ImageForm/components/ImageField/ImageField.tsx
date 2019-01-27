import { createStyles, Typography } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
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
    reject: {
      borderColor: theme.palette.error.main,
    },
  });

interface ImageFieldProps extends WithStyles<typeof styles>, FieldRenderProps {
  pixelX: number;
  pixelY: number;
}

class ImageSelect extends React.PureComponent<ImageFieldProps> {
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
      </Dropzone>
    );
  }

  public handleCropChange = (crop: Crop) => {
    const { onChange, value } = this.props.input;
    onChange({ ...value, crop });
  }

  public renderCrop() {
    const { value } = this.props.input;
    const { pixelX, pixelY } = this.props;
    const { file } = value;
    return (
      <ImageEditor
        image={file.src}
        crop={value.crop}
        onChange={this.handleCropChange}
        aspect={pixelX / pixelY}
      />
    );
  }

  public render() {
    const { file } = this.props.input.value;
    if (file != null) {
      return this.renderCrop();
    }
    return this.renderDropzone();
  }
}

export default withStyles(styles)(ImageSelect);

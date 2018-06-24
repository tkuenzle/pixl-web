import * as React from 'react';

import { createStyles, Typography } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Dropzone, { FileWithPreview } from 'react-dropzone';
import { FieldRenderProps } from 'react-final-form';

import { classNames, MyTheme } from 'theme';

const styles  = (theme: MyTheme) => createStyles({
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
  overlay: {
    '& p': {
      display: 'none',
    },
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    '&:hover p': {
      display: 'block',
    },
    alignItems: 'center',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top:0,
  },
  overlayLabel: {
    color: theme.palette.common.white,
  },
  reject: {
    borderColor: theme.palette.error.main,
  },
});

interface ImageFieldProps extends WithStyles<typeof styles>, FieldRenderProps {
}

class ImageSelect extends React.PureComponent<ImageFieldProps> {
  public onDrop = (acceptedFiles: FileWithPreview[], rejectedFiles: FileWithPreview[]) => {
    const { onChange } = this.props.input;
    const [file] = acceptedFiles;
    onChange(file);
  }

  public renderText() {
    const { preview } = this.props.input.value;
    const { touched, error } = this.props.meta;
    const label = touched && error ? error : 'Click here or drop an image.';
    const color = touched && error ? 'error' : 'default';
    return !preview ? <Typography {...{ color }}>{label}</Typography> : null;
  }

  public renderOverlay() {
    const { preview } = this.props.input.value;
    const { classes } = this.props;
    const label = 'Click here to chose another image.';
    return preview ? (
      <div className={classes.overlay}>
      <Typography className={classes.overlayLabel}>
        {label}
      </Typography>
      </div>
    ) : null;
  }

  public render() {
    const { classes, input, meta } = this.props;
    const { preview } = input.value;
    const { touched, error } = meta;
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
        style={{ backgroundImage: `url(${preview})` }}
      >
        {this.renderText()}
        {this.renderOverlay()}
      </Dropzone>
    );
  }
}

export default withStyles(styles)(ImageSelect);

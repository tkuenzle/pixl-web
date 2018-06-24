import * as React from 'react';

import { createStyles, Theme, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/core/styles/withStyles';

import { ImageForm, ImageItemValues,  ImageView } from './components';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row',
      marginLeft: -theme.spacing.unit * 2,
    },
    form: {
      display: 'flex',
      flex: 1,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    image: {
      height: 200,
      width: 200,
    },
    rowItem: {
      marginLeft: theme.spacing.unit * 2,
    },
  });

interface ImageItemProps extends WithStyles<typeof styles> {
  initialValues: Partial<ImageItemValues>;
  forbiddenNames: string[];
  editing: boolean;
  onSave: (values: ImageItemValues) => any;
  onCancel: () => any;
  onEdit: () => any;
}

class ImageItem extends React.PureComponent<ImageItemProps> {
  public render() {
    const { onSave, onCancel, onEdit, editing, initialValues, forbiddenNames } = this.props;
    const component = editing ? (
      <ImageForm {...{ onSave, onCancel, initialValues, forbiddenNames }} />
    ) : (
      <ImageView {...{ onEdit, initialValues }} />
    );
    return component;
  }
}

export default withStyles(styles)(ImageItem);

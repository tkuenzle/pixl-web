import * as React from 'react';

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import BorderAll from '@material-ui/icons/BorderAll';

import GridItem from 'components/GridItem';

import { ImageItemValues } from '../ImageForm';

import { IconText } from './components';

const styles = (theme: Theme) =>
  createStyles({
    actionArea: {
      flex: 1,
    },
    container: {
      display: 'flex',
      flex: 1,
    },
    content: {
      alignItems: 'stretch',
      display: 'flex',
      flexDirection: 'column',
    },
    media: {
      height: 200,
    },
    title: {
      paddingBottom: theme.spacing.unit * 2,
    },
  });

interface ImageViewProps extends WithStyles<typeof styles> {
  initialValues: Partial<ImageItemValues>;
  onEdit: () => any;
}

class ImageView extends React.PureComponent<ImageViewProps> {
  public render() {
    const { classes, onEdit, initialValues } = this.props;
    const preview = initialValues.image && initialValues.image.preview;
    return (
      <GridItem>
        <Card className={classes.container}>
          <CardActionArea className={classes.actionArea} onClick={onEdit}>
            <CardMedia className={classes.media} image={preview} />
            <CardContent>
              <div className={classes.title}>
                <Typography variant="headline">{initialValues.title}</Typography>
              </div>
              <IconText
                icon={BorderAll}
                label="Number of pixels"
                value={initialValues.minNumberOfPixels}
              />
            </CardContent>
          </CardActionArea>
        </Card>
      </GridItem>
    );
  }
}

export default withStyles(styles)(ImageView);

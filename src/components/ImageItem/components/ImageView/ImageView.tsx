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
import Number from '@material-ui/icons/FilterNone';
import GridItem from 'components/GridItem';
import * as React from 'react';
import { getImagePosition } from 'util/image';

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
      height: 0,
      paddingTop: '66.667%',
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
    const file = initialValues.image && initialValues.image.file;
    const crop = initialValues.image && initialValues.image.crop;
    const preview = file && file.src;
    return (
      <GridItem>
        <Card className={classes.container}>
          <CardActionArea className={classes.actionArea} onClick={onEdit}>
            <CardMedia
              className={classes.media}
              style={getImagePosition(file, crop)}
              image={preview}
            />
            <CardContent>
              <div className={classes.title}>
                <Typography variant="headline">{initialValues.title}</Typography>
              </div>
              <IconText
                icon={BorderAll}
                label="Number of pixels X"
                value={initialValues.minNumberOfPixelsX}
              />
              <IconText
                icon={BorderAll}
                label="Number of pixels Y"
                value={initialValues.minNumberOfPixelsY}
              />
              <IconText
                icon={Number}
                label="Number of images"
                value={initialValues.numberOfImages}
              />
            </CardContent>
          </CardActionArea>
        </Card>
      </GridItem>
    );
  }
}

export default withStyles(styles)(ImageView);

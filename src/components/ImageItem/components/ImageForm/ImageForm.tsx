import * as React from 'react';
import { FileWithPreview } from 'react-dropzone';
import { Field, Form, FormRenderProps } from 'react-final-form';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import BorderAll from '@material-ui/icons/BorderAll';
import Title from '@material-ui/icons/Title';

import GridItem from 'components/GridItem';

import IconListItem from '../IconListItem';

import { ImageField, NumberField, TextField } from './components';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flex: 1,
    },
    form: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    image: {
      height: 200,
    },
  });

export interface ImageItemValues {
  image: FileWithPreview;
  title: string;
  minNumberOfPixels: number;
}
type ImageItemErrors = { [P in keyof ImageItemValues]?: string | object | null };

interface ImageFormProps extends WithStyles<typeof styles> {
  initialValues?: Partial<ImageItemValues>;
  forbiddenNames: string[];
  onSave: (values: ImageItemValues) => any;
  onCancel: () => any;
}

class ImageForm extends React.PureComponent<ImageFormProps> {
  public handleSave = (values: ImageItemValues) => {
    const { onSave } = this.props;
    const { title } = values;
    if (title == null || title.length < 1) {
      values.title = values.image.name;
    }
    onSave(values);
  }

  public renderForm = ({ handleSubmit }: FormRenderProps) => {
    const { classes, onCancel } = this.props;
    return (
      <GridItem>
        <Card className={classes.container}>
          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.image}>
              <Field name="image" component={ImageField} />
            </div>
            <CardContent>
              <IconListItem icon={Title}>
                <Field name="title" label="Image title" component={TextField} />
              </IconListItem>
              <IconListItem icon={BorderAll}>
                <Field name="minNumberOfPixels" label="Number of pixels" component={NumberField} />
              </IconListItem>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={onCancel}>
                Cancel
              </Button>
              <Button size="small" type="submit" color="primary">
                Save
              </Button>
            </CardActions>
          </form>
        </Card>
      </GridItem>
    );
  }

  public render() {
    const { initialValues } = this.props;
    return (
      <Form
        validate={this.validate}
        render={this.renderForm}
        onSubmit={this.handleSave}
        {...{ initialValues }}
      />
    );
  }

  public validate = (values: Partial<ImageItemValues>): ImageItemErrors => {
    const { forbiddenNames } = this.props;
    const errors: ImageItemErrors = {};
    if (!values.image) {
      errors.image = 'Please select an image.';
    }
    if (values.minNumberOfPixels == null) {
      errors.minNumberOfPixels = 'Please enter a valid number.';
    } else if (values.minNumberOfPixels < 1) {
      errors.minNumberOfPixels = 'Please enter at least 0.';
    }
    if (values.title == null || values.title.length === 0) {
      errors.title = 'Please enter a name.';
    } else if (forbiddenNames.includes(values.title)) {
      errors.title = `You may not use the same name twice. (${forbiddenNames.join(', ')})`;
    }
    return errors;
  }
}

export default withStyles(styles)(ImageForm);

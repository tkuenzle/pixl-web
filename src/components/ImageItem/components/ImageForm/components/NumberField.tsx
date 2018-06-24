import * as React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { createStyles, TextField, Theme, withStyles, WithStyles } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
  input: {
    width: 10,
  },
});

interface NumberFieldProps extends WithStyles<typeof styles>, FieldRenderProps {
  label: string;
}

class NumberField extends React.PureComponent<NumberFieldProps> {
  public render() {
    const { classes, label, input, meta } = this.props;
    const { value, name, ...restInput } = input;
    const { touched, error } = meta;
    return (
      <TextField
        id={name}
        value={value}
        margin="normal"
        fullWidth={true}
        type="number"
        error={touched && !!error}
        helperText={touched && error}
        variant="filled"
        inputProps={{ className: classes.input, size: 1 }}
        {...{ label }}
        {...restInput}
      />
    );
  }
}

export default withStyles(styles)(NumberField);

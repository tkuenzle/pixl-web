import * as React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { TextField as TextFieldMui } from '@material-ui/core';

interface TextFieldProps extends FieldRenderProps {
  label: string;
}

class TextField extends React.PureComponent<TextFieldProps> {
  public render() {
    const { label, input, meta } = this.props;
    const { value, name, ...restInput } = input;
    const { touched, error } = meta;
    return (
      <TextFieldMui
        id={name}
        value={value}
        margin="normal"
        fullWidth={true}
        type="text"
        error={touched && !!error}
        helperText={touched && error}
        variant="filled"
        inputProps={{ size: 1 }}
        {...{ label }}
        {...restInput}
      />
    );
  }
}

export default TextField;

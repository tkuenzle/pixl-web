import { AppBar, Toolbar, Typography } from '@material-ui/core';
import * as React from 'react';

interface ITitleBarProps {
  title: string;
}

class TitleBar extends React.PureComponent<ITitleBarProps> {
  public render() {
    const { title } = this.props;
    return (
      <AppBar>
        <Toolbar>
          <Typography>{title}</Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TitleBar;

import * as React from 'react';

import { AppBar, Toolbar, Typography } from '@material-ui/core';

interface TitleBarProps {
  title: string;
}

class TitleBar extends React.PureComponent<TitleBarProps> {
  public render() {
    const { title } = this.props;
    return (
      <AppBar>
        <Toolbar>
          <Typography variant="title" color="inherit">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TitleBar;

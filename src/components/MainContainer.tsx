import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import { MyTheme } from 'theme';

const styles = (theme: MyTheme) =>
  createStyles({
    container: {
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'center',
      marginTop: theme.mixins.toolbar.minHeight,
      padding: '0 24px',
      width: '100%',
    },
    innerContainer: {
      alignItems: 'flex-start',
      display: 'grid',
      flex: 1,
      gap: '16px',
      gridTemplateColumns: 'repeat(4, 1fr)',
      maxWidth: '1400px',
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(8, 1fr)',
      },
      [theme.breakpoints.up('md')]: {
        gap: '24px',
        gridTemplateColumns: 'repeat(12, 1fr)',
      },
      width: '100%',
      // margin: '0 48px',
    },
  });

interface MainContainerProperties extends WithStyles<typeof styles> {
  children: React.ReactNode;
}

class MainContainer extends React.PureComponent<MainContainerProperties> {
  public render() {
    const { classes, children } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.innerContainer}>{children}</div>
      </div>
    );
  }
}

export default withStyles(styles)(MainContainer);

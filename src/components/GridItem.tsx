import * as React from 'react';

import { StyleRulesCallback, withStyles } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { MyTheme } from 'theme';

type Classes = 'container';

const styles: StyleRulesCallback<Classes> = (theme: MyTheme) => ({
  container: {
    display: 'flex',
    gridColumnEnd: 'span 4',
  },
});

interface GridItemProps {
  classes: ClassNameMap<Classes>;
  children: React.ReactNode;
}

class GridItem extends React.PureComponent<GridItemProps> {
  public render() {
    const { classes, children } = this.props;
    return <div className={classes.container}>{children}</div>;
  }
}

export default withStyles(styles)(GridItem);

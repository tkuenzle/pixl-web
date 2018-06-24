import * as React from 'react';

import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
    },
    content: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    icon: {
      color: theme.palette.text.secondary,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginRight: theme.spacing.unit * 2,
    },
  });

interface IconListItemProps extends WithStyles<typeof styles> {
  icon: React.ComponentType<SvgIconProps>;
  children: React.ReactNode;
}

class IconListItem extends React.PureComponent<IconListItemProps> {
  public render() {
    const { classes, icon: Icon, children } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.icon}>
          <Icon />
        </div>
        <div className={classes.content}>{children}</div>
      </div>
    );
  }
}

export default withStyles(styles)(IconListItem);

import * as React from 'react';

import { StyleRulesCallback, Theme, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import PlayIcon from '@material-ui/icons/PlayArrow';

type Classes = 'fab' | 'extendedIcon';

const styles: StyleRulesCallback<Classes> = (theme: Theme) => ({
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  fab: {
    bottom: theme.spacing.unit * 3,
    position: 'fixed',
    right: theme.spacing.unit * 3,
  },
});

interface FabProperties {
  classes: ClassNameMap<Classes>;
  onClick: () => any;
}

class Fab extends React.PureComponent<FabProperties> {
  public render() {
    const { classes, onClick } = this.props;
    return (
      <Button className={classes.fab} variant="extendedFab" color="secondary" {...{ onClick }}>
        <PlayIcon className={classes.extendedIcon} />
        Run
      </Button>
    );
  }
}

export default withStyles(styles)(Fab);

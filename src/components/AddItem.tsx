import * as React from 'react';

import { ButtonBase, createStyles, Theme, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';

import GridItem from './GridItem';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      '&:hover': {
        backgroundColor: theme.palette.grey['200'],
        borderWidth: 0,
        color: theme.palette.text.primary,
      },
      borderColor: theme.palette.grey['300'],
      borderRadius: 4,
      borderStyle: 'dashed',
      borderWidth: 2,
      color: theme.palette.text.secondary,
      flex: 1,
      flexDirection: 'column',
      height: 300,
    },
  });

interface AddItemProps extends WithStyles<typeof styles> {
  onClick: () => any;
}

class AddItem extends React.PureComponent<AddItemProps> {
  public render() {
    const { classes, onClick } = this.props;
    return (
      <GridItem>
        <ButtonBase className={classes.container} {...{ onClick }}>
          <AddIcon fontSize="large" />
        </ButtonBase>
      </GridItem>
    );
  }
}

export default withStyles(styles)(AddItem);

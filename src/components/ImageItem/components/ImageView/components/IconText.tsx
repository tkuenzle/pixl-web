import { Typography } from '@material-ui/core';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import * as React from 'react';

import IconListItem from '../../IconListItem';

interface IconTextProps {
  icon: React.ComponentType<SvgIconProps>;
  label: string;
  value: number | undefined;
}

class IconText extends React.PureComponent<IconTextProps> {
  public render() {
    const { icon, label, value } = this.props;
    return (
      <IconListItem {...{ icon }}>
        <Typography color="textSecondary">{label}</Typography>
        <Typography variant="subheading">{value}</Typography>
      </IconListItem>
    );
  }
}

export default IconText;

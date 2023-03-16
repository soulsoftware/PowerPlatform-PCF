import * as React from 'react';
import { Label } from '@fluentui/react';

export interface InfiniteDetailListProps {
  name?: string;
}

const  _InfiniteDetailListControl = ( props: InfiniteDetailListProps ) => {
  
    return (
      <Label>
        {props.name}
      </Label>
    )
}

export const InfiniteDetailListControl = React.memo( _InfiniteDetailListControl )




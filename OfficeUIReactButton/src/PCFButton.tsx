import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react';

export interface IPCFButtonProps {
  // These are set based on the toggles shown above the examples (not needed in real code)
  buttonValue: string;
  buttonLink: string;
}

export const ButtonAnchor: React.FunctionComponent<IPCFButtonProps> = props => {
  return (
    <PrimaryButton href={props.buttonLink} target="_blank">
      {props.buttonValue}
    </PrimaryButton>
  );
};
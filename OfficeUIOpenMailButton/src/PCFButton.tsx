import * as React from 'react';
import { ActionButton, initializeIcons, IIconProps } from 'office-ui-fabric-react';

export interface IPCFButtonProps {
  // These are set based on the toggles shown above the examples (not needed in real code)
  MessageID: string;
  Target: string;
  disabled?: boolean;
  checked?: boolean;
}

export function initialize() {
  initializeIcons()
}

export const ButtonAnchor: React.FunctionComponent<IPCFButtonProps> = props => {
  const { checked, MessageID, Target } = props;
  const addFriendIcon: IIconProps = { iconName: 'outlookLogo' };

  const disabled = (MessageID==null || MessageID.trim().length==0)

  const id = encodeURI( MessageID );
  const url = `https://outlook.office365.com/owa/?ItemID=${id}&exvsurl=1&viewmodel=ReadMessageItem`

  function openOWA() {
  
    console.log( `open url to ${Target}`, url)
    window.open( url, Target)
  
  }

  return (
    
    <ActionButton  onClick={openOWA} iconProps={addFriendIcon} allowDisabledFocus disabled={disabled} checked={checked} >
      Open
    </ActionButton>  
    
   /*
    <DefaultButton  href={url} target={Target} iconProps={addFriendIcon} allowDisabledFocus disabled={disabled} checked={checked} >
      Open
    </DefaultButton>  
   */
  
  );
}

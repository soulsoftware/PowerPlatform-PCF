import * as React from 'react';
import { initializeIcons, IIconProps, MaskedTextField } from 'office-ui-fabric-react';

type OnTimeChangeHandler = (newValue: Date ) => void 

export interface IPCFHourOnlyTextFieldProps {
  // These are set based on the toggles shown above the examples (not needed in real code)
  DefaultDate: Date;
  TimeValue: Date;
  disabled?: boolean;  

  onTimeChange: OnTimeChangeHandler
}

/**
 * 
 */
export function initialize() {
  initializeIcons()
}


function formatTime( input:Date|string ) {
  const format2digit = ( v:number ) => (v<=9 ) ? `0${v}` : `${v}` 

  if( input instanceof Date ) {
      return `${format2digit(input.getHours())}:${format2digit(input.getMinutes())}`
  }

  return input
}
/**
 * 
 * @param props 
 * @returns 
 */
export const HourOnlyTextField: React.FunctionComponent<IPCFHourOnlyTextFieldProps> = props => {
  const {  disabled, DefaultDate, TimeValue, onTimeChange } = props;
  const TimeIcon: IIconProps = { iconName: 'DateTime2' };

  const timeIsValid = ( value?:string ):Date|null => {
      if( !value ) return null
      const res = /(\d\d):(\d\d)/.exec(value)
      if( !res || res.length!= 3 ) return null
      const h = parseInt(res[1])
      if( h > 24 ) return null
      const m = parseInt(res[2])
      if( m > 60 ) return null
      const dt = new Date( DefaultDate.getTime() )
      dt.setHours( h )
      dt.setMinutes( m )
      return dt;
  }

  const onChangeHandler = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) =>  {
      const dt = timeIsValid(newValue)
      
      if( dt != null ) onTimeChange( dt )
  }

  const getErrorMessage = ( value:string ) => 
      ( timeIsValid( value ) ) ? '' : 'Hour not valid!';

  const v = formatTime(TimeValue)
  
  return (
    <MaskedTextField  iconProps={TimeIcon} 
                      disabled={disabled} 
                      mask="99:99" 
                      value={v} 
                      onChange={onChangeHandler}
                      onGetErrorMessage={getErrorMessage}
                      >
    </MaskedTextField>

  );
}

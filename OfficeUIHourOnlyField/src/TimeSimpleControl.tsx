import { IIconProps } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { MaskedTextField } from '@fluentui/react/lib/TextField';
import * as React from 'react';

type OnTimeChangeHandler = (newValue: Date ) => void 

export interface IPCFTextFieldProps {
  // These are set based on the toggles shown above the examples (not needed in real code)
  DefaultDate: Date;
  TimeValue: Date;
  isUTC:boolean;
  disabled?: boolean;  

  onTimeChange: OnTimeChangeHandler
}

/**
 * 
 */
export function initialize() {
  initializeIcons()
}


type TimeType  = { h:number, m:number } 


/**
 * 
 * @param props 
 * @returns 
 */
export const HourOnlyTextField: React.FunctionComponent<IPCFTextFieldProps> = props => {
  const {  disabled, DefaultDate, TimeValue, onTimeChange, isUTC } = props;
  
  const TimeIcon: IIconProps = { iconName: 'DateTime2' };
 
  const getTime = (d:Date):TimeType => 
      (isUTC) ? 
        { h:d.getUTCHours(), m:d.getUTCMinutes() }  : 
        { h:d.getHours(), m:d.getMinutes() } 

  const setTime = (t:TimeType):Date => { 
    const d = new Date( DefaultDate.getTime() )
    if(isUTC) { 
      d.setUTCHours(t.h)
      d.setUTCMinutes(t.m)
    } 
    else {
      d.setUTCHours(t.h) 
      d.setUTCMinutes(t.m)
    }
    return d
  }

  const formatTime = ( input:Date|string ) => {
    const format2digit = ( v:number ) => (v<=9) ? `0${v}` : `${v}` 
  
    if( input instanceof Date ) {
        const t = getTime(input) 
        return `${format2digit(t.h)}:${format2digit(t.m)}`
    }
  
    return input
  }
  
  const timeIsValid = ( value?:string ):Date|null => {
      if( !value ) return null
      const res = /(\d\d):(\d\d)/.exec(value)
      if( !res || res.length!= 3 ) return null

      let hh = parseInt(res[1])
      let mm = parseInt(res[2])
      if( mm > 59 ) {
        hh++
        mm -= 60
      }
      if( hh > 23 ) return null

      const dt = setTime( { h:hh, m:mm } )

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

import { IIconProps } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { TextField } from '@fluentui/react/lib/TextField';
import * as React from 'react';
import './time.extension'

type OnTimeChangeHandler = (newValue?: Date) => void

export interface IPCFTextFieldProps {
	// These are set based on the toggles shown above the examples (not needed in real code)
	DefaultDate: Date|null;
	TimeValue: Date|null;
	TimeZoneIndependent: boolean;
	visible:boolean
	disabled?: boolean;
	onTimeChange: OnTimeChangeHandler
}

/**
 * 
 */
export function initialize() {
	initializeIcons()
}

/**
 * 
 * @param props 
 * @returns 
 */
export const HourOnlyTextField: React.FunctionComponent<IPCFTextFieldProps> = props => {
	const { visible, disabled, DefaultDate, TimeValue, onTimeChange, TimeZoneIndependent } = props;

	if ( visible===false ) return ( <div></div> )

	const defDate = ( DefaultDate == null ) ? new Date( 1899, 11, 31, 0, 0) : new Date( DefaultDate )

	const [timeValueField, setTimeValueField] = React.useState( () => 		
		( TimeValue != null ) ?
			(( TimeZoneIndependent ) ?
						TimeValue.toTimeZoneIndependentString( { hour12:true } ) :
						TimeValue.toTimeZoneDependentString( { hour12:true } )) : 
						''
	)

	const [errorMessage, setErrorMessage] = React.useState('');

	const onChangeHandler = React.useCallback(
	    (event: React.FormEvent<HTMLInputElement|HTMLTextAreaElement>, value?: string): void => {
			// console.log( 'onChangeHandler', value )
			if( value ) {
				setTimeValueField( value )
				const checkDate = new Date( `${defDate.toDateString()} ${value}`)
				if( !isNaN(checkDate.getTime()) ) {
					onTimeChange( checkDate )
					setErrorMessage('')
				}
				else {
					setErrorMessage('Time is not valid!')
				}
			}
			else {
				setErrorMessage('')
				setTimeValueField( '' )
				onTimeChange( undefined )
			}
	    }, [])

	const TimeIcon: IIconProps = { iconName: 'Clock' };
	
	return (		
			<TextField
				placeholder="---"
				onChange={onChangeHandler}
				iconProps={TimeIcon}
				value={timeValueField}
				errorMessage={errorMessage}
				readOnly={disabled}
			>
			</TextField>
		)
}



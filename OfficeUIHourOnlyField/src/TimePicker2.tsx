import * as React from 'react';
import './time.extension'
import {
	initializeIcons,
	IIconProps,
	TextField
} from 'office-ui-fabric-react';

type OnTimeChangeHandler = (newValue: Date) => void

export interface IPCFHourOnlyTextFieldProps {
	// These are set based on the toggles shown above the examples (not needed in real code)
	DefaultDate: Date|null;
	TimeValue: Date|null;
	isUTC: boolean;
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
export const HourOnlyTextField: React.FunctionComponent<IPCFHourOnlyTextFieldProps> = props => {
	const { disabled, DefaultDate, TimeValue, onTimeChange, isUTC } = props;

	const [timeValueField, setTimeValueField] = React.useState( () => 
		( TimeValue != null ) ? TimeValue.toTimeObjectString( { hour12:true } ): '')
			
	const [errorMessage, setErrorMessage] = React.useState('');

	const onChangeHandler = React.useCallback(
	    (event: React.FormEvent<HTMLInputElement|HTMLTextAreaElement>, value?: string): void => {
			console.log( 'onChangeHandler', value )
			if( value ) {
				setTimeValueField( value )
				const checkDate = new Date( `${DefaultDate?.toDateString()} ${value}`)
				if( !isNaN(checkDate.getTime()) ) {
					onTimeChange( checkDate )
					setErrorMessage('')
				}
				else {
					setErrorMessage('Time is not valid!')
				}
			}
	    }, [])

	const TimeIcon: IIconProps = { iconName: 'TimePicker' };

	return (
		<TextField
			onChange={onChangeHandler}
			iconProps={TimeIcon}
			value={timeValueField}
			errorMessage={errorMessage}
		>
		</TextField>
	)
}



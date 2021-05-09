import * as React from 'react';
import './time.extension'
import {
	initializeIcons,
	IIconProps,
	ComboBox,
	IComboBoxOption,
	SelectableOptionMenuItemType,
	IComboBoxStyles,
	IComboBox
} from 'office-ui-fabric-react';

type OnTimeChangeHandler = (newValue: Date) => void

export interface IPCFHourOnlyTextFieldProps {
	// These are set based on the toggles shown above the examples (not needed in real code)
	DefaultDate: Date|null;
	TimeValue: Date;
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

type TimeOptions = { options:IComboBoxOption[], selectedKey?:string }
/**
 * 
 * @param defaultDate 
 * @param step 
 * @returns 
 */
function getTimeOptions( step:number, timeValue:Date, defaultDate:Date|null ) {

	let options: IComboBoxOption[] = []

	let firstDate = defaultDate || new Date(0, 0, 0)
	firstDate.setHours(0)
	firstDate.setMinutes(0)

	let selectedKey:string|undefined

	let nextDate = firstDate

	const timeEqual = ( d1:Date, d2:Date ) => {
		const t1 = d1.getTimeObject()
		const t2 = d2.getTimeObject()
		
		return t1.mm === t2.mm && t1.hh === t2.hh
	}

	options.push({ key: 'h_am', text: 'AM', itemType: SelectableOptionMenuItemType.Header })
	options.push({ key: 'd_am', text: 'AM', itemType: SelectableOptionMenuItemType.Divider })

	while (firstDate.getDate() == nextDate.getDate() && nextDate.getTime12Object().am) {

		const text = nextDate.toLocaleTimeObjectString('en-us')

		if( timeEqual(timeValue, nextDate) ) {
			console.log( 'selected key', text )
			selectedKey = text
		}

		options.push({ key: text, text: text, data:nextDate })

		nextDate = nextDate.addMinutes(step)
	}

	options.push({ key: 'h_pm', text: 'PM', itemType: SelectableOptionMenuItemType.Header })
	options.push({ key: 'd_pm', text: 'PM', itemType: SelectableOptionMenuItemType.Divider })

	while (firstDate.getDate() == nextDate.getDate() && !nextDate.getTime12Object().am) {

		const text = nextDate.toLocaleTimeObjectString('en-us')

		if( timeEqual(timeValue, nextDate) ) {
			console.log( 'selectedKey', text )
			selectedKey = text
		}

		options.push({ key: text, text: text, data:nextDate })

		nextDate = nextDate.addMinutes(step)
	}

	if( !selectedKey ) {
		selectedKey = options[3].key as string
	}
	return { options:options, selectedKey:selectedKey }

}

/**
 * 
 * @param props 
 * @returns 
 */
export const HourOnlyTextField: React.FunctionComponent<IPCFHourOnlyTextFieldProps> = props => {
	const { disabled, DefaultDate, TimeValue, onTimeChange, isUTC } = props;

	let step = 15;

	const [options] = React.useState( () => getTimeOptions( step, TimeValue, DefaultDate ) ) 
	const [selectedKey, setSelectedKey] = React.useState<string | number | undefined>( () => options.selectedKey );

	const onChangeHandler = React.useCallback(
	    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void => {
			if( option && option.data ) {
				setSelectedKey(option.key)
				onTimeChange( option.data )
			}
	    }, [])

	// const onChangeHandler = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string ) => {
	// }

	const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };

	const TimeIcon: IIconProps = { iconName: 'TimePicker' };

	return (
		<ComboBox
			selectedKey={selectedKey}
			onChange={onChangeHandler}
			buttonIconProps={TimeIcon}
			options={options.options}
			styles={comboBoxStyles}
		>
		</ComboBox>
	)
}



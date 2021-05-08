import * as React from 'react';
import * as moment from 'moment'

export class TimePicker extends React.Component {

	defaultValue: string
	name: string
	beginLimit: string
	endLimit: string
	step: number

	onChange: () => void 
		
	isEarlierThanEndLimit(timeValue:any, endLimit:any, lastValue:any) {
		const timeValueIsEarlier = moment(timeValue, 'h:mmA').diff(moment(endLimit, 'h:mmA')) < 0
		const timeValueIsLaterThanLastValue = lastValue === undefined ? true : moment(lastValue, 'h:mmA').diff(moment(timeValue, 'h:mmA')) < 0
		return timeValueIsEarlier && timeValueIsLaterThanLastValue;
	}

	render () {
		let timeValue = this.beginLimit || "12:00AM";
		let lastValue;
    	let endLimit = this.endLimit || "11:59PM";
		let step = this.step || 15;

		let options = [];
		options.push(<option key={timeValue} value={timeValue}>{timeValue}</option>);
		while ( this.isEarlierThanEndLimit(timeValue, endLimit, lastValue) ) 
		{
				lastValue = timeValue;
				console.log(timeValue, moment(timeValue, 'h:mmA').diff(moment(endLimit, 'h:mmA'), 'minutes'));
				timeValue = moment(timeValue, 'h:mmA').add(step, 'minutes').format('h:mmA');
				options.push(<option key={timeValue} value={timeValue}>{timeValue}</option>)
		}

		return(
			<select defaultValue={this.defaultValue} onChange={this.onChange} name={this.name}>
				{options}
			</select>
		)
	}
}

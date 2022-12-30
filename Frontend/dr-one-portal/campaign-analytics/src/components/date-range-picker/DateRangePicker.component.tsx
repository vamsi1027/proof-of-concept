import React from 'react';
import useDateRangePicker, { Props } from './useDateRangePicker.hook';
import { Button, Card, Typography } from '@material-ui/core';
import { DateRangePicker } from 'materialui-daterange-picker';

/**
 * Custom component to pick a Date Range
 * @param className
 * @param onCancel - to execute when Cancel is clicked
 * @param onChange
 * @param initialValues
 * @param onApply - to execute when Apply is clicked, bind the selected Date Range
 * @param rest
 * @returns Date Range Picker Component
 */
const DateRangePickerComponent: React.FunctionComponent<Props & Record<string, any>> = ({
	className,
	onCancel,
	onChange,
	dateRange,
	onApply,
	...rest
}) => {
	const { props } = useDateRangePicker({ onChange, dateRange, className, onCancel, onApply });
	return (
		<Card {...props.parent} {...rest}>
			<div {...props.header}>
				<Typography {...props.title}>Date Range</Typography>
			</div>

			<DateRangePicker {...props.picker} />

			<div {...props.footer}>
				<Button {...props.cancel}>Cancel</Button>

				<Button {...props.apply}>Apply</Button>
			</div>
		</Card>
	);
};

export default React.memo(DateRangePickerComponent);

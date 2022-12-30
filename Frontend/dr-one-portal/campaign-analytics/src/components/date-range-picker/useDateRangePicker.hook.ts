import './DateRangePicker.style.css';
import { DateRange } from 'materialui-daterange-picker';
import subFns from 'date-fns/sub';
import addFns from 'date-fns/add';
import { ElementType } from 'react';
import { Variant } from '@material-ui/core/styles/createTypography';
import { classNames } from '../../utils';
import { useState } from 'react';

/* Prop definition */
export type Props = {
  className?: string;
  onCancel: VoidFunction;
  onApply: (dateRange: DateRange | undefined) => void;
  //onChange?: (dateRange: DateRange | undefined) => void;
  dateRange?: DateRange
};

const useDateRangePicker: Function = ({
  className,
  onCancel,
  onApply,
  dateRange
}: Props): {} => {

  const [localDateRange, setLocalDateRange] = useState<DateRange>(dateRange);

  /* Set the selected date range in to state */
  const onDateRangeChange = (range: DateRange) => {
    //onChange(range)
    setLocalDateRange(range)
  };

  /* Component prop definition */
  const props = {
    /* Card parent */
    parent: {
      className: classNames('drp', className),
    },

    /* Picker header */
    header: {
      className: 'header',
    },

    /* Picker header Title */
    title: {
      component: 'h3' as ElementType,
      variant: 'h6' as Variant,
    },

    /* Picker component */
    picker: {
      onChange: onDateRangeChange,
      open: true,
      toggle: () => { },
      initialDateRange: localDateRange,
      minDate: subFns(new Date(2016, 1, 1), {}),
      maxDate: addFns(new Date(), { days: 31 })
    },

    /* Picker footer */
    footer: {
      className: 'footer',
    },

    /* footer cancel */
    cancel: {
      onClick: onCancel,
      variant: 'outlined',
    },

    /* footer apply */
    apply: {
      onClick: () => onApply(localDateRange),
      disabled: !dateRange,
      color: 'primary',
      variant: 'contained'
    },
  };
  return { dateRange: localDateRange, onDateRangeChange, props };
};

export default useDateRangePicker;

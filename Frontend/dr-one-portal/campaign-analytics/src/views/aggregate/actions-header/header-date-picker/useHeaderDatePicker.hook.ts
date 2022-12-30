import { DateRange } from 'materialui-daterange-picker';
import { format } from 'date-fns';
import { icon_calendar } from '../../../../assets';
import { useActive } from '../../../../hooks';

/* Prop definition */
export type Props = {
  className?: string;
  onChange?: (dateRange: DateRange | undefined) => void;
  dateRange?: DateRange
};

const useHeaderDatePicker: Function = ({ className, onChange, dateRange }: Props): {} => {
  // const useHeaderDatePicker: Function = ({ className }: Props): {} => {
  /* Date Picker state */
  const [isDatePickerOpen, openDatePicker, closeDatePicker] = useActive();

  /* Set the selected date range into state */
  const onApply = (range: DateRange) => {
    /* Set date range */
    onChange(range)
    closeDatePicker();
  };

  /* components props */
  const props = {
    button: {
      onClick: openDatePicker,
      variant: 'outlined',
    },

    icon: {
      src: icon_calendar,
      alt: 'Filter by date range',
    },

    /* return the current selected date range as specific date format */
    formatedDate: `${dateRange.startDate ? format(dateRange.startDate, 'PPP') : 'Start Date'
      } - ${dateRange.endDate ? format(dateRange.endDate, 'PPP') : 'End Date'}`,

    isDatePickerOpen: isDatePickerOpen,

    /* Date picker */
    wrapper: { className },

    picker: { onCancel: closeDatePicker, onApply, raised: true, dateRange },
  };

  return { props };
};

export default useHeaderDatePicker;

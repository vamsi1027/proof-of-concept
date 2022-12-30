import React from "react";
import {
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import SendReport from "./SendReport";
import { RowLayout } from "../../../Layouts";
import { icon_download } from "../../../assets";
import { useTranslation } from 'react-i18next';
import "./styles.css";

const ControlPanel: React.FunctionComponent = () => {
  const [month, setMonth] = React.useState("");
  const { t } = useTranslation();

  const props = {
    parent: { className: "PerformanceReportControlPanel", elevation: 2 },

    formControl: {
      style: {
        maxWidth: "20rem",
      },
    },

    label: { id: "month_label" },

    select: {
      labelId: "month_label",
      label: "Month",
      value: month,
      onChange: (event) => setMonth(event.target?.value as string),
      MenuProps: {
        PaperProps: {
          style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
          },
        },
      },
    },

    actions: { columns: 2 },

    export: {
      endIcon: <img src={icon_download} alt={`Graph Download`} />,
    },
  };

  return (
    <Card {...props.parent}>
      <FormControl variant="outlined" {...props.formControl}>
        <InputLabel {...props.label}>Month</InputLabel>

        <Select {...props.select}>
          <MenuItem value="">None</MenuItem>
          {[...Array(20)].map((_, index) => (
            <MenuItem value={index} key={index}>
              October {2020 + index}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <RowLayout {...props.actions}>
        <Button
          variant="outlined"
          style={{
            textTransform: "none",
            fontWeight: 600,
          }}
          {...props.export}
        >
          {t('EXPORT_BUTTON')}
        </Button>

        <SendReport />
      </RowLayout>
    </Card>
  );
};

export default React.memo(ControlPanel);

import { CardContent, Chip } from "@material-ui/core";
import React from "react";
import { RowLayout } from "../../../../../Layouts";

const Mails: React.FunctionComponent = () => {
  const inputRef = React.useRef(null);

  const [mail, setMail] = React.useState<string>("");
  const [mails, setMails] = React.useState<string[]>([]);

  const addMail = (event) => {
    if (
      (event.key === ";" || event.key === "Enter" || event.key === " ") &&
      mail.trim().length > 0
    ) {
      setMails([...mails, mail.trim().toLowerCase()]);
      setMail("");
    }
  };

  const removeMail = (index) => {
    const mailsAux = [...mails.filter((_, i) => i !== index)];
    setMails(mailsAux);
  };

  const props = {
    content: { className: "SendReportCardContent" },

    contentWrapper: {
      className: "SendReportCardContentWrapper",
      onClick: () => inputRef?.current?.focus(),
    },

    span: { className: "SendReportCardContentSpan" },

    row: { autoFlow: true, minWidth: 8 },

    chip: (value, index) => ({
      className: "SendReportChipMail",
      key: index,
      label: value,
      title: value,
      onDelete: () => removeMail(index),
    }),

    input: {
      ref: inputRef,
      style: {
        border: "none",
      },
      type: "text",
      value: mail,
      onChange: (event) => setMail(event.target?.value),
      onKeyPress: addMail,
    },
  };

  return (
    <CardContent {...props.content}>
      <div {...props.contentWrapper}>
        <span {...props.span}>Email distribution</span>

        <RowLayout {...props.row}>
          {mails.map((value, index) => (
            <Chip
              color="primary"
              variant="outlined"
              {...props.chip(value, index)}
            />
          ))}
          <input {...props.input} />
        </RowLayout>
      </div>
    </CardContent>
  );
};

export default React.memo(Mails);

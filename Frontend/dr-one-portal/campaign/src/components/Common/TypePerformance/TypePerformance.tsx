import React from "react";
import { Radio, Grid } from "@material-ui/core";
import { Colors } from "@dr-one/utils";
import * as S from "./TypePerformance.styles";

interface ITypePerformanceRadioProps {
  value: string;
  title: object;
  iconWhite: string;
  iconDefault: string;
  typePerformance: string;
  setMetrics: (key: string, value: any) => void;
  disabled: boolean;
}

const TypePerformanceRadio = ({
  value,
  title,
  iconWhite,
  iconDefault,
  typePerformance,
  setMetrics,
  disabled
}: ITypePerformanceRadioProps) => {
  return (

        <Grid item xs={6} md={3} className="form-row">
          <S.SelectRadio>
            <Radio
              color="primary"
              value={value}
              checked={typePerformance === value}
              onChange={(e) => {
                setMetrics("typePerformance", e.target.value);
              }}
              disabled={disabled}
            />
            <section>
              <div
                style={typePerformance === value ? {background: Colors.PRIMARY} : { background: "#ffffff" }}
              >
                <img
                  src={typePerformance === value ? iconWhite : iconDefault}
                  alt={`icon ${value}`}
                />
              </div>
              <p>{title}</p>
            </section>
          </S.SelectRadio>
        </Grid>

  );
};

export default TypePerformanceRadio;

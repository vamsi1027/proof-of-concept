import "./styles.css";
import Badge from "../../Badge";
import React from "react";

type Row = {
  title: string;
  value: string;
};

type Props = {
  rows: Row[];
};

const SimpleTable: React.FunctionComponent<Props> = ({ rows }) => {
  return (
    <div className="SimpleTableWrapper">
      <div>
        <table className="SimpleTable">
          <tbody>
            {[...Array(10)].map((_, index) => (
              <tr key={index}>
                <td>
                  <span>Total preload users</span>
                </td>

                <td>
                  <Badge value="10093" />
                </td>
              </tr>
            ))}

            {rows.map((value, index) => (
              <tr key={index}>
                <td>
                  <span>{value.title}</span>
                </td>

                <td>
                  <Badge value={value.value} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(SimpleTable);

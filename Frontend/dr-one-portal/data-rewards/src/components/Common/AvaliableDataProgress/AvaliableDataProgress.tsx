import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ChangingProgressProvider from "../../../utils/ChangingProgressProvider";
import * as S from "./AvaliableDataProgress.styles";
interface IAvaliableDataProgressProps {
  percentage: number;
}
const AvaliableDataProgress = ({ percentage }: IAvaliableDataProgressProps) => {
  return (
    <S.Container>
      <ChangingProgressProvider values={[0, percentage]}>
        {(percentage) => (
          <CircularProgressbar
            className="data-rewards-analytics-circular-progress-bar"
            value={percentage}
            text={`${percentage}%`}
            strokeWidth={12}
            styles={buildStyles({
              textColor: "#1975FF",
              pathColor: "#1975FF",
              trailColor: "#FFFFFF",
              rotation: 0.5 + (1 - percentage / 100) / 2.5,
            })}
          />
        )}
      </ChangingProgressProvider>
    </S.Container>
  );
};
export default AvaliableDataProgress;

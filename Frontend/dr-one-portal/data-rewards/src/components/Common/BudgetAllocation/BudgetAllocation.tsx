import * as S from "./BudgetAllocation.styles";
import { punctuateNumber } from "@dr-one/utils";
import Title from "../Title/TitleView";
import { Divider } from "@material-ui/core";

interface IBudgetAllocationProps {
  budgetAllocation: {
    title: string;
    value: number;
  }[];
}
const BudgetAllocation = ({ budgetAllocation }: IBudgetAllocationProps) => {
  return (
    <S.Container>
      <Title title="Budget Allocation">
        <Divider />
      </Title>
      <S.List>
        {budgetAllocation.map((item, index) => {
          return (
            <S.ItemList key={index}>
              <S.IconAndTitle>
                <img src="/img/dra-arrow-up.svg" alt="arrow up" />
                <p>{item.title}</p>
              </S.IconAndTitle>
              <small>{punctuateNumber(item.value)}</small>
            </S.ItemList>
          );
        })}
      </S.List>
    </S.Container>
  );
};
export default BudgetAllocation;

import React from "react";
import * as S from "./breadcrumb.style";

interface BreadcrumbItemProps {
  item: string;
  onItemClick: (item: string) => void;
}

export type BreadcrumbProps = {
  hierarchy: string[];
  separator?: string;
  onHierarchyChange?: (item: string) => void;
}

function BreadcrumbItem(props: BreadcrumbItemProps) {

  return <p onClick={() => props.onItemClick(props.item)}>{props.item}</p>

}

function Breadcrumb(props: BreadcrumbProps) {

  return (
    <S.Container className="breadcrumbs">
      {props.hierarchy.map((item: string, rowIndex: number) => {
        return (
          <React.Fragment key={rowIndex.toString()}>
            {rowIndex > 0 && <span>{props.separator}</span>}
            {props.hierarchy.length !== rowIndex + 1
              ? <p onClick={() => props.onHierarchyChange(item)}>{item}</p>
              // ? <p>{item}</p>
              : <p>{item}</p>
            }
          </React.Fragment>
        );
      })}
    </S.Container>
  );
};

Breadcrumb.defaultProps = {
  hierarchy: [],
  separator: ">",
  onHierarchyChange: console.log
}

export default Breadcrumb;

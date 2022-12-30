import React from "react";
// import "./Row.style.css";
import { classNames } from "../../utils";
import * as S from "./Row.style";

/* Prop definition */
type Props = {
  className?: string;
  children?: any;
  columns?: number;
  autoFlow?: boolean;
  minWidth?: number;
  maxWidth?: number;
};

/**
 * Custom layout to print a grid as row
 * @param children - nested jsx
 * @param columns - grid columns count
 * @param autoFlow - if you want grid auto arrenge items to use full width
 * @param minWidth - min item 'width' in rem if autoFlow
 * @param maxWidth - max item 'width' in rem if autoFlow
 * @returns Row Layout
 */
const RowLayout: React.FunctionComponent<Props & Record<string, any>> = ({
  className,
  children,
  columns = 4,
  autoFlow = false,
  minWidth = 10,
  maxWidth = 0,
  isFill = false,
  style = null,
  ...rest
}) => {
  const styleRow = autoFlow
    ? /* if auto flow apply this styles to auto arrange the grid */
    {
      gridTemplateColumns: `
        repeat(auto-${isFill ? "fill" : "fit"
        }, minmax(min(100%, ${minWidth}rem), ${maxWidth === 0 ? "1fr" : `${maxWidth}rem`
        }))`,
      ...style,
    }
    : /* Apply specific columns count */
    {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      ...style,
    };

  const props = {
    className: classNames("rows", className),
    style: styleRow,
  };

  return (
    <S.Container>
      <section {...props} {...rest}>
        {children}
      </section>
    </S.Container>
  );
};

export default React.memo(RowLayout);

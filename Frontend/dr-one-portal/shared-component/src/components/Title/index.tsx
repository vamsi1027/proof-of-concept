import { Link } from "react-router-dom";
import * as S from "./title.styles";
type Breadcrumb = {
  label: string;
  path?: string;
};
export type TitleProps = {
  title: string;
  breadcrumbs?: Breadcrumb[];
  extra?: JSX.Element;
};

function Title({ title, extra, breadcrumbs }: TitleProps) {
  return (
    <S.Container>
      <div>
        <S.Breadcrumbs>
          {!!breadcrumbs &&
            breadcrumbs.map((breadcrumb, key) => (
              <div key={key}>
                {!!breadcrumb.path ? (
                  <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
                ) : (
                  <label className={!key ? "" : "ml"}>{breadcrumb.label}</label>
                )}
                {breadcrumbs.length !== key + 1 ? " > " : null}
              </div>
            ))}
        </S.Breadcrumbs>
        <S.Content>{title}</S.Content>
      </div>
      {!!extra ? extra : null}
    </S.Container>
  );
}

export default Title;

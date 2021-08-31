import styled, { css } from "styled-components/macro";

export const AppGridColumnSizeSelector = styled.section`
  display: grid;
  grid-template-columns: ${({ colTemplate }) => colTemplate};
  grid-template-rows: 50px;
  column-gap: ${({ columnGap }) => `${columnGap}px`};
  row-gap: ${({ rowGap }) => `${rowGap}px`};
  div {
    text-align: center;
    position: relative;
  }
  ${({ widthfull }) =>
    widthfull &&
    css`
      width: 100%;
    `}
`;

export const AppGridRowSizeSelector = styled.section`
  grid-template-columns: 50px;
  grid-template-rows: ${({ rowTemplate }) => rowTemplate};
  column-gap: ${({ columnGap }) => `${columnGap}px`};
  row-gap: ${({ rowGap }) => `${rowGap}px`};
`;

export const Grid = styled.section`
  grid-template-columns: ${({ colTemplate }) => colTemplate};
  grid-template-rows: ${({ rowTemplate }) => rowTemplate};
  column-gap: ${({ columnGap }) => `${columnGap}px`};
  row-gap: ${({ rowGap }) => `${rowGap}px`};
`;

export const GridChildrenArea = styled.section`
  grid-template-columns: ${({ colTemplate }) => colTemplate};
  grid-template-rows: ${({ rowTemplate }) => rowTemplate};
  column-gap: ${({ columnGap }) => `${columnGap}px`};
  row-gap: ${({ rowGap }) => `${rowGap}px`};
`;

export const GridChildren = styled.div`
  grid-area: ${({ childArea }) => childArea};
`;

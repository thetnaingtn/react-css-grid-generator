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

export const StyledError = styled.div`
  position: absolute;
  bottom: -5px;
  border-radius: 4px;
  padding: 8px 12px;
  z-index: 1;
  font-weight: bold;
  width: 150px;
  min-height: 50px;
  background: #6d1a39;
`;

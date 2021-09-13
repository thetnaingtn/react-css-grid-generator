import styled, { css } from "styled-components/macro";

function generateGridChildStyle(max) {
  let color = 300 / max,
    divs = Array(max).fill(0);
  return divs
    .map((_, index) => {
      let idx = index + 1;
      return `div[class*="child"]:nth-child(${idx}){
      background: hsla(${(idx - 15) * (color * 1.5)}, 80%, 30%, 0.7);
      border: 1px solid #ddd;
    }`;
    })
    .join("");
}

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
  margin-left: -70px;
  float: left;
  height: 100%;
  display: grid;
  grid-template-columns: 50px;
  grid-template-rows: ${({ rowTemplate }) => rowTemplate};
  column-gap: ${({ columnGap }) => `${columnGap}px`};
  row-gap: ${({ rowGap }) => `${rowGap}px`};
  div {
    align-self: center;
    text-align: center;
    position: relative;
  }
`;

export const Grid = styled.section`
  width: 100%;
  height: 100%;
  position: absolute;
  display: grid;
  grid-auto-flow: row dense;
  grid-template-columns: ${({ colTemplate }) => colTemplate};
  grid-template-rows: ${({ rowTemplate }) => rowTemplate};
  column-gap: ${({ columnGap }) => `${columnGap}px`};
  row-gap: ${({ rowGap }) => `${rowGap}px`};

  div[class*="box"] {
    background-image: url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
    border: 1px dotted white;
    transition: 0.2s all ease;
    cursor: move;
    position: relative;
    z-index: 1000;
    opacity: 0.5;
  }
  p {
    padding: 0 10px;
  }
`;

export const GridChildrenArea = styled.section`
  width: 100%;
  height: 100%;
  position: absolute;
  display: grid;
  grid-auto-flow: row dense;
  ${generateGridChildStyle(20)}
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

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

export const AppGridMain = styled.main`
  width: calc(70vw - 50px);
  height: calc(70vh - 50px);
  margin: 15px 0 0 75px;
  @media screen and (max-width: 700px) {
    main {
      width: calc(80vw - 50px);
      height: calc(40vh - 50px);
    }
  }
`;

export const AppGridContainer = styled.div`
  border: 1px solid #08ffbd;
  width: 100%;
  height: 100%;
  z-index: 0;
  position: relative;
  background: #131321; /* Old browsers */
  background: -moz-linear-gradient(
    top,
    #131321 0%,
    #1f1c2c 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    #131321 0%,
    #1f1c2c 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    #131321 0%,
    #1f1c2c 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#131321', endColorstr='#1f1c2c',GradientType=0 ); /* IE6-9 */
  box-shadow: 0 2px 20px 0 #000;
`;

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

const GridStyles = styled.section`
  width: 100%;
  height: 100%;
  position: absolute;
  display: grid;
  grid-auto-flow: row dense;
`;

export const Grid = styled(GridStyles)`
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

export const GridChildrenArea = styled(GridStyles)`
  ${generateGridChildStyle(20)}
  counter-reset: step;
  div {
    counter-increment: step;
    position: relative;
    &:before {
      position: absolute;
      content: ".div" counter(step);
      display: block;
      padding: 0 5px;
      text-align: center;
      color: white;
    }
    button {
      position: absolute;
      right: 0;
      padding: 0 5px;
      margin: 0;
      color: white;
      background-color: transparent;
      border: none;
      z-index: 99999;
    }
  }
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

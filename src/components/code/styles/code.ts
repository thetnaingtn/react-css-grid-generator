import styled from "styled-components/macro";

export const Container = styled.div`
  margin-top: 30px;
`;

export const GridCode = styled.div`
  position: relative;
  background: #131321;
  background: -moz-linear-gradient(top, #131321 0%, #1f1c2c 100%);
  background: -webkit-linear-gradient(top, #131321 0%, #1f1c2c 100%);
  background: linear-gradient(to bottom, #131321 0%, #1f1c2c 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#131321', endColorstr='#1f1c2c',GradientType=0 ); /* IE6-9 */
  box-shadow: 0 2px 20px 0 #000;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid var(--teal);
  font-size: 15px;
  font-family: "Roboto Mono", Courier, monospace;
  max-height: 50vh;
  overflow-y: scroll;
  p {
    margin: 5px;
  }
`;

export const ButtonCopy = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  margin: 0;
  background: #0f8a8ab3;
  padding: 8px 12px;
  border-radius: 0 4px 0 4px;
  font-family: "Mukta Mahee", Helvetica, Arial, sans-serif;
  cursor: pointer;
`;

export const ButtonToggle = styled.button`
  position: absolute;
  right: 5px;
  bottom: 5px;
  font-family: "Mukta Mahee", Helvetica, Arial, sans-serif;
  cursor: pointer;
`;

export const CName = styled.span`
  color: #ffea18;
`;

export const CProps = styled.span`
  color: #f8a384;
`;

export const CKey = styled.span`
  color: #6af2d7;
`;

export const Sp = styled.span`
  padding-left: 20px;
`;

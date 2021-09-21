import React, { useContext, useState } from "react";
import styled from "styled-components/macro";

import { AppModal, AppExplain } from "../index";
import AppCodeContainer from "../../container/code";

import GridContext from "../../context/gridContext";
import FormContext from "../../context/formContext";

const StyledWat = styled.p`
  font-family: "Caveat", cursive;
  font-size: 22px;
  margin-top: 18px;
  color: #a8c9cc;
  opacity: 0.9;
  font-weight: normal;
  cursor: pointer;
`;

const StyledControlPanel = styled.aside`
  margin: 60px 60px;
  font-size: 17px;
  width: 300px;
  @media screen and (max-width: 700px) {
    width: 80vw;
    margin: 100px 50px;
  }
`;

export default function AppForm() {
  let {
    columns,
    setColumns,
    rows,
    setRows,
    rowGap,
    setRowGap,
    columnGap,
    setColumnGap,
  } = useContext(FormContext);
  let { setChildArea } = useContext(GridContext);

  let [explainModalStatus, setExplainModalStatus] = useState(false);
  let [codeModalStatus, setCodeModalStatus] = useState(false);
  return (
    <StyledControlPanel>
      <fieldset>
        <label htmlFor="columns">Columns</label>
        <input
          id="columns"
          type="number"
          min={0}
          max={12}
          value={columns}
          onChange={(event) => setColumns(event.target.value)}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="rows">Rows</label>
        <input
          id="rows"
          type="number"
          min={0}
          max={12}
          value={rows}
          onChange={(event) => setRows(event.target.value)}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="column-gap">Column Gap</label>
        <input
          id="column-gap"
          type="number"
          min={0}
          max={50}
          value={columnGap}
          onChange={(event) => setColumnGap(event.target.value)}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="row-gap">Row Gap</label>
        <input
          id="row-gap"
          type="number"
          min={0}
          max={50}
          value={rowGap}
          onChange={(event) => setRowGap(event.target.value)}
        />
      </fieldset>
      <button onClick={() => setCodeModalStatus(true)}>
        Please may I have some code
      </button>
      <button type="reset" onClick={() => setChildArea([])}>
        Reset Grid
      </button>
      <AppModal modalHandler={setCodeModalStatus} modalStatus={codeModalStatus}>
        <AppModal.Header>
          <h3>Your Grid Code</h3>
        </AppModal.Header>
        <AppModal.Section>
          <AppCodeContainer />
        </AppModal.Section>
      </AppModal>
      <StyledWat onClick={() => setExplainModalStatus(true)}>
        What does this project do?
      </StyledWat>
      <AppModal
        modalHandler={setExplainModalStatus}
        modalStatus={explainModalStatus}
      >
        <AppModal.Header>
          <h3>What is this?</h3>
        </AppModal.Header>
        <AppModal.Section>
          <AppExplain />
        </AppModal.Section>
      </AppModal>
    </StyledControlPanel>
  );
}

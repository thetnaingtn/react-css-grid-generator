import { useContext, useState } from "react";

import { AppModal, AppExplain } from "../index";
import AppCodeContainer from "../../container/code";

import GridContext from "../../context/gridContext";
import FormContext from "../../context/formContext";
import { Button, Input, Label, Fieldset } from "../ui";

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
    <aside className="m-[60px] text-[17px] w-[300px] max-tablet:w-[80vw] max-tablet:mx-[50px] max-tablet:my-[100px]">
      <Fieldset>
        <Label htmlFor="columns">Columns</Label>
        <Input
          id="columns"
          type="number"
          min={0}
          max={12}
          value={columns}
          onChange={(event) => setColumns(+event.target.value)}
        />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="rows">Rows</Label>
        <Input
          id="rows"
          type="number"
          min={0}
          max={12}
          value={rows}
          onChange={(event) => setRows(+event.target.value)}
        />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="column-gap">Column Gap</Label>
        <Input
          id="column-gap"
          type="number"
          min={0}
          max={50}
          value={columnGap}
          onChange={(event) => setColumnGap(+event.target.value)}
        />
      </Fieldset>
      <Fieldset>
        <Label htmlFor="row-gap">Row Gap</Label>
        <Input
          id="row-gap"
          type="number"
          min={0}
          max={50}
          value={rowGap}
          onChange={(event) => setRowGap(+event.target.value)}
        />
      </Fieldset>
      <Button onClick={() => setCodeModalStatus(true)}>
        Please may I have some code
      </Button>
      <Button
        variant="reset"
        type="reset"
        onClick={() => setChildArea([])}
      >
        Reset Grid
      </Button>
      <AppModal modalHandler={setCodeModalStatus} modalStatus={codeModalStatus}>
        <AppModal.Header>
          <h3>Your Grid Code</h3>
        </AppModal.Header>
        <AppModal.Section>
          <AppCodeContainer />
        </AppModal.Section>
      </AppModal>
      <p
        className="font-cursive text-[22px] mt-[18px] text-wat opacity-90 font-normal cursor-pointer"
        onClick={() => setExplainModalStatus(true)}
      >
        What does this project do?
      </p>
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
    </aside>
  );
}

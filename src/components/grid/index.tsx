import React, { useContext, useState, useEffect, FocusEvent } from "react";
import {
  AppGridMain,
  AppGridColumnSizeSelector,
  AppGridRowSizeSelector,
  Grid,
  GridChildren,
  GridChildrenArea,
  StyledError,
  AppGridContainer,
} from "./styles";

import validator from "../../utils/validatator";
import GridContext from "../../context/gridContext";
import FormContext from "../../context/formContext";

type ChildType = {
  erow: number;
  ecol: number;
  srow: number;
  scol: number;
};

export type ErrorType = {
  col: number[];
  row: number[];
};

export default function AppGrid() {
  let { rowGap, columnGap, columns } = useContext(FormContext);
  let {
    rowArr,
    colArr,
    setColArr,
    setRowArr,
    divNum,
    columnTemplate,
    rowTemplate,
    childArea,
    setChildArea,
  } = useContext(GridContext);
  let [errors, setErrors] = useState<ErrorType>({
    col: [],
    row: [],
  });
  let [child, setChild] = useState<ChildType>({} as ChildType);
  let [startEnd, setStartEnd] = useState<string | undefined>(undefined);

  const divs = Array<number>(divNum).fill(0);

  useEffect(() => {
    console.log(errors.col);
  }, [errors.col]);

  function colSizeChangeHandler(index: number) {
    return function (event: FocusEvent<HTMLInputElement>) {
      event.preventDefault();
      let unit = event.target.value;
      let columnErrors = validator(errors, unit, index, "col");
      if (columnErrors.col.length) {
        setErrors(columnErrors);
        return;
      }
      setColArr(
        colArr.map((i, idx) =>
          idx === index ? { unit: event.target.value } : i
        )
      );
    };
  }

  function rowSizeChangeHandler(index: number) {
    return function (event: FocusEvent<HTMLInputElement>) {
      event.preventDefault();
      let unit = event.target.value;
      let rowErrors = validator(errors, unit, index, "row");
      if (rowErrors.row.length) {
        setErrors(rowErrors);
        return;
      }
      setRowArr(
        rowArr.map((i, idx) =>
          idx === index ? { unit: event.target.value } : i
        )
      );
    };
  }

  function placeChild(item: number, startend: string) {
    setStartEnd(startend);
    let row = Math.ceil(item / columns);
    let column = item - (row - 1) * columns;
    setChild({ ...child, [`${startend}row`]: row, [`${startend}col`]: column });
  }

  function deleteChild(area: string) {
    let newArea = childArea.filter((c) => c !== area);
    setChildArea(newArea);
  }

  useEffect(() => {
    if (Object.values(child).length && startEnd === "e") {
      let [startrow, endrow] =
        child.srow <= child.erow
          ? [child.srow, child.erow]
          : [child.erow, child.srow];
      let [startcol, endcol] =
        child.scol <= child.ecol
          ? [child.scol, child.ecol]
          : [child.ecol, child.scol];
      let area = `${startrow} / ${startcol} / ${endrow + 1}/ ${endcol + 1}`;
      setChildArea([...childArea, area]);
    }
  }, [child]);

  return (
    <AppGridMain>
      <AppGridColumnSizeSelector
        rowGap={rowGap}
        columnGap={columnGap}
        colTemplate={columnTemplate}
        widthFull={columns > 8}
      >
        {colArr.map((col, index) => (
          <div key={index}>
            <input
              defaultValue={col.unit}
              type="text"
              onBlur={colSizeChangeHandler(index)}
            />
            {errors.col.indexOf(index) !== -1 ? (
              <StyledError>Must use real CSS unit.</StyledError>
            ) : null}
          </div>
        ))}
      </AppGridColumnSizeSelector>
      <AppGridRowSizeSelector
        rowTemplate={rowTemplate}
        rowGap={rowGap}
        columnGap={columnGap}
      >
        {rowArr.map((row, index) => (
          <div key={index}>
            <input
              defaultValue={row.unit}
              type="text"
              onBlur={rowSizeChangeHandler(index)}
            />
          </div>
        ))}
      </AppGridRowSizeSelector>
      <AppGridContainer>
        <Grid
          colTemplate={columnTemplate}
          rowTemplate={rowTemplate}
          rowGap={rowGap}
          columnGap={columnGap}
        >
          {divs.map((i, idx) => (
            <div
              onMouseUp={() => placeChild(idx + 1, "e")}
              onMouseDown={() => placeChild(idx + 1, "s")}
              className={`box${idx}`}
              key={idx}
            ></div>
          ))}
        </Grid>
        <GridChildrenArea
          colTemplate={columnTemplate}
          rowTemplate={rowTemplate}
          columnGap={columnGap}
          rowGap={rowGap}
        >
          {childArea.map((i, idx) => (
            <GridChildren childArea={i} className={`child${idx}`} key={idx}>
              <button onClick={() => deleteChild(i)}>&times;</button>
            </GridChildren>
          ))}
        </GridChildrenArea>
      </AppGridContainer>
    </AppGridMain>
  );
}

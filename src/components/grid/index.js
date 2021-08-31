import React, { useContext, useState, useEffect } from "react";
import {
  AppGridColumnSizeSelector,
  AppGridRowSizeSelector,
  Grid,
  GridChildren,
  GridChildrenArea,
} from "./styles";

import validator from "../../utils/validatator";
import GridContext from "../../context/gridContext";
import FormContext from "../../context/formContext";

import "../../assets/styles/app-grid.scss";

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
  let [errors, setErrors] = useState({ col: [], row: [] });
  let [child, setChild] = useState({});
  let [startEnd, setStartEnd] = useState(undefined);

  let divs = [];
  divs.length = divNum;
  divs = divs.fill(undefined);

  useEffect(() => {
    console.log(errors.col);
  }, [errors.col]);

  function colSizeChangeHandler(index, event) {
    event.preventDefault();
    let unit = event.target.value;
    let columnErrors = validator(errors, unit, index, "col");
    if (columnErrors.col.length) {
      console.log("here");
      setErrors(columnErrors);
      return;
    }
    setColArr(
      colArr.map((i, idx) => (idx === index ? { unit: event.target.value } : i))
    );
  }

  function rowSizeChangeHandler(index, event) {
    event.preventDefault();
    let unit = event.target.value;
    let rowErrors = validator(errors, unit, index, "row");
    if (rowErrors.row.length) {
      setErrors(rowErrors);
      return;
    }
    setRowArr(
      rowArr.map((i, idx) => (idx === index ? { unit: event.target.value } : i))
    );
  }

  function placeChild(item, startend) {
    setStartEnd(startend);
    let row = Math.ceil(item / columns);
    let column = item - (row - 1) * columns;
    setChild({ ...child, [`${startend}row`]: row, [`${startend}col`]: column });
  }

  function deleteChild(area) {
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
    <main>
      <AppGridColumnSizeSelector
        rowGap={rowGap}
        columnGap={columnGap}
        colTemplate={columnTemplate}
        widthfull={columns > 8}
      >
        {colArr.map((col, index) => (
          <div key={index}>
            <input
              defaultValue={col.unit}
              type="text"
              onBlur={(event) => colSizeChangeHandler(index, event)}
            />
            {errors.col.indexOf(index) !== -1 ? (
              <div className="errors">Must use real CSS unit.</div>
            ) : null}
          </div>
        ))}
      </AppGridColumnSizeSelector>
      <AppGridRowSizeSelector
        className="rowunits"
        rowTemplate={rowTemplate}
        rowGap={rowGap}
        columnGap={columnGap}
      >
        {rowArr.map((row, index) => (
          <div key={index}>
            <input
              defaultValue={row.unit}
              type="text"
              onBlur={(event) => rowSizeChangeHandler(index, event)}
            />
          </div>
        ))}
      </AppGridRowSizeSelector>
      <div id="gridcontainer">
        <Grid
          className="grid"
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
          className="grid gridchild"
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
      </div>
    </main>
  );
}

import { useContext, useState, useEffect, FocusEvent } from "react";

import validator from "../../utils/validatator";
import GridContext from "../../context/gridContext";
import FormContext from "../../context/formContext";
import { Input } from "../ui";

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

const BOX_BG_SVG =
  "url(\"data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E\")";

const CHILD_MAX = 20;
const CHILD_COLOR_STEP = 300 / CHILD_MAX;

function childBackground(index0: number) {
  const idx = index0 + 1;
  const hue = (idx - 15) * (CHILD_COLOR_STEP * 1.5);
  return `hsla(${hue}, 80%, 30%, 0.7)`;
}

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

  const gapStyle = {
    columnGap: `${columnGap}px`,
    rowGap: `${rowGap}px`,
  };

  return (
    <main className="w-[calc(70vw-50px)] h-[calc(70vh-50px)] mt-[15px] ml-[75px] max-tablet:w-[calc(80vw-50px)] max-tablet:h-[calc(40vh-50px)]">
      <section
        className={`grid ${columns > 8 ? "w-full" : ""}`}
        style={{
          gridTemplateColumns: columnTemplate,
          gridTemplateRows: "50px",
          ...gapStyle,
        }}
      >
        {colArr.map((col, index) => (
          <div className="text-center relative" key={index}>
            <Input
              defaultValue={col.unit}
              type="text"
              onBlur={colSizeChangeHandler(index)}
            />
            {errors.col.indexOf(index) !== -1 ? (
              <div className="absolute -bottom-[5px] rounded z-[1] font-bold w-[150px] min-h-[50px] bg-error-bg px-3 py-2">
                Must use real CSS unit.
              </div>
            ) : null}
          </div>
        ))}
      </section>
      <section
        className="-ml-[70px] float-left h-full grid"
        style={{
          gridTemplateColumns: "50px",
          gridTemplateRows: rowTemplate,
          ...gapStyle,
        }}
      >
        {rowArr.map((row, index) => (
          <div className="self-center text-center relative" key={index}>
            <Input
              defaultValue={row.unit}
              type="text"
              onBlur={rowSizeChangeHandler(index)}
            />
          </div>
        ))}
      </section>
      <div className="border border-teal w-full h-full z-0 relative bg-gradient-to-b from-panel-start to-panel-end shadow-[0_2px_20px_0_#000]">
        <section
          className="w-full h-full absolute inset-0 grid grid-flow-row-dense"
          style={{
            gridTemplateColumns: columnTemplate,
            gridTemplateRows: rowTemplate,
            ...gapStyle,
          }}
        >
          {divs.map((_i, idx) => (
            <div
              onMouseUp={() => placeChild(idx + 1, "e")}
              onMouseDown={() => placeChild(idx + 1, "s")}
              className={`box${idx} border border-dotted border-white transition-all duration-200 cursor-move relative z-[1000] opacity-50`}
              style={{ backgroundImage: BOX_BG_SVG }}
              key={idx}
            ></div>
          ))}
        </section>
        <section
          className="grid-children-area w-full h-full absolute inset-0 grid grid-flow-row-dense"
          style={{
            gridTemplateColumns: columnTemplate,
            gridTemplateRows: rowTemplate,
            ...gapStyle,
          }}
        >
          {childArea.map((i, idx) => (
            <div
              key={idx}
              className={`grid-child child${idx} relative border border-[#ddd]`}
              style={{
                gridArea: i,
                background: childBackground(idx),
              }}
            >
              <button
                onClick={() => deleteChild(i)}
                className="absolute right-0 px-[5px] py-0 m-0 text-white bg-transparent border-none z-[99999] cursor-pointer"
              >
                &times;
              </button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

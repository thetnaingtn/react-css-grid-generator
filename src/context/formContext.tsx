import React, { createContext, useState } from "react";

type FormContextTypes = {
  columns: number;
  setColumns: (val: number) => void;
  rows: number;
  setRows: (val: number) => void;
  columnGap: number;
  setColumnGap: (val: number) => void;
  rowGap: number;
  setRowGap: (val: number) => void;
};

const FormContext = createContext<FormContextTypes>({} as FormContextTypes);

export function FormProvider({ children }: React.PropsWithChildren<{}>) {
  let [columns, setColumns] = useState(5);
  let [rows, setRows] = useState(5);
  let [columnGap, setColumnGap] = useState(0);
  let [rowGap, setRowGap] = useState(0);

  let value = {
    columns,
    setColumns,
    rows,
    setRows,
    columnGap,
    setColumnGap,
    rowGap,
    setRowGap,
  };
  return (
    <FormContext.Provider value={{ ...value }}>{children}</FormContext.Provider>
  );
}

export default FormContext;

import React, {createContext, useState} from 'react';

const FormContext = createContext();

export default FormContext;
export function FormProvider({children}){
	let [columns, setColumns] = useState(5);
	let [rows, setRows] = useState(5);
	let [columnGap, setColumnGap] = useState(0);
	let [rowGap, setRowGap] = useState(0);

	let value = {columns, setColumns, rows, setRows, columnGap, setColumnGap, rowGap, setRowGap};
	return(
		<FormContext.Provider value={{...value}}>
			{children}
		</FormContext.Provider>
	)
}

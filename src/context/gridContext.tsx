import React, { createContext, useEffect, useState, useContext} from 'react';
import usePrevious from "../hooks/usePrevious";
import FormContext from "./formContext";

import {groupRepeatedUnits, createRepetition} from "../utils/repetition";

const GridContext = createContext();

function createArr(num, updater) {
    let arr = [];
    for (let i = 0; i < num; i++) {
        arr.push({unit:"1fr"});
    }
    updater(arr);
};

function adjustArr(oldValue, newValue, arr){
	let diff;
	if(newValue > oldValue) {
		diff = newValue - oldValue;
		for(let i=0; i<diff; i++){
			arr.push({unit:"1fr"});
		}
	}else{
		diff = oldValue - newValue;
		for(let i=0; i<diff; i++){
			arr.pop()
		}
	}
	return arr;
}

export default GridContext;

export function GridProvider({ children }) {

	let {columns, rows} = useContext(FormContext);

    let [colArr, setColArr] = useState([]);
    let [rowArr, setRowArr] = useState([]);
    let [columnTemplate, setColumnTemplate] = useState("");
    let [rowTemplate, setRowTemplate] = useState("");
    let [divNum, setDivNum] = useState(0);
    let [childArea, setChildArea] = useState([]);


    let {rows: previousRows, columns: previousColumns}= usePrevious({rows, columns});

	useEffect(() => {
        createArr(columns, setColArr);
        createArr(rows, setRowArr);
        setDivNum(columns * rows);
    }, []);

	useEffect(() => {
		const groupColumns = groupRepeatedUnits(colArr);
		const repeatedColumns = createRepetition(groupColumns);
		setColumnTemplate(repeatedColumns);
	}, [colArr]);

	useEffect(() => {
		const groupRows = groupRepeatedUnits(rowArr);
		const repeatedRows = createRepetition(groupRows);
		setRowTemplate(repeatedRows);
	}, [rowArr]);

	useEffect(() => {
		let arr = [...rowArr];
		setRowArr(adjustArr(previousRows, rows, arr));
		setDivNum(columns * rows);
	},[rows]);

	useEffect(() => {
		let arr = [...colArr];
		setColArr(adjustArr(previousColumns, columns, arr));
		setDivNum(columns * rows);
	}, [columns]);

    let value = {colArr, rowArr, setColArr, setRowArr, divNum, columnTemplate, rowTemplate, childArea, setChildArea};
    return (
        <>
            <GridContext.Provider value={{ ...value }}>
                {children}
            </GridContext.Provider>
        </>
    )
}

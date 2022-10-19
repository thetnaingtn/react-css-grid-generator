import React,{useRef, useEffect} from 'react';

// custom hook
export default function usePrevious(value){
	const ref = useRef({columns:0, rows:0});
	useEffect(()=>{
		ref.current = value;
	});
	return ref.current;
};

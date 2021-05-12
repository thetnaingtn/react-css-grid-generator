export default function validator(errors, unit, index, direction){
	let check =
		/fr$/.test(unit) ||
		/px$/.test(unit) ||
		/%$/.test(unit) ||
		/em$/.test(unit) ||
		/rem$/.test(unit) ||
		/vw$/.test(unit) ||
		/vh$/.test(unit) ||
		/vmin$/.test(unit) ||
		/q$/.test(unit) ||
		/mm$/.test(unit) ||
		/cm$/.test(unit) ||
		/in$/.test(unit) ||
		/pt$/.test(unit) ||
		/pc$/.test(unit) ||
		/ex$/.test(unit) ||
		/ch$/.test(unit) ||
		/minmax/.test(unit) ||
		["auto", "min-content", "max-content"].includes(unit) ||
		parseInt(unit, 10) === 0;
	if(!check){
		errors[direction].push(index);
	}else{
		errors[direction].splice(errors[direction].indexOf(index),1);
	}
	return errors;

}

import { GridUnitType } from "../context/gridContext";

function groupRepeatedUnits(templateUnits: GridUnitType[]): string[][] {
  let templateArr = templateUnits.map((item) => item.unit);
  let value = templateArr.shift();
  let groups: string[][];
  if (!value) groups = [[]];
  else groups = [[value]];

  for (const unit of templateArr) {
    let lastGroup = groups[groups.length - 1];
    if (lastGroup.indexOf(unit) !== -1) {
      lastGroup.push(unit);
    } else {
      groups.push([unit]);
    }
  }

  return groups;
}

function createRepetition(groups: string[][], maxRepetition = 1) {
  return groups
    .map((group) =>
      group.length === maxRepetition
        ? group.join(" ")
        : `repeat(${group.length}, ${group[0]})`
    )
    .join(" ");
}

export { groupRepeatedUnits, createRepetition };

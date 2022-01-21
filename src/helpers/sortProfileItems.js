export const sortProfileItems = (currentArray) => {
    const monthsArray = ["january","february","march","april","may","june","july","august","september","october","november","december"];
    let newArray = currentArray.filter(arrayItem => Object.keys(arrayItem).length > 1);
    let arrayPresent = newArray.filter(arrayItem => arrayItem.endMonth === "Present");
    let arrayRest = newArray.filter(arrayItem => arrayItem.endMonth !== "Present");
    
    newArray = arrayRest.map(arrayItem =>{
      const monthIndex = monthsArray.indexOf(arrayItem.endMonth);
      return {...arrayItem, date: new Date(arrayItem.endYear, monthIndex), monthIndex};
    })

    const orderedArray = newArray.sort((a, b) => b.date - a.date);
    let finalArray = [];

    arrayPresent =  arrayPresent.map(arrayItem =>{
      const monthIndex = monthsArray.indexOf(arrayItem.startMonth);
      return {...arrayItem, date: new Date(arrayItem.startYear, monthIndex), monthIndex};
    })

    arrayPresent = arrayPresent.sort((a, b) => b.date - a.date);

    for(let i = 0; i < arrayPresent.length; i++){
      finalArray = [...finalArray, arrayPresent[i]];
    }
    
    for(let i = 0; i < orderedArray.length; i++){
      finalArray = [...finalArray, orderedArray[i]];
    }

    return finalArray;
};

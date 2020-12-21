// export const parseFilter = (filter$: string[]) => {

//   // function to format the filter string
//   const mapped = filter$.map((element) => {
//       return `doc.${element}`;
//   })

//   return mapped.join('');
// }

export const parseFilter = (filters) => {

  const result: Array<string> = [];
  for (var key in filters) {
    const val = filters[key];
    if (typeof val === 'number') {
      result.push(`doc.${key} == ${filters[key]}`);
      continue;
    }
    if (typeof val === 'boolean') {
      result.push(`doc.${key} == ${filters[key]}`);
      continue;
    }

    result.push(`doc.${key} == "${filters[key]}"`);
  }

  const newFilters = result.join(" && ");
  return newFilters;
}
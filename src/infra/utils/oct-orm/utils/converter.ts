// export const parseFilter = (filter$: string[]) => {

//   // function to format the filter string
//   const mapped = filter$.map((element) => {
//       return `doc.${element}`;
//   })

//   return mapped.join('');
// }

export const parseFilter = (filters) => {

  for (var key in filters) {
    return `doc.${key} == "${filters[key]}"`;
  }
}
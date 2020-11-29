export const parseFilter = (filter$: string[]) => {

  // function to format the filter string
  const mapped = filter$.map((element) => {
      return `i.${element}`;
  })

  return mapped.join('');
}
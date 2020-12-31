export type AQLClauses = {
  for: string;
  filter? : string;
  sort? : string;
  limit? : {
    pageIndex : number;
    pageSize : number;
  };
  return : string;
}
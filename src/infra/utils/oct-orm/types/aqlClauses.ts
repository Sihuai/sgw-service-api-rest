export type AQLClauses = {
  for: string;
  filter? : string;
  sort? : string;
  limit ?: {
      offset : number;
      count : number;
  };
  return : string;
}
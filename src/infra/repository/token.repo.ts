export interface TokenRepo {
  select(filters);
  delete(filters);
}

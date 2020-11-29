export class Pagination {
  constructor() {
      this.total = 0;
      this.index = 0;
      this.records = new Records();
  }
  
  total: number;
  index: number;
  records: Records;
}

export class Records {
  constructor() {
      this.perPage = 0;
      this.offset = 0;
      this.total = 0;
  }
  
  perPage: number;
  offset: number;
  total: number;
}
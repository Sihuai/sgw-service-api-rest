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
      this.pageSize = 0;
      this.pageIndex = 0;
      this.total = 0;
  }
  
  pageSize: number;
  pageIndex: number;
  total: number;
}
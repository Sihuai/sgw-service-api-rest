import { Attribute } from "../../infra/utils/oct-orm";

export class Price {
  constructor() {
      this.value = 0.0;
      this.currency = '';
      this.taxable = false;
      // this.taxInPercentage = 0;
      // this.taxIncluded = false;
  }

  @Attribute()
  value: number;
  @Attribute()
  currency: string;
  @Attribute()
  taxable: boolean;
  @Attribute()
  taxInPercentage?: number;
  @Attribute()
  taxIncluded?: boolean;
}
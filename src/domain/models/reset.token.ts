import { Attribute } from "../../infra/utils/oct-orm";

export class ResetToken {
  constructor() {
      this.dateRequested = '';
      this.dateExpires = '';
      this.code = '';
      this.resolved = false;
  }

  @Attribute()
  dateRequested: string;
  @Attribute()
  dateExpires: string;
  @Attribute()
  code: string;
  @Attribute()
  resolved: boolean;
}
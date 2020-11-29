import { ResponseDataCode } from "../http/constants/response.data.code";

export class ResponseData {
  constructor() {
      this.code = -1;
      this.msg = '';
      this.data = '';
  }

  code: number;
  msg: string;
  data: string;
}

export const ResponseSuccess = (data: string) => {
  const result = {
    code: ResponseDataCode.OK,
    msg: '',
    data: data
  }
  return result;
};

export const ResponseFailure = (code: number, msg: string) => {
  const result = {
    code: code,
    msg: msg,
    data: ''
  }
  return result;
};
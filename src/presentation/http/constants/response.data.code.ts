import { APP_ERRORS } from "../../../app/errors/error.interface";
import { isEmptyObject } from "../../../infra/utils/data.validator";

export const ResponseDataCode = {
  ['OK']: 200,
  [APP_ERRORS.Forbidden]: 403,
  [APP_ERRORS.NotFound]: 404,
  [APP_ERRORS.InternalServerError]: 500,

  [APP_ERRORS.AlreadyExists]: 600,
  [APP_ERRORS.InvalidToken]: 601,
  [APP_ERRORS.Unexpected]: 602,
  [APP_ERRORS.ValidationError]: 603,
  [APP_ERRORS.NotAuthorized]: 604,
  [APP_ERRORS.EntityNotFound]: 605,
  [APP_ERRORS.TokenTimeOut]: 606,
};

export const getResponseDataCode = (name: string) => {
  const result = ResponseDataCode[name];

  if (isEmptyObject(result) == true) return ResponseDataCode.Unexpected;
  return result;
};
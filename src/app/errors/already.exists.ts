import {  APP_ERRORS, AppErrorAbstract } from './error.interface';

export class AppErrorAlreadyExist extends AppErrorAbstract {
  name = APP_ERRORS.AlreadyExists;
  message = 'Key already exists';

  constructor(public error) {
    super();
  }
}

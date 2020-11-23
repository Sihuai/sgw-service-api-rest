import {  APP_ERRORS, AppErrorAbstract } from './error.interface';

export class AppErrorUserAlreadyExist extends AppErrorAbstract {
  name = APP_ERRORS.UserAlreadyExists;
  message = 'User with such slug already exists';

  constructor(public error) {
    super();
  }
}

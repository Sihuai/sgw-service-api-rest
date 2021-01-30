import { Request } from "express";

export type ExpressRequest = Request & {
  file?: any
};
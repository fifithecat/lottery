import _ from 'lodash';
import { Model } from 'objection';

export function isJsonValid(input: any) {
  try {
    if (Object.keys(input).length === 0) return false;
    return true;
  } catch (error) {
    return false;
  }
}

export class DatabaseError extends Error {
  statusCode: number;
  constructor(message: any) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 400;
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class ValidationError extends Error {
  statusCode: number;
  constructor(message: any) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export function generalError(errorMsg:string) {
  return {Error: errorMsg};
}
export type keyValObjArray = {[key: string]: string | number}[];

export function generateFixedLengthInt(n: number) {
  const randomNum = [...Array(n)].map(_=>Math.random()*10|0).join(``);
  return randomNum;
}

export function validateWithJsonSchema(input: any, model: typeof Model):keyValObjArray {
  if (!isJsonValid(input)) {
    throw new ValidationError(JSON.stringify(generalError('Accept JSON only')));
  }
  const validationResult:keyValObjArray = [];
  try {
    model.fromJson(input);
  } catch (error: any) {
    for (const [key, value ] of Object.entries<{[key: string]: string}[]>(error.data)) {
      const errorMsg = _.map(value, 'message');
      const errorMsgStr:string = errorMsg.toString();
      validationResult.push({key, errorMsgStr});
    }
  }

  return validationResult;
}

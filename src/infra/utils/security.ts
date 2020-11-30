import { APP_ERRORS } from "../../app/errors/error.interface";
import { isEmptyObject } from "./data.validator";

// function to generate a random verification code
export const createVerificationCode = async () => {
  const codeCharacters = Array.from('ABCD012389abzEFGH4567vwxyJKLMcdefNPQRrstuWXYZmnpqSTUVghjk');
  const fillers = Array.from('********');

  const otp = fillers.map((char) => {
    char = codeCharacters[Math.abs(Math.floor(Math.random() * 100) - 56)];
    return char;
  })

  return otp.join('');
}

export const generateToken = (params) => {
  try{
    var jwt = require('jsonwebtoken');
    // exceptions handling.
    if(isEmptyObject(params.expiresIn) == true) return jwt.sign(params.content, params.key);
    // expiresIn is not empty.
    return jwt.sign(params.content, params.key, {expiresIn: params.expiresIn});
  }catch(err){
    throw err;
  }
}

export const getTokenFromAuthHeaders = (header: string): string | undefined => {
  if (!header) return undefined;
  return header.split(' ')[1];
};

export const getUserFromToken = (token): any => {
  const newError = new Error();
  if( token === null) {
    newError.name = APP_ERRORS.NotAuthorized;
    newError.message = 'Not Authorized to Access.';
    throw newError;
  }

  var jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) =>{
      if(error) { // exceptions handling
        if(error.name === 'JsonWebTokenError' && error.message === 'invalid token') {
          newError.name = APP_ERRORS.InvalidToken;
          newError.message = 'Invalid Token.  Access Forbidden by API service.';
          throw newError;
        }
        newError.name = APP_ERRORS.InvalidToken;
        newError.message = 'Access Forbidden by API servcie.';
        throw newError;
      }

      const { iat, exp, ...user } = decoded; 
      return user;
  })
};
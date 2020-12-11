import { Token } from '../../../domain/models/token';
import { User } from '../../../domain/models/user';
import { TokenService } from '../token.service';
import { AbstractBaseService } from './base.service.impl';
import { generateToken } from '../../../infra/utils/security';
import { IOC_TYPE } from '../../../config/type';
import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { TokenRepo } from '../../../infra/repository/token.repo';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { isEmptyObject } from '../../../infra/utils/data.validator';

@provide(IOC_TYPE.TokenServiceImpl)
export class TokenServiceImpl extends AbstractBaseService<Token> implements TokenService {
  constructor(
    @inject(IOC_TYPE.TokenRepoImpl) private tokenRepo: TokenRepo,
  ) {
    super();
  }

  async findAll(filters) : Promise<Token[]> {
    return await this.tokenRepo.selectAllBy(filters);
  }

  async findOneBy(filters) : Promise<Token> {
    return await this.tokenRepo.selectOneBy(filters);
  }

  async refresh(filters) : Promise<any> {
    try {
      const result = await this.findOneBy(filters);
      if (result == null) return -1; // Token is not existed!

      var jwt = require('jsonwebtoken');
      const newToken = jwt.verify(result.token, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
        if(error) { // exceptions handling
          if(error.name === 'JsonWebTokenError' && error.message === 'invalid token') return -2; // Invalid Token.  Access Forbidden by API service.
          return -3; // Access Forbidden by API servcie.
        }
  
        const input = {
            content : {username: decoded.username, email: decoded.email, isActive: decoded.isActive, role: decoded.role, nick: decoded.nick},
            key: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        }
        return generateToken(input);
      })

      result.token = newToken;
      return result;
    } catch(e) {
      throw e;
    }
  }

  async addOne(model: User): Promise<any> {
    try {
      // Generate new token for this email and store.
      const input = {
          content : {username: model.userName, email: model.email, isActive: model.isActive, role: model.role, nick: model.nick},
          key: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
      const tokenAccess = generateToken(input);

      const inputRefresh = {
        content: {username: model.userName, email: model.email, isActive: model.isActive, role: model.role, nick: model.nick},
        key: process.env.REFRESH_TOKEN_SECRET
      }
      const tokenRefresh = generateToken(inputRefresh);

      const newToken = new Token();
      newToken.email = model.email;
      newToken.token = tokenRefresh;

      const result = await this.tokenRepo.insert(newToken);
      if (!result) return -11; // Fail to distribute token.

      return {access: tokenAccess, refresh: tokenRefresh};
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) {
        throw new AppErrorAlreadyExist(e);
      }
      throw e;
    }
  }

  async removeOne(model: Token): Promise<any> {
    try {
      const filters = {email: model.email, token: model.token};
      const results = await this.findOneBy(filters);
      if (isEmptyObject(results) == true) return -10; // No this data in Token.
  
      return await this.tokenRepo.deleteByKey(results._key);
    } catch (e) {
      throw e;
    }
  }

  async removeAll(model: Token): Promise<any> {
    try {
      const filters = [`email == '${model.email}'`];
      const results = await this.findAll(filters);
      if (isEmptyObject(results) == true) return -10; // No this data in Token.
  
      const keys = new Array(results.length);
      for (var i = 0; i < results.length; i++)
      {
        keys[i] = results[i]._key;
      }

      return await this.tokenRepo.deleteByKeys(keys);
    } catch (e) {
      throw e;
    }
  }
}
import { Token, Tokens } from '../../../domain/models/token';
import { User } from '../../../domain/models/user';
import { AppErrorUnexpected } from '../../errors/unexpected';
import { AppErrorUserAlreadyExist } from '../../errors/user';
import { TokenService } from '../token.service';
import { AbstractBaseService } from './base.service.impl';
import { jwt }  from 'jsonwebtoken';
import { generateToken } from '../../../infra/utils/security';
import { IOC_TYPE } from '../../../config/type';
import { provide } from 'inversify-binding-decorators';

@provide(IOC_TYPE.TokenServiceImpl)
export class TokenServiceImpl extends AbstractBaseService<Token> implements TokenService {
    async find(model: User) : Promise<Token> {
      const token = Tokens.select({email:model.email});

      const newToken = jwt.verify(token.token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if(err == true) return null;

          const input = {
              content : {username: user.username, email: user.email, isActive: user.isActive, role: user.role, nick: user.nick},
              key: process.env.ACCESS_TOKEN_SECRET,
              expiresIn: '60s'
          }
          return generateToken(input);
      })

      token.token = newToken;
      return token;
    }

    async add(model: User): Promise<Token> {
      try {
        // 1. Clean all this email's token in Token table.
        await this.remove({email:model.email});

        // 2. Generate new token for this email and store.
        const input = {
            content : {username: model.username, email: model.email, isActive: model.isActive, role: model.role, nick: model.nick},
            key: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        }
        const token = generateToken(input);

        const newToken = new Token();
        newToken.email = model.email;
        newToken.token = token;

        return await this.save(newToken);
      } catch (e) {
        throw new AppErrorUnexpected(e);
      }
    }

    async save(model: Token): Promise<Token> {
      try {
        if (model._key != ''){
          return await this.edit(model);
        } else {
          return await this.add(model);
        }
      } catch(e) {
        throw new AppErrorUnexpected(e);
      }
    }

    async remove(filters): Promise<void> {
      Tokens.delete(filters);
    }
}

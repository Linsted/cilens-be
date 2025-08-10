import { User } from 'src/core/domain/user/user.entity';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}

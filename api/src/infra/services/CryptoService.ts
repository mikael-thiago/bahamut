import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import CryptoService from 'src/core/services/CryptoService';

export class CryptoServiceImpl implements CryptoService {
  private algorithm = 'aes-256-cbc';
  private Securitykey = crypto.randomBytes(32);
  private initVector = crypto.randomBytes(16);

  // TODO: Extract to configuration
  private saltRounds = 10;

  encode(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);

    // const cipher = crypto.createCipheriv(this.algorithm, this.Securitykey, this.initVector);

    // return cipher.update(value, 'utf-8', 'hex') + cipher.final('hex');
  }

  verify(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }

  // decode(value: string): string {
  //   console.log('DECRYPTING', value);

  //   const decipher = crypto.createDecipheriv(this.algorithm, this.Securitykey, null);

  //   return decipher.update(value, 'hex', 'utf-8') + decipher.final('utf-8');
  // }
}

import bcrypt from 'bcrypt';

export default class AdminPasswordAuth {
  static createHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static verifyHash(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}

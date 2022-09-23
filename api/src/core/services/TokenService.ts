export abstract class TokenService {
  abstract encode(payload: string | object): string;
}

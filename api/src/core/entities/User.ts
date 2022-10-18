import { Operation } from './Operation';

export type UserKeyType = string;

export interface UserProps {
  email: string;
  password: string;
  name?: string;
  operations?: Operation[];
}

const alignUserPropertiesEnumerability = (user: User) => {
  Object.defineProperty(user, 'id', { get: () => user['_id'], enumerable: true });
  Object.defineProperty(user, 'email', { get: () => user['_props'].email, enumerable: true });
  Object.defineProperty(user, 'password', { get: () => user['_props'].password, enumerable: true });
  Object.defineProperty(user, 'name', { get: () => user['_props'].name, enumerable: true });
  Object.defineProperty(user, 'operations', { get: () => user['_props'].operations ?? [], enumerable: true });
  Object.defineProperty(user, '_props', { enumerable: false });
  Object.defineProperty(user, '_id', { enumerable: false });
};

export class User {
  private _id: string;

  constructor(private _props: UserProps, id?: string) {
    this._id = id ?? crypto.randomUUID();

    alignUserPropertiesEnumerability(this);
  }

  get id(): UserKeyType {
    return this._id;
  }

  get email(): string {
    return this._props.email;
  }

  get password(): string {
    return this._props.password;
  }

  get name(): string | undefined {
    return this._props.name;
  }

  get operations(): Operation[] {
    return this._props.operations ?? [];
  }
}

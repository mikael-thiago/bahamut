import { UserKeyType } from './User';

export type OperationKeyType = string;

export enum OperationType {
  Buying = 1,
  Selling = 2,
}

export interface OperationProps {
  assetCode: string;
  quantity: number;
  valuePerAsset: number;
  date: Date;
  type: OperationType;
  userId: UserKeyType;
}

const alignOperationPropertiesEnumerability = (operation: Operation) => {
  Object.defineProperty(operation, 'id', { get: () => operation['_id'], enumerable: true });
  Object.defineProperty(operation, 'assetCode', { get: () => operation['_props'].assetCode, enumerable: true });
  Object.defineProperty(operation, 'date', { get: () => operation['_props'].date, enumerable: true });
  Object.defineProperty(operation, 'quantity', { get: () => operation['_props'].quantity, enumerable: true });
  Object.defineProperty(operation, 'type', { get: () => operation['_props'].type, enumerable: true });
  Object.defineProperty(operation, 'userId', { get: () => operation['_props'].userId, enumerable: true });
  Object.defineProperty(operation, 'valuePerAsset', { get: () => operation['_props'].valuePerAsset, enumerable: true });
  Object.defineProperty(operation, '_props', { enumerable: false });
  Object.defineProperty(operation, '_id', { enumerable: false });
};

export class Operation {
  private _id: OperationKeyType;

  constructor(private _props: OperationProps, id?: OperationKeyType) {
    this._id = id ?? crypto.randomUUID();

    alignOperationPropertiesEnumerability(this);
  }

  get id(): OperationKeyType {
    return this._id;
  }

  get assetCode(): string {
    return this._props.assetCode;
  }

  get quantity(): number {
    return this._props.quantity;
  }

  get valuePerAsset(): number {
    return this._props.valuePerAsset;
  }

  get date(): Date {
    return this._props.date;
  }

  get type(): OperationType {
    return this._props.type;
  }

  get isBuying(): boolean {
    return this._props.type === OperationType.Buying;
  }

  get isSelling(): boolean {
    return this._props.type === OperationType.Selling;
  }

  get userId(): UserKeyType {
    return this._props.userId;
  }

  update(props: Partial<OperationProps>): void {
    this._props = { ...this._props, ...props };
  }

  toString() {
    return JSON.stringify(this._props);
  }
}

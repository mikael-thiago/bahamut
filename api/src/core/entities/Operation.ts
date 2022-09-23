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

export class Operation {
  private _id: OperationKeyType;

  constructor(private _props: OperationProps, id?: OperationKeyType) {
    this._id = id ?? crypto.randomUUID();
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

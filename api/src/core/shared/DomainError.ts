export abstract class DomainError {
  constructor(public readonly message: string) {}
}

export abstract class EntityNotFoundError<KeyType> extends DomainError {
  constructor({ entityName, ids }: { entityName: string; ids: KeyType[] }) {
    super(`${entityName} not found for ids ${ids.join(',')}`);
  }
}

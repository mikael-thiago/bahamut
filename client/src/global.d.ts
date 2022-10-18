declare global {
  type DeepNullable<T> = T extends Array<infer M>
    ? Array<DeepNullable<M>>
    : T extends Date
    ? T
    : T extends object
    ? {
        [P in keyof T]: DeepNullable<T[P]> | null;
      }
    : T;
}

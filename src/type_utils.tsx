// eslint-disable-next-line @typescript-eslint/naming-convention
export type Brand<Type, Name extends string> = Type & {__brand: Name};

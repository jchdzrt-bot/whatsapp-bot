type Loosen<T> = { [K in keyof T]: T[K] | undefined };

type NullOrUndefined = null | undefined;
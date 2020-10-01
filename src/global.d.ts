declare type Nullable<A> = A | null;

declare interface ActionWithPayload {
  type: string;
  payload?: any;
}

declare type ConstructableTarget = new (...args: any[]) => any;
declare type ValueOf<T> = T[keyof T];

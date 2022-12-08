
// создал тип с обязательным type среди возвращаемых ключей для actions
export type ActionsAnyType = Record<string, ( ...args: any[] ) => { type: string, [key: string]: any }>
// комбайним все значения объекта
export type PropertiesType<T> = T extends { [key: string]: infer U } ? U : never;
// возвращаем комбайн возвращаемых значений, также extends-ом проверяем, является ли он типом ActionsAnyType
// также удаляем вcе undefined и null
export type GetActionsTypes<T extends ActionsAnyType> = NonNullable<ReturnType<PropertiesType<T>>>

// только одно поле из объекта, но не меньше одного
export type ExactlyOne<T, TKey = keyof T> = TKey extends keyof T
  ? { [key in Exclude<keyof T, TKey>]?: never } & { [key in TKey]: T[key] }
  : never;

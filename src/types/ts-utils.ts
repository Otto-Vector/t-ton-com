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


// перечисляет все ключи, включая нижние уровни
// export type NestedKeyOf<ObjectType extends object> =
//     {
//         [Key in keyof ObjectType & ( string | number )]: ObjectType[Key] extends object
//         ? `${ Key }` | `${ Key }.${ NestedKeyOf<ObjectType[Key]> }`
//         : `${ Key }`
//     }[keyof ObjectType & ( string | number )];

// ключи определённого типа
export type KeysOfType<O, T> = {
    [K in keyof O]: O[K] extends T ? K : never
}[keyof O]

// все ключи НЕ ЭТОГО типа
export type KeysOfNotThisType<O, T> = {
    [K in keyof O]: O[K] extends T ? K : never
}[keyof O]

type Level = 0 | 1 | 2 | 3 | 4 | 5 | 'max'; // this solves the infinite loop error issue
type NextLevel<Level> =
    Level extends 0 ? 1
        : Level extends 1 ? 2
            : Level extends 2 ? 3
                : Level extends 3 ? 4
                    : Level extends 4 ? 5
                        : 'max'; // this type enables iterating from 0 to 5, with the end as 'max'

// забирает ключи до определённого уровня без вложенности
export type NestedKeyofPlaneType<T, L extends Level = 0> = L extends 2 ? {
    [K in keyof T]: T[K] extends object ? K | NestedKeyofPlaneType<T[K], NextLevel<L>> : K
}[keyof T] : never

// все ключи объекта (кроме типов "объект" в определённый тип (по умолчанию "строка")
export type AllNestedKeysToType<ObjectType, T = string> = ObjectType extends object
    ? { [KEY in keyof ObjectType]-?: AllNestedKeysToType<ObjectType[KEY], T> } : T
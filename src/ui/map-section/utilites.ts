import { EmployeeStatusType } from "../../types/form-types";

// цвет в зависимости от статуса
export const colorOfStatus = ( stat: EmployeeStatusType ): string =>
    stat === 'свободен'
        ? 'red'
        : stat === 'на заявке'
            ? 'green'
            : 'orange'

import {InfoResponseType, instanceBack} from '../back-instance.api';


export type EmployeesApiType = {
    idUser: string
    idEmployee: string
    employeeFIO: string
    employeePhoneNumber: string
    passportSerial: string
    passportFMS: string
    passportDate: string
    drivingLicenseNumber: string
    drivingCategory: string
    personnelNumber: string
    garageNumber: string
    photoFace: string
    rating: string
    coordinates: string
    status: string
    idTransport: string
    idTrailer: string
}

export type CreateEmployeesApiType = Omit<EmployeesApiType, 'idEmployee'>


export const employeesApi = {

    // запрос списка всех водителей
    getAllEmployees() {
        return instanceBack.get<EmployeesApiType[]>('/api/emploee/')
            .then(response => response.data)
    },
    // запрос на одного выбранного водителя
    getOneEmployeeById( { idEmployee }: { idEmployee: string } ) {
        return instanceBack.patch<InfoResponseType | EmployeesApiType[]>('/api/emploee/', { idEmployee })
            .then(response => response.data)
    },
    // создать одного водителя
    createOneEmployee( requestData: CreateEmployeesApiType ) {
        return instanceBack.post<InfoResponseType>('/api/emploee/', { ...requestData })
            .then(response => response.data)
    },
    // ИЗМЕНИТЬ одного водителя
    modifyOneEmployee( requestData: EmployeesApiType ) {
        return instanceBack.put<InfoResponseType>('/api/emploee/', { ...requestData })
            .then(response => response.data)
    },
    // УДАЛИТЬ одного водителя
    deleteOneEmployee( { idEmployee }: { idEmployee: string } ) {
        return instanceBack.put<InfoResponseType>('/api/emploee/', { idEmployee })
            .then(response => response.data)
    },
}


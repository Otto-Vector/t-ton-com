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


export const employeesApi = {

    // запрос списка всех водителей
    getAllEmployees() {
        return instanceBack.get<EmployeesApiType[]>('/api/employee/')
            .then(response => response.data)
    },
    // запрос списка всех водителей созданных данным пользователем
    getAllEmployeesByUserId( idUser: { idUser: string } ) {
        return instanceBack.patch<EmployeesApiType[]>('/api/emploeeuser/', { ...idUser })
            .then(response => response.data)
    },
    // запрос на одного выбранного водителя
    getOneEmployeeById( { idEmployee }: { idEmployee: string } ) {
        return instanceBack.patch<InfoResponseType | EmployeesApiType[]>('/api/employee/', { idEmployee })
            .then(response => response.data)
    },
    // создать одного водителя
    createOneEmployee( { idEmployee, photoFace, ...requestData }: EmployeesApiType, image: File | undefined ) {
        let formData = new FormData()
        for (let [ key, value ] of Object.entries(requestData)) {
            formData.append(key, value)
        }
        if (image) {
            formData.append('photoFace', image, 'employeeImage.jpg')
        }
        return instanceBack.post<InfoResponseType>('/api/employee/', formData)
            .then(response => response.data)
    },
    // ИЗМЕНИТЬ одного водителя
    modifyOneEmployee( { photoFace, ...requestData }: EmployeesApiType, image: File | undefined ) {
        let formData = new FormData()
        for (let [ key, value ] of Object.entries(requestData)) {
            formData.append(key, value)
        }
        if (image) {
            formData.append('photoFace', image, 'employeeImage.jpg')
        }
        return instanceBack.put<InfoResponseType>('/api/employee/', formData)
            .then(response => response.data)
    },
    // УДАЛИТЬ одного водителя
    deleteOneEmployee( { idEmployee }: { idEmployee: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/employee/', { data: { idEmployee } })
            .then(response => response.data)
    },
}


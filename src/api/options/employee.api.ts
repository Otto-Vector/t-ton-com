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
    createOneEmployee( {idEmployee,...requestData}: EmployeesApiType, image: File | undefined ) {
        let formData = new FormData()
        formData.append('idUser', requestData.idUser)
        formData.append('employeeFIO', requestData.employeeFIO)
        formData.append('employeePhoneNumber', requestData.employeePhoneNumber)
        formData.append('passportSerial', requestData.passportSerial)
        formData.append('passportFMS', requestData.passportFMS)
        formData.append('passportDate', requestData.passportDate)
        formData.append('drivingLicenseNumber', requestData.drivingLicenseNumber)
        formData.append('drivingCategory', requestData.drivingCategory)
        formData.append('personnelNumber', requestData.personnelNumber)
        formData.append('garageNumber', requestData.garageNumber)
        formData.append('idTransport', requestData.idTransport)
        formData.append('idTrailer', requestData.idTrailer)

        if (image) {
            formData.append('photoFace', image, 'employeeImage.jpg')
        }
        return instanceBack.post<InfoResponseType>('/api/employee/', formData)
            .then(response => response.data)
    },
    // ИЗМЕНИТЬ одного водителя
    modifyOneEmployee( requestData: EmployeesApiType, image: File | undefined ) {
        let formData = new FormData()
        formData.append('idUser', requestData.idUser)
        formData.append('idEmployee', requestData.idEmployee)
        formData.append('employeeFIO', requestData.employeeFIO)
        formData.append('employeePhoneNumber', requestData.employeePhoneNumber)
        formData.append('passportSerial', requestData.passportSerial)
        formData.append('passportFMS', requestData.passportFMS)
        formData.append('passportDate', requestData.passportDate)
        formData.append('drivingLicenseNumber', requestData.drivingLicenseNumber)
        formData.append('drivingCategory', requestData.drivingCategory)
        formData.append('personnelNumber', requestData.personnelNumber)
        formData.append('garageNumber', requestData.garageNumber)
        formData.append('idTransport', requestData.idTransport)
        formData.append('idTrailer', requestData.idTrailer)

        if (image) {
            formData.append('photoFace', image, 'employeeImage.jpg')
        }

        return instanceBack.put<InfoResponseType>('/api/employee/', { ...requestData })
            .then(response => response.data)
    },
    // УДАЛИТЬ одного водителя
    deleteOneEmployee( { idEmployee }: { idEmployee: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/employee/', { data: { idEmployee } })
            .then(response => response.data)
    },
}


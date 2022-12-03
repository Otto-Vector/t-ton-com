import {EmployeesApiType} from '../../../types/form-types';
import {InfoResponseType, instanceBack} from '../back-instance.api';


export const employeesApi = {

    // запрос списка ВСЕХ водителей сервера GET /api/employee/
    getAllEmployees() {
        return instanceBack.get<EmployeesApiType[]>('/api/employee/')
            .then(response => response.data)
        // 1.	Code 200, Models: EmployeesApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // запрос списка всех водителей созданных данным пользователем PATCH /api/emploeeuser/
    getAllEmployeesByUserId( { idUser }: { idUser: string } ) {
        return instanceBack.patch<InfoResponseType & EmployeesApiType[]>('/api/emploeeuser/', { idUser })
            .then(response => response.data)
        // 1.	Code 200, Models: EmployeesApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // запрос на одного выбранного водителя PATCH /api/employee/
    getOneEmployeeById( { idEmployee }: { idEmployee: string } ) {
        return instanceBack.patch<InfoResponseType & EmployeesApiType[]>('/api/employee/', { idEmployee })
            .then(response => response.data)
        // 1.	Code 200, Models: EmployeesApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // создать одного водителя POST /api/employee/
    createOneEmployee( { idEmployee, photoFace, ...requestData }: EmployeesApiType, image: File | undefined ) {
        const formData = new FormData()
        Object.entries(requestData).map(( [ key, value ] ) => formData.append(key, value))
        if (image) {
            formData.append('photoFace', image, 'employeeImage.jpg')
        }
        return instanceBack.post<InfoResponseType>('/api/employee/', formData)
            .then(response => response.data)
        // 1.	Code 422, {'failed':'Сотрудник уже создан'}
        // 2.	Code 200, {"success": "Employees '{}' created successfully".format(new_Employee.idEmployee)}
        // 3.	Code 520, {"message":"Error"}
    },

    // ИЗМЕНИТЬ одного водителя PUT /api/employee/
    modifyOneEmployee( { photoFace, ...requestData }: EmployeesApiType, image: File | undefined ) {
        let formData = new FormData()
        Object.entries(requestData).map(( [ key, value ] ) => formData.append(key, value))
        if (image) {
            formData.append('photoFace', image, 'employeeImage.jpg')
        }
        return instanceBack.put<InfoResponseType>('/api/employee/', formData)
            .then(response => response.data)
        // 1.	Code 449, {'failed': "Employee is not updated"}
        // 2.	Code 200, "success": "Employee'{}' updated successfully".format(Employee_saved.idEmployee)
    },

    // УДАЛИТЬ одного водителя DELETE /api/employee/
    deleteOneEmployee( { idEmployee }: { idEmployee: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/employee/', { data: { idEmployee } })
            .then(response => response.data)
        // 1.	Code 200, {"message": "Employee with id `{}` has been deleted.".format(request.data['idEmployee']}
        // 2.	Code 449, {'error':'Неправильно указаны аргументы'}
    },

    // ДОБАВИТЬ ДАННЫЕ о привязке к ответу на заявку PUT /api/employeeupgrade/
    addResponseToRequestToEmployee( data: { idEmployee: string, addedToResponse: string } ) {
        return instanceBack.put<InfoResponseType>('/api/employeeupgrade/', data)
            .then(response => response.data)
        // 1.	Code 200, {'message': 'Error, login please'}
        // 2.	Code 200, {'success': 'В поле addedToResponse для водителя '+request.data['idEmployee']+' добалено значение'}
        // 3.	Code 520, {"message":"Error"}
    },

    // УДАЛИТЬ ДАННЫЕ о привязке к ответу на заявку DELETE /api/employeeupgrade/
    removeResponseToRequestFromEmployee( data: { idEmployee: string, addedToResponse: string | 'all' } ) {
        return instanceBack.delete<InfoResponseType>('/api/employeeupgrade/', { data })
            .then(response => response.data)
        // 1.	Code 200, {'message': 'Error, login please'}
        // 2.	Code 200 {'success': 'Из поля addedToResponse для водителя '+request.data['idEmployee']+' удалены все значения'}
        // 3.	Code 200 {'success': 'Из поля addedToResponse для водителя '+request.data['idEmployee']+' удалено значение'}
        // 4.	Code 520, {"message":"Error"}
    },

}
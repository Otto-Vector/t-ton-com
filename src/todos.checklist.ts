
/* СТАТИЧЕСКИ ПОДГРУЖАЕМЫЕ ДАННЫЕ ИЗ БЭКА
1. const cargoFormats = [ 'Бензовоз', 'Битумовоз', 'Газовоз', 'Изотерм', 'Контейнеровоз', 'Лесовоз', 'Самосвал', 'Тягач', 'Фургон, Борт', 'Цементовоз' ]
2. const propertyRights = [ 'Собственность', 'Аренда', 'Лизинг' ]
3. КЛЮЧИ API
    - яндекс
    - dadata
    - autodispetcher
4. Ссылки на панель справа (в формате
5. ИНФОРМАЦИОННО-АНАЛИТИЧЕСКИЕ:
    - номер телефона
    - стандартные ставки
    - коэффициэнт увеличения километража
6. текст для вопросиков (помощь) (для оперативной корректировки, если ошибка)
*/

/*ПЛАН-ХОЧУ
    1. Заявка - 6 дней (документы???)
        ноябрь: (-,4,5,-,-,8,9,-,-,12,13,-)
    2. Отклики - 4 дня
        ноябрь: (-,16,17,-,-,20,21,-)
    3. Оповещения - 4 дня
        ноябрь: (-,24,25,-,-,28,29,-)
    4. Отображение в Таблице - 4 дня
        декабрь: (-,2,3,-,-,6,7,-)
    5. Отображение на карте - 4 дня
        декабрь: (-,10,11,-,-,14,15,-)
    6. Оплата - 4 дня
        декабрь: (-,18,19,-,-,22,23,-)
*/

/*ПЛАН-ФАКТ
-------
Октябрь:
23 - Регистрация (фиксы/апгрейды). Допил модульного окна (повесить действия на кнопки ок/отмена)
24 - Автозагрузка данных при сборке приложения и авторизации (допил авторизации, автоматическое создание грузоотправителя)
-
-
27 - Select (транспорт/прицеп) на сотрудниках + обработка отображения инфы в логике селектора и на самих транспортах/прицепах
28 - Заявка, пересборка модели данных, начало работы с автозаполнением select+inn в трёх формах
-
-
31 - Select+Inn (автозаполнение на формах грузополучателя/грузоотправителя)
------
Ноябрь:
1 - Select+Inn добавил автозаполнение на форме авторизации, плюс отработка всех сценариев и отлов багов на этой "фиче"
-
-
4 - Добавил мульти-селект на водительские категории.
  + Оттестил их, подправил отображение сотрудников в настройках.
  + Допил селектора сотрудников и транспорта.
  + Добавил ререндер на списки транспорта и прицепа
5 - Заявка, отображение, селекторы, сохранение
...6 + Валидация номеров транспорта/прицепа и птс
...7 + валидация ВУ сотрудника
8 - дожал маску/валидацию по всем трём пунктам (птс, ву, гн) плюс приделал селектор на случай нестандартных данных (6ч)
9 - оптимизировал код. (1ч)
..10 + оптимизировал валидатор (1ч)
..11 + оптимизировал отрисовку antd-switch
12 - добавил парсер телефона на login и выхватил все баги из него (5ч) (спасибо парсеру и т.п.)
13 - "причесал" парсеры от повторного рендера и затестил их на сотрудники/транспорт +- (2ч)
   + вывел иннВалидатор с подгрузкой в отдельный элемент (1ч)
   + прикрутил его на все три формы (авторизация, грузополучатели/грузоотправители),
     также выяснилось, что у нас проблемы с зацикливанием, разбирался (3ч)
...14 - (0ч)
...15 - (0ч)
16 - ЗАЯВКА: рефакторинг/фикс стартовой логики. (2ч)
   + сохранение данных отправителя/получателя (2.30 ч)
17 - ЗАЯВКА: маршруты и расстояния, отображение и сохранение в бэк (3ч)
   + отображение данных приёма заявки, корректировка и создание логики (отображение на карте) (3ч)
...18 - (0ч)
...19 - (1ч) настройки CSS
20 -> подгрузка отдельно каждого сотрудника/прицепа/авто/+грузополуча/отправителя
   -> отображение данных грузополучателя/грузоотправителя из данных самой заявки
*/

/* ВОПРОСЫ ПО ТЕМЕ:
    - когда вносится корректный тоннаж груза?
    - какой алгоритм, если ответчик отказался?
    - какой алгоритм, если заказчик отказался после приёма?
*/

/* МИКРОДОПИЛЫ ****************************************************
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
АВТОРИЗАЦИЯ:
- закрывать пароль звёздочками
- зашифровать передачу пароля?
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
ТРАНСПОРТ/ПРИЦЕП:
+ валидация категорий прав (мультиселектор?) = Ноябрь.4 => ГОТОВО
+ валидация гос.номера транспорта (х123хх123) Маска на госномер? = На работу Ноябрь.5-6 => ГОТОВО
+ валидация гос.номера прицепа (хх1234 123) Маска на госномер? = На работу Ноябрь.5-6 => ГОТОВО
+ В законодательстве правки новые вступили летом. Надо изменить варианты выбора данных в нижнем окне: = На работу Ноябрь.6 => ГОТОВО
    1 – собственность; 2 – совместная собственность супругов; 3 – аренда; 4 – лизинг; 5 – безвозмездное пользование.

суперпох
- сделать кнопку/ссылку на "прикреплён к" с переходом к сотруднику для редактирования
- определять первый (не цифровой) населённый пункт из фэйкового маршрута
- правильная валидация даты через ReactFinalForm
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
СОТРУДНИК:
+ форму/маску на права (12 xx №123456) = На работу Ноябрь.5-6
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
НАСТРОЙКИ:
- сделать принудительную обнову на списки (кнопку)?
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
ЗАЯВКА:
+ заблокировать вкладку Документы при создании заявки (Ноябрь.5.ночь)
+ заявка сабмитится 2 раза (ноябрь.17)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
СЕЛЕКТОР:
- затайпскриптить селектор (custom-select)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
ГЛОБАЛЬНЫЕ:

// ФОРМЫ //
+ можно использовать и латинские и русские специальные буквы при вводе, но сохранять в латинице = Ноябрь.5-6 => ГОТОВО
+ добавить обработку цифры 7и8 на все парсеры телефонов = Ноябрь.12 => ГОТОВО
!- исключить двойные срабатывания парсеров на масках = Ноябрь.13

// рефакторинг //
-+- транспорт/прицеп, грузоотправители/грузополучатели - общие методы в отдельный файл
    + innValidate (вывел в общий объект) =  Ноябрь.13 => ГОТОВО
!- отключить и проверить работу приложения (без React.StrictMode)
- использовать React.memo на тех объектах, где это необходимо
- использовать useMemo/useCallback на всех компонентах
- использовать Reac.lazy на всех вкладках/объектах
*/

/* ЗАДАЧИ БЭКУ:
планируемые:
- проверить, совпадает ли серия-номер паспорта любого другого сотрудника
переданные:
- (4.ноября) Алексей. Логирование на создание/изменение сотрудника не работает. Исправь пожалуйста
- (4.ноября) ещё просьба, добавь в логи поля (mode: string и viewed: boolean)
- (5.ноября.ночь) onerequesttype PUT измени валидацию поля cargoComposition до 100 символов (выдаёт ошибку при сохранении)
- (13ноября) сообщение об отказе отплавлять код на несуществующий номер, подправить отображение логгирования на изменение пользователя
- (17ноября) увеличить количество символов в route до 50.000
- (17ноября) возвращать список заявок с фильтрацией от даты по shipmentDate
+ Сделал запрос. PATCH onerequesttypedate/ shipmentDate: string
- (17ноября) отключить подгрузку route в списках, оставить только в запросе по ID заявки
- (17ноября) подумать, что делать со временем (разные часовые пояса и т.п.)
* */

export {}
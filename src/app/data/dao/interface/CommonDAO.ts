//сделали общий интерфейс от которого будут наследоваться определенные интерфейсы
// стандартные методы CRUD (create, read, udpate, delete)

import {Observable} from 'rxjs';

// все методы возвращают Observable - для асинхронности и работы в реактивном стиле
//чтобы можно было подписаться на Observable (тк мы работаем в Ангуляре)
export interface CommonDAO<T> {

    // получить все значения
    getAll(): Observable<T[]>;

    // получить одно значение по id
    get(id: number): Observable<T>; // получение значения по уникальному id

    // обновить значение
    update(arg0: T): Observable<T>;

    // удалить значение
    delete(id: number): Observable<T>; // удаление по id

    // добавить значение
    add(arg0: T): Observable<T>;

}

import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

// преобразовывает дату в нужный текстовый формат
@Pipe({
  name: 'taskDate'
})
export class TaskDatePipe extends DatePipe implements PipeTransform {

  //метод возвращает строку - нужное нам представление даты.
  //во входные параметры получим либо Date, либо string, либо any(для null)(из таблицы, где применили этот pipe : {{task.date | taskDate}})
  //и получим встроенный-системный форматтер как 'mediumDate'
  // mediumDate - форматирование по-умолчанию
  override transform(date: Date | string | any, format: string = 'mediumDate'): string | any {

    //если дата не поступила из {{task.date | taskDate}} тогда возвращаем 'Без срока'
    if (date == null) {
      return 'Без срока';
    }

    //получим поступившую в параметры дату из поступившей в параметры строки : date: Date | string
    date = new Date(date);

    //получим текущую(сегодняшнюю дату)  (getDate() вернет number, которые и будем сравнивать)
    const currentDate = new Date().getDate();

    //и в след методах возвращаем 'Сегодня' 'Вчера' 'Завтра'
    if (date.getDate() === currentDate) {
      return 'Сегодня';
    }

    if (date.getDate() === currentDate - 1) {
      return 'Вчера';
    }

    if (date.getDate() === currentDate + 1) {
      return 'Завтра';
    }

    //если предидущие if не сработали, нам надо вернуть дату отформатировав ее
    //с пом заданного выше format(в параметрах метода)
    //возвращаем объект DatePipe в конструктор которого подаем локаль
    return new DatePipe('ru-RU').transform(date, format); // показывать дату в нужной локали

    // const transform = new DatePipe('ru-RU').transform(date, format);
    // if(transform != null){
    //   return transform; // показывать дату в нужной локали
    // }

  }

}


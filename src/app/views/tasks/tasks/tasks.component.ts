import {Component, Injectable, OnInit} from '@angular/core';
import { Task } from 'src/app/model/Task';
import {DataHandlerService} from "../../../service/data-handler.service";
import {MatTableDataSource} from "@angular/material/table";

// @Injectable({
//   providedIn: 'root'
// })
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit{

  //подготавливаем данные для таблицы-материал с тасками:
  // поля для таблицы (те, что отображают данные из задачи - должны совпадать с названиями переменных класса)
  public displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category'];
  // контейнер - источник данных для таблицы - ПОЛУЧИТ МАССИВ tasks В ngOnInit(), НА КОТОРЫЙ МЫ ПОДПИСАНЫ
  public dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();

  //хотим этот массив или переменную передавать во вьюху
  tasks: Task[] = [];

  // инджектим наш сервис и у него получаем нужный массив
  // constructor(private dataHandler: DataHandlerService) {
  //   this.tasks = dataHandler.getTasks();
  // }

  //инджектим наш сервис и у него получаем нужный массив
  constructor(private dataHandler: DataHandlerService) {

  }

  //подписываемся. от taskSubject получаем новые данные tasks=> из сервиса и присваиваем
  //их полю этого класса - this.tasks = tasks, которое видно в html и полю dataSource
  ngOnInit(): void {
    this.dataHandler.taskSubject.subscribe(tasks => {this.tasks = tasks;
                                                                this.dataSource.data = tasks;});

    // датасорс обязательно нужно создавать для таблицы, в него присваивается любой источник (БД, массивы, JSON и пр.)
    // this.dataSource = new MatTableDataSource();
    // this.dataSource.data = this.tasks;

    //и вызываем такой метод:
    this.refreshTable();
  }


  // показывает задачи с применением всех текущий условий (категория, поиск, фильтры и пр.)
  public refreshTable() {
// обновить источник данных (т.к. данные массива tasks обновились)
    this.dataSource.data = this.tasks;

    console.log('call dataSource');
    console.log(this.dataSource.data);

  }


    //для галочки(выполнено не выполнено) - меняем булеан на противоположный вызывая из вьюхи
  toggleTaskCompleted(task: Task) {
    task.completed = !task.completed;
  }

  // в зависимости от статуса задачи - вернуть цвет названия
  public getPriorityColor(task: Task) {

    //блеклый цвет завершенной задачи
    if (task.completed) {
      // console.log('task.priority');
      // console.log(task.priority);
      return '#F8F9FA'; // TODO вынести цвета в константы (magic strings, magic numbers)

    }

    //заданный цвет в не завершенной задаче
    if (task.priority != null && task.priority.color != null) {
      return task.priority.color;

    }


    //белый цвет если приоритет не задан
    return '#fff'; // TODO вынести цвета в константы (magic strings, magic numbers)

  }
}

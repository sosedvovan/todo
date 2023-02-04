import {Component, OnInit} from '@angular/core';
import { Task } from 'src/app/model/Task';
import {DataHandlerService} from "../../../service/data-handler.service";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit{

  //хотим этот массив или переменную передавать во вьюху
  tasks: Task[] | undefined;

  // //инджектим наш сервис и у него получаем нужный массив
  // constructor(private dataHandler: DataHandlerService) {
  //   this.tasks = dataHandler.getTasks();
  // }
  //подписываемся. от taskSubject получаем новые данные tasks=> из сервиса и присваиваем
  //их полю этого класса - this.tasks = tasks, которое видно в html
  constructor(private dataHandler: DataHandlerService) {

  }

  //подписываемся. от taskSubject получаем новые данные tasks=> из сервиса и присваиваем
  //их полю этого класса - this.tasks = tasks, которое видно в html
  ngOnInit(): void {
    this.dataHandler.taskSubject.subscribe(tasks => this.tasks = tasks);
  }

}

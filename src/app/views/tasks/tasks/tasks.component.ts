import { Component } from '@angular/core';
import { Task } from 'src/app/model/Task';
import {DataHandlerService} from "../../../service/data-handler.service";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {

  //хотим этот массив или переменную передавать во вьюху
  tasks: Task[];

  //инджектим наш сервис и у него получаем нужный массив
  constructor(private dataHendler: DataHandlerService) {
    this.tasks = dataHendler.getTasks();
  }

}

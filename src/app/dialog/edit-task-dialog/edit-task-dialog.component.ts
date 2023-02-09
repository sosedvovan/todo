import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { Task } from 'src/app/model/Task';
import {DataHandlerService} from "../../service/data-handler.service";

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
//класс отвечает за компоненту, которая показывается в открывающемся диалоговом окне
//при вызове его из родительского tasks.component.ts
export class EditTaskDialogComponent implements OnInit {

  //поля для тех данных, которые передаются сюда из
  //вызывающего родительского компонента : tasks.component.ts
  //из его метода openEditTaskDialog : ... data: [task, 'Редактирование задачи']
  public dialogTitle: string; // заголовок окна
  public task: Task; // задача для редактирования/создания

  constructor(
    //инжектим dialogRef - это диалоговое окно в котором будет отображаться сам этот компонент,
    // dialogRef создали в вызывающей родительской компоненте tasks.component.ts ->
    //-> в методе openEditTaskDialog : const dialogRef = this.dialog.open(...
    private dialogRef: MatDialogRef<EditTaskDialogComponent>, // для возможности работы с текущим диалог. окном
    //инджектим данные - data - которые также получаем из метода родительского компонента
    //[Task, string] - это то что передали -> {data: [task, 'Редактирование задачи']
    //(MAT_DIALOG_DATA) - специальный токен, чтобы определить - какие именно данные
    //мы сюда инджектим
    @Inject(MAT_DIALOG_DATA)
    private data: [Task, string], // данные, которые передали в диалоговое окно
    private dataHandler: DataHandlerService, // ссылка на сервис для работы с данными
    private dialog: MatDialog, // для открытия нового диалогового окна (из текущего) - например для подтверждения удаления
  ) {
  }

  //инициируем поля этого класса
  ngOnInit() {
    this.task = this.data[0]; // задача для редактирования/создания
    this.dialogTitle = this.data[1]; // текст для диалогового окна

    console.log(this.task);
    console.log(this.dialogTitle);


  }

}

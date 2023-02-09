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

  //эту переменную завели в html: [(ngModel)]="tmpTitle"
  // чтобы изменения не сказывались на самой задаче и можно было отменить изменения
  //завели доп переменную для атрибута ngModel для хранения временного значения,
  //которое введет пользователь в диалоговое окно (тк если нажать отмена - тогда эти данные не нужны)
  //в ngOnInit() эта переменная получает начальное значение : this.tmpTitle = this.task.title;
  //если пользователь изменит данные и нажмет сохранить - в методе onConfirm() данные
  //из этой временной переменной присвоются полю this.task.title
  public tmpTitle: string;

  // сохраняем все значения в отдельные переменные

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

    // инициализация начальных значений (записывам в отдельные переменные
    // чтобы можно было отменить изменения, а то будут сразу записываться в задачу)
    this.tmpTitle = this.task.title;

    console.log(this.task);
    console.log(this.dialogTitle);
  }

  // нажали кнопку ОК  или клавишу Enter
  public onConfirm(): void {

    // считываем все значения для сохранения в поля задачи
    this.task.title = this.tmpTitle;


    // передаем добавленную/измененную задачу в обработчик - в родительский компанент
    // и что с ней будут делать дальше  - уже задача этого родительского компонента
    this.dialogRef.close(this.task);

  }

  // нажали кнопку отмену (ничего не сохраняем и закрываем окно)
  //и в родительский компонент возвращаем null
  public onCancel(): void {
    this.dialogRef.close(null);
  }

}

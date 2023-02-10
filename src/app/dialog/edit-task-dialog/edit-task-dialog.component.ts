import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { Task } from 'src/app/model/Task';
import {DataHandlerService} from "../../service/data-handler.service";
import {Category} from "../../model/Category";
import {Priority} from "../../model/Priority";

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

  //по этой переменной мы будем итерироваться  html в выпадающем списке
  //для выбора категории для таски
  public categories: Category[];

//-создаем переменную-массив по которому будем итерироваться в html для выпадающего списка
// для выбора приоритета для таски:
    public priorities: Priority[];


  //эту переменную завели в html: [(ngModel)]="tmpTitle"
  // чтобы изменения не сказывались на самой задаче и можно было отменить изменения
  //завели доп переменную для атрибута ngModel для хранения временного значения,
  //которое введет пользователь в диалоговое окно (тк если нажать отмена - тогда эти данные не нужны)
  //в ngOnInit() эта переменная получает начальное значение : this.tmpTitle = this.task.title;
  //если пользователь изменит данные и нажмет сохранить - в методе onConfirm() данные
  //из этой временной переменной присвоются полю this.task.title
  public tmpTitle: string;
  public tmpCategory: Category | any;
  public tmpPriority: Priority | any;

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
    this.tmpCategory = this.task.category;
    this.tmpPriority = this.task.priority;

    //переменную categories подписываем на лист со всеми категориями для итерации по ней в html
    this.dataHandler.getAllCategories().subscribe(items => this.categories = items);
    //переменную priorities подписываем на лист со всеми приоритетами для итерации по ней в html
    this.dataHandler.getAllPriorities().subscribe(items => this.priorities = items);

    console.log(this.task);
    console.log(this.dialogTitle);
  }

  // нажали кнопку ОК  или клавишу Enter
  public onConfirm(): void {

    // считываем все значения для сохранения в поля задачи
    this.task.title = this.tmpTitle;
    this.task.category = this.tmpCategory;
    this.task.priority = this.tmpPriority;


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

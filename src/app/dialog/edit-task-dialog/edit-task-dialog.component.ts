import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { Task } from 'src/app/model/Task';
import {DataHandlerService} from "../../service/data-handler.service";
import {Category} from "../../model/Category";
import {Priority} from "../../model/Priority";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {OperType} from "../OperType";

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

  //Енам для определения add or edit
  public operType: OperType;  // тип операции


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
  public tmpDate: Date | any;

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
    // @ts-ignore
    this.operType = this.data[2]; // тип операции

    // инициализация начальных значений (записывам в отдельные переменные
    // чтобы можно было отменить изменения, а то будут сразу записываться в задачу)
    this.tmpTitle = this.task.title;
    this.tmpCategory = this.task.category;
    this.tmpPriority = this.task.priority;
    this.tmpDate = this.task.date;

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
    this.task.date = this.tmpDate;


    // передаем добавленную/измененную задачу в обработчик - в родительский компонент tasks.component.ts
    // и что с ней будут делать дальше  - уже задача этого родительского компонента
    this.dialogRef.close(this.task);

  }

  // нажали кнопку отмену (ничего не сохраняем и закрываем окно)
  //и в родительский компонент возвращаем null
  public onCancel(): void {
    this.dialogRef.close(null);
  }


  // нажали Удалить -> надо открыть окно подтверждения удаления
  public delete() {

    //указываем ConfirmDialogComponent - окно, которое надо открыть
    //в спец. объекте {...} в открываемое окно передаем:
    //ширину окна и 2-е стринги: название окна и вопрос о действии, и без фокуса
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить задачу: "${this.task.title}"?`
      },
      autoFocus: false
    });

    //как только пользователь закрыл окно нажав на одну из кнопок(ок, отмена)-
    //в result будет true(если пользователь OK нажал)
    //и будет false, если пользователь ОТМЕНА нажал
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //если нажал ОК->тогда закрываем текущее диалоговое окно
        //(окно редактирования таски) и стрингу 'delete' по цепочки
        //передаем в родительский-вызывающий компонент tasks.component.ts ->
        //-> в родительский метод openEditTaskDialog()
        this.dialogRef.close('delete'); // нажали удалить
      }
    });
  }

  // нажали кнопку "Выполнить" (завершить) задачу ->
  //close() - закрываем диалоговое окно и в родительский-вызывающий  компонент tasks.component.ts,
  //в метод открывший это окно openEditTaskDialog отсылаем стрингу : 'complete' для
  //дальнейшей обработки логики
  public complete() {
    this.dialogRef.close('complete');

  }

  // делаем статус задачи "незавершенным" (активируем)
  public activate() {
    this.dialogRef.close('activate')
  }

 //для кнопки "Удалить": для определения типа операции - создаем или редактируем по енаму
  public canDelete(): boolean {
    return this.operType === OperType.EDIT;
  }
  //для кнопки "Активировать таску": для определения типа операции - создаем или редактируем по енаму
  public canActivateDesactivate(): boolean {
    return this.operType === OperType.EDIT;
  }
}

import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component, EventEmitter,
  Injectable, Input,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import { Task } from 'src/app/model/Task';
import {DataHandlerService} from "../../../service/data-handler.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DataSource} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material/dialog";
import {EditTaskDialogComponent} from "../../../dialog/edit-task-dialog/edit-task-dialog.component";
import {ConfirmDialogComponent} from "../../../dialog/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
//это дочерний компонент
export class TasksComponent implements OnInit{

  //подготавливаем данные для таблицы-матЕриал с тасками(+для сортировки и пагинации):
  //перечисляем поля таблицы (те, что отображают поля тасок - должны совпадать с названиями переменных
  //класса + могут быть дополнительные - для иконок и чекбоксов)
  public displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  // контейнер dataSource - источник данных для таблицы - ПОЛУЧИТ МАССИВ tasks В ngOnInit(), НА КОТОРЫЙ МЫ ПОДПИСАНЫ
  //в dataSource надо будет дать значение полям: dataSource.data, dataSource.sort, dataSource.paginator
  //и dataSource.sortingDataAccessor(для правильной работы сортировки).
  public dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  //далее подготавливаем ссылки для пагинации и сортировки:
  // ссылки на компоненты таблицы (добавляем декоратор @ViewChild - присваивает
  // переменной из класса - атрибут тега или сам тег из html.
  // здесь в скобках обращаемся по типу тега (MatPaginator,...) и (MatSort,...) но можно и по названию тега:
  // ('matPaginator',...), а в html в теге прописать в теге название: #matPaginator)
  //эти переменные ссылаются на теги mat-paginator и matSort указанные в html компоненте
  //и теперь им можно присвоить в dataSource.sort и dataSource.paginator эти переменные в методе addTableObjects()
  //далее надо заимплементить интерфейс AfterViewInit(сработает после инициализации) и чз него запустить addTableObjects()
  @ViewChild(MatPaginator, {static: false}) //здесь MatPaginator это тег <mat-paginator
  private paginator: MatPaginator;          //то эта переменная paginator будет связанна с тегом <mat-paginator
  @ViewChild(MatSort, {static: false}) //здесь MatSort это атрибут matSort в теге <table
  private sort: MatSort;               //то эта переменная sort будет связанна с атрибутом matSort в теге <table
  //СРАБАТЫВАЕТ ngOnInit() И ИНИЦИАЛИЗИРУЮТСЯ: dataSource.data, dataSource.sort, dataSource.paginator, dataSource.sortingDataAccessor
  private addTableObjects() {
    this.dataSource.sort = this.sort; // компонент для сортировки данных (если необходимо)
    this.dataSource.paginator = this.paginator; // обновить компонент постраничности (кол-во записей, страниц)
  }


  //вызовется сразу после инициализации представления(объектов и переменных) и его дочек
  //те на этом этапе можно будет обращаться к сылкам в html
  //ЭТОТ МЕТОД РЕАЛИЗУЕМ ОТ ИНТЕРФЕЙСА : AfterViewInit
  // ngAfterViewInit(): void {
  //   this.addTableObjects();
  // }

  //----------------------------------------------------------------------------------------

  //хотим этот массив передавать во вьюху
  //это текущие таски для отображения на странице
  //напрямую не присваиваем значения в переменную, только через @Input
  // @Input() перенесли в сеттер чтобы еще и fillTable() из сеттера запускать
  tasks: Task[];
  // tasks: Task[] = [];
  // текущие задачи для отображения на странице
  // напрямую не присваиваем значения в переменную, только через @Input
  @Input('tasks')
  public set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
  }


  //переменная updateTask должна хранить ссылку на EventEmitter<Task>
  //тип передаваемого параметра - <Task>
  //@Output() запускается с помощью : this.updateTask.emit(task); (необязательно и автоматом срабатывает?)
  //и отправляет (task) в родительский html где : (updateTask)="onUpdateTask($event)"
  //и уже запускается метод onUpdateTask в родительском компоненте
  @Output()
  updateTask = new EventEmitter<Task>();

  @Output()
  deleteTask = new EventEmitter<Task>();



  // инджектим наш сервис и у него получаем нужный массив
  // constructor(private dataHandler: DataHandlerService) {
  //   this.tasks = dataHandler.getTasks();
  // }

  //инджектим наш сервис и у него получаем нужный массив
  //так же инджектим : работу с диалоговым окном
  constructor(private dataHandler: DataHandlerService,
              private dialog: MatDialog) {

  }

  //метод вызывается до отрисовки визуальных компонентов(html) и подходит для
  //инициализации объектов и переменных.
  //подписываемся. от taskSubject получаем новые данные tasks=> из сервиса и присваиваем
  //их полю этого класса - this.tasks = tasks, которое видно в html и полю dataSource
  ngOnInit(): void {
    // this.dataHandler.taskSubject.subscribe(tasks => {this.tasks = tasks;
    //                                                             this.dataSource.data = tasks;});
    //начали использовать дао -> подписываемся на возврат из метода: getAllTasks(): Observable<Task[]>
    //а не на taskSubject = new BehaviorSubject<Task[]>(TestData.tasks);
    // this.dataHandler.getAllTasks().subscribe(tasks => {this.tasks = tasks;
    //                                           this.dataSource.data = tasks;});

    // датасорс обязательно нужно создавать для таблицы, в него присваивается любой источник (БД, массивы, JSON и пр.)
    // this.dataSource = new MatTableDataSource();
    // this.dataSource.data = this.tasks;


    // датасорс обязательно нужно создавать для таблицы, в него присваивается любой источник (БД, массивы, JSON и пр.)
    // this.dataSource = new MatTableDataSource();//я инициализировал при декларации выше
    //и вызываем такой метод:
    this.fillTable();
  }


  // показывает задачи с применением всех текущий условий (категория, поиск, фильтры и пр.)
  public fillTable() {

//сначала сделаем проверку что dataSource != null чтобы не получить undefined
    if (!this.dataSource) {
      return;
    }

    // обновить источник данных (т.к. данные массива tasks обновились)
    this.dataSource.data = this.tasks;

    //обновим сортировку и пагинацию (но и без этого работает?)
    this.addTableObjects();


    //следующий код даст значение полю dataSource.sortingDataAccessor(для правильной работы сортировки):
    //то dataSource будет знать по каким полям сортировать объект task при нажатии
    // на стрелочки сортировки над разными колонками таблицы (типа компаратору говорим по каким полям сравниваем).
    // когда получаем новые данные..
    // чтобы можно было сортировать по столбцам "категория" и "приоритет", т.к. там не примитивные типы, а объекты
    // @ts-ignore - показывает ошибку для типа даты, но так работает, т.к. можно возвращать любой тип
    this.dataSource.sortingDataAccessor = (task, colName) => {
      // по каким полям выполнять сортировку для каждого столбца
      switch (colName) {
        case 'priority': {
          return task.priority ? task.priority.id : null;
        }
        case 'category': {
          return task.category ? task.category.title : null;
        }
        case 'date': {
          return task.date ? task.date : null;
        }

        //title обязательное поле - на null проверять не надо
        case 'title': {
          return task.title;
        }
      }
    };


    console.log('call dataSource');
    console.log(this.dataSource.data);

  }


    //для галочки(выполнено не выполнено) - меняем булеан на противоположный вызывая из вьюхи
  // toggleTaskCompleted(task: Task) {
  //   task.completed = !task.completed;
  // }

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

  //!!!НАДО ДОБАВИТЬ MatDialogModule В app.module.ts
  // диалоговое редактирования для добавления задачи
  public openEditTaskDialog(task: Task): void {

    //запускает @Output(), кот в родительском классе вызывает метод
    //кот просто печатает в консоль
    this.updateTask.emit(task);

    // открытие диалогового окна(и обработка результата от этого окна после его закрытия)
    //метод open открывает наш компонент EditTaskDialog
    //и передает в объекте - MatDialogConfig в массиве в него параметры - data
    //(кроме data в MatDialogConfig есть много других параметров - ширина...)
    //с const dialogRef будем работать в компоненте диалогового окна : edit-task-dialog.component.ts
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {data: [task, 'Редактирование задачи'], autoFocus: false});

    //далее подписываемся на событие закрытия диалогового окна: afterClosed().subscribe()
    //и в анонимном методе выполняем все что нам нужно
    //в result будет то, что мы вернем из диалогового окна
    dialogRef.afterClosed().subscribe(result => {
      // обработка результатов

      if (result === 'complete') {
        task.completed = true; // ставим статус задачи как выполненная
        this.updateTask.emit(task);
      }


      if (result === 'activate') {
        task.completed = false; // возвращаем статус задачи как невыполненная
        this.updateTask.emit(task);
        return;
      }

      if (result === 'delete') {
        this.deleteTask.emit(task);
        return;
      }

      //если result не пустой -> преобразуем его в as Task
      if (result as Task) { // если нажали ОК в диалоговом окне и есть результат
        this.updateTask.emit(task);//сохраняем обновленные данные в репозитории -> попадаем в app.component.html в метод onUpdateTask(task: Task)
        return;
      }

    });
  }

  // ngAfterViewChecked(): void {
  //   this.dataSource.data = this.tasks;
  // }

  // диалоговое окно подтверждения удаления когда клацнули по иконки удаления
  public openDeleteDialog(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {dialogTitle: 'Подтвердите действие', message: `Вы действительно хотите удалить задачу: "${task.title}"?`},
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // если нажали ОК тогда с пом @Output() посылаем в главный компонент
                    //app.component.ts событие, кот там запустит метод для внесения изменений в дб
        this.deleteTask.emit(task);
      }
    });
  }

//при изменении чекбокса (выбран не выбран)
  //меняем в таске булен поле completed на противоположное
  // и делаем emit(task) - посылаем действие в главную компоненту
  //для обновления в дб и в отображении в браузере
  public onToggleStatus(task: Task) {
    task.completed = !task.completed;
    this.updateTask.emit(task);
  }


}

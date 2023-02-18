import {
  AfterViewInit,
  Component, EventEmitter,
  Input,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import { Task } from 'src/app/model/Task';
import {DataHandlerService} from "../../../service/data-handler.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {EditTaskDialogComponent} from "../../../dialog/edit-task-dialog/edit-task-dialog.component";
import {ConfirmDialogComponent} from "../../../dialog/confirm-dialog/confirm-dialog.component";
import {Category} from "../../../model/Category";
import {Priority} from "../../../model/Priority";
import {OperType} from "../../../dialog/OperType";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
//это дочерний компонент dump
export class TasksComponent implements OnInit, AfterViewInit{

  ////////////////////////////////
  //    настаиваем таблицу      //
  ////////////////////////////////

  //подготавливаем данные для таблицы-матЕриал с тасками(+для сортировки и пагинации):
  //перечисляем поля таблицы (те, что отображают поля тасок - должны совпадать с названиями переменных
  //класса + могут быть дополнительные - для иконок и чекбоксов)
  public displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  // контейнер dataSource - источник данных для таблицы - ПОЛУЧИТ МАССИВ tasks В ngOnInit(), НА КОТОРЫЙ МЫ ПОДПИСАНЫ
  //в dataSource надо будет дать значение полям: dataSource.data, dataSource.sort, dataSource.paginator
  //и dataSource.sortingDataAccessor(для правильной работы сортировки).
  public dataSource: MatTableDataSource<Task>;
  //далее подготавливаем ссылки для пагинации и сортировки:
  // ссылки на компоненты таблицы (добавляем декоратор @ViewChild - присваивает
  // переменной из класса - атрибут тега или сам тег из html.
  // здесь в скобках обращаемся по типу тега (MatPaginator,...) и (MatSort,...) но можно и по названию тега:
  // ('matPaginator',...), а в html в теге прописать в теге название-альяс: #matPaginator)
  //эти переменные ссылаются на теги mat-paginator и matSort указанные в html компоненте
  //и теперь им можно присвоить в dataSource.sort и dataSource.paginator эти переменные в методе addTableObjects()
  //далее надо заимплементить интерфейс AfterViewInit(сработает после инициализации) и чз него запустить addTableObjects()
  @ViewChild(MatPaginator, {static: false}) //здесь MatPaginator это тег <mat-paginator
  private paginator: MatPaginator;          //то эта переменная paginator будет связанна с тегом <mat-paginator
  @ViewChild(MatSort, {static: false}) //здесь MatSort это атрибут matSort в теге <table
  private sort: MatSort;               //то эта переменная sort будет связанна с атрибутом matSort в теге <table

  //СРАБАТЫВАЕТ ngOnInit() И ИНИЦИАЛИЗИРУЮТСЯ: dataSource.data, dataSource.sort, dataSource.paginator, dataSource.sortingDataAccessor

  private addTableObjects() {

    setTimeout(function (){}, 0)

    this.dataSource.sort = this.sort; // компонент для сортировки данных (если необходимо)
    this.dataSource.paginator = this.paginator; // обновить компонент постраничности (кол-во записей, страниц)
  }



  //ГЛАВНЫЙ МАССИВ КОМПОНЕНТЫ: Получаем массив с тасками из смарт-компонента
  //(массив будет содержать в себе все таски или только отфильтрованными таски)
  //Этот массив будет видеть вьюха (во вьюхе итерируемся по этому массиву для отображения таблицы с тасками).
  //Это текущие таски для отображения на странице.
  //Напрямую не присваиваем значения в переменную, только через @Input.
  // @Input() перенесли в сеттер, чтобы еще и fillTable() из сеттера запускать,
  // а в этом fillTable() переиницализируем все поля dataSource для обновленного
  //массива с тасками(когда отфильтровали, добавили, удалили, изменили таску это надо)
  //для правильной работы пагинации и сортировки
  tasks: Task[];
  // tasks: Task[] = [];
  @Input('tasks')
  public set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
  }

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
    this.dataSource = new MatTableDataSource<Task>();
    // this.dataSource.data = this.tasks;


    // датасорс обязательно нужно создавать для таблицы, в него присваивается любой источник (БД, массивы, JSON и пр.)
    // this.dataSource = new MatTableDataSource();//я инициализировал при декларации выше
    //и вызываем такой метод:

    this.fillTable();

    // Вместо fillTable() можно вызвать:
    // this.onSelectCategory(null); //показать все категории
    //так мы будем работать не на уровне методов а на уровне компонентов

  }


  // показывает задачи с применением всех текущий условий (категория, поиск, фильтры и пр.)
  public fillTable() {
//сначала сделаем проверку что dataSource != null (те new сказали) чтобы не получить undefined
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

  }

  //Вызовется сразу после инициализации представления(объектов и переменных)
  //и его дочек. Помогает  для первоначальной сортировки и пагинации
  //инициализировать dataSource.paginator и dataSource.sort
  //те на этом этапе можно будет уже обращаться к ссылкам в html.
  //ЭТОТ МЕТОД РЕАЛИЗУЕМ ОТ ИНТЕРФЕЙСА : AfterViewInit
  ngAfterViewInit(): void {
    this.addTableObjects();
  }


  //////////////////////////////////////////////////
  //              для полей фильтрации тасок     //
  /////////////////////////////////////////////////
  // поиск - переменные  которые над таблицей с тасками
  // текущее значение для поиска задач инициализируем из смарт компонента - @Input('priorities')
  public searchTaskText: string;
  // по-умолчанию будут показываться задачи по всем статусам
  // (решенные и нерешенные) поэтому сразу и инициализируем null-ем
  public selectedStatusFilter: boolean | any = null;
  // по-умолчанию будут показываться задачи по всем приоритетам
  //поэтому сразу и инициализируем null-ем
  public selectedPriorityFilter: Priority | any = null;
  //посылаем сообщение в smart компонент app.component.ts из onFilterByTitle()->emit(...)
  @Output()
  filterByTitle = new EventEmitter<string>();
  //посылаем сообщение в smart компонент app.component.ts
  @Output()
  filterByStatus = new EventEmitter<boolean>();
  //посылаем сообщение в smart компонент app.component.ts
  @Output()
  filterByPriority = new EventEmitter<Priority>();

  // список приоритетов (для фильтрации задач)
  public priorities: Priority[];
  //принимаем из смарт компонента
  @Input('priorities')
  set setPriorities(priorities: Priority[] | any) {
    this.priorities = priorities;
  }

//МЕТОДЫ ФИЛЬТРАЦИИ:

  // фильтрация по названию - по вхождению букв
  public onFilterByTitle() {
    this.filterByTitle.emit(this.searchTaskText);
  }

  // фильтрация по статусу
  public onFilterByStatus(value: boolean | any) {

    // console.log('selectedStatusFilterSTART:')
    // console.log(this.selectedStatusFilter)
    // console.log('value:')
    // console.log(value)

    // на всякий случай проверяем изменилось ли значение (хотя сам UI компонент должен это делать)
    if (value !== this.selectedStatusFilter) {
      this.selectedStatusFilter = value;
      this.filterByStatus.emit(this.selectedStatusFilter);
    }

    // console.log('selectedStatusFilterEND:')
    // console.log(this.selectedStatusFilter)
  }


  // фильтрация по приоритету
  public onFilterByPriority(value: Priority | any) {


    // на всякий случай проверяем изменилось ли значение (хотя сам UI компонент должен это делать)
    if (value !== this.selectedPriorityFilter) {
      this.selectedPriorityFilter = value;
      this.filterByPriority.emit(this.selectedPriorityFilter);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
    //для галочки(выполнено не выполнено) - меняем булеан на противоположный вызывая из вьюхи //
  // toggleTaskCompleted(task: Task) {                                                        //
  //   task.completed = !task.completed;                                                      //
  // }                                                                                        //
  //--------------------------------------------------------------------------------------------



  ////////////////////////////////////////////////////////////////
  // возвращает цвет для ячеек первого столбца в таблице тасок //
  ///////////////////////////////////////////////////////////////

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


  /////////////////////////////////////////////////////////////////////////////////////////////
  // открываем диалоговое окно для редактирования таски при нажатии на таску или на карандаш //
  /////////////////////////////////////////////////////////////////////////////////////////////

  //переменная updateTask хранит ссылку на EventEmitter<Task>
  //тип передаваемого параметра - <Task>
  //@Output() запускается с помощью : this.updateTask.emit(task); (необязательно и автоматом срабатывает?)
  //и отправляет (task) в родительский html где : (updateTask)="onUpdateTask($event)"
  //и уже запускается метод onUpdateTask в родительском компоненте
  @Output()
  updateTask = new EventEmitter<Task>();

  @Output()
  deleteTask = new EventEmitter<Task>();

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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // открываем диалоговое окно для подтверждения удаления таски при нажатии на "Удалить" в первом диалоговом окне //
  // и на иконку "корзина" в самой таблице тасок                                                                  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // диалоговое окно подтверждения удаления когда клацнули по иконки удаления в первом диалоговом окне
  // и на иконку "корзина" в самой таблице тасок
  public openDeleteDialog(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {dialogTitle: 'Подтвердите действие', message: `Вы действительно хотите удалить задачу: "${task.title}"?`},
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // если нажали ОК тогда с пом @Output() deleteTask - посылаем в главный компонент
                    //app.component.ts событие, кот там запустит метод для внесения изменений в дб
        this.deleteTask.emit(task);
      }
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  // меняем чекбокс и кликаем на ячейку с категорией таски в таблице всех тасок //
  ////////////////////////////////////////////////////////////////////////////////

//при изменении чекбокса (выбран не выбран)
  //меняем в таске булин поле completed на противоположное
  // и делаем emit(task) - посылаем действие в главную компоненту (emit() запускает @Output updateTask(...) - переиспользуем)
  //для обновления в дб и в отображении в браузере
  public onToggleStatus(task: Task) {
    task.completed = !task.completed;
    this.updateTask.emit(task);
  }

  // нажали на категорию из списка задач
  @Output()
  selectCategory = new EventEmitter<Category>();

  //при клике по категории в столбце категорий (отобразим только таски из этой категории)
  //посылаем emit-selectCategory с данной категорией в главную компоненту
  //в app.component.html (emit() запускает @Output)
  public onSelectCategory(category: Category) {
    this.selectCategory.emit(category);
  }


  ////////////////////////////////////////////////////////////////////////////////////
  // диалоговое окно для добавления задачи - когда нажимаем кнопку "Добавить" таску //
  // (кнопка находится над таблицей тасок - справа)                                 //
  ////////////////////////////////////////////////////////////////////////////////////

  @Input()
  selectedCategory: Category;

  @Output()
  addTask = new EventEmitter<Task>();

  public openAddTaskDialog() {

    // то же самое, что и при редактировании, но только в открывающееся диалоговое окно
    // передаем пустой объект Task:
    const task = new Task(null, '', false, null, this.selectedCategory);

    //открываем уже имеющиеся диалоговое окно EditTaskDialogComponent (которое для редактирования таски)
    //но используем его для создания новой таски. Причем, если если его вызвали когда находились
    //в одной из категорий, то в поле категория - будет эта категория в которой находимся (this.selectedCategory)
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {maxWidth: '500px',
      data: [task, 'Добавление задачи', OperType.ADD]});

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // если нажали ОК и если есть результат - отправили task
                   // на сохранение в смарт компоненту app.component.ts
        this.addTask.emit(task);
      }
    });

  }



}

import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  Injectable,
  OnInit,
  ViewChild
} from '@angular/core';
import { Task } from 'src/app/model/Task';
import {DataHandlerService} from "../../../service/data-handler.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DataSource} from "@angular/cdk/collections";

// @Injectable({
//   providedIn: 'root'
// })
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, AfterViewInit{

  //хотим этот массив или переменную передавать во вьюху
  tasks: Task[] = [];

  //подготавливаем данные для таблицы-материал с тасками:
  // поля для таблицы (те, что отображают данные из задачи - должны совпадать с названиями переменных класса)
  public displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category'];
  // контейнер - источник данных для таблицы - ПОЛУЧИТ МАССИВ tasks В ngOnInit(), НА КОТОРЫЙ МЫ ПОДПИСАНЫ
  //в dataSource надо будет дать значение полям: dataSource.data, dataSource.sort, dataSource.paginator
  //и dataSource.sortingDataAccessor(для правильной работы сортировки).
  public dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  //далее подготавливаем ссылки для пагинации и сортировки:
  // ссылки на компоненты таблицы (добавляем декоратор @ViewChild - присваивает переменной из класса - тег из html.
  // здесь в скобках обращаемся по типу тега (MatPaginator,...) и (MatSort,...) но можно и по названию тега:
  // ('matPaginator',...), а в html в теге прописать в теге название: #matPaginator)
  //эти переменные ссылаются на теги mat-paginator и matSort указанные в html компоненте
  //и теперь им можно присвоить в dataSource.sort и dataSource.paginator эти переменные в методе addTableObjects()
  //далее надо заимплементить интерфейс AfterViewInit(сработает после инициализации) и чз него запустить addTableObjects()
  @ViewChild(MatPaginator, {static: false}) private paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort: MatSort;
  private addTableObjects() {
    this.dataSource.sort = this.sort; // компонент для сортировки данных (если необходимо)
    this.dataSource.paginator = this.paginator; // обновить компонент постраничности (кол-во записей, страниц)
    // this.dataSource.data = this.tasks;
  }
  //вызовется сразу после инициализации представления(объектов и переменных) и его дочек
  //те на этом этапе можно будет обращаться к сылкам в html
  ngAfterViewInit(): void {
    this.addTableObjects();
    // this.dataSource.data = this.tasks;
  }

  //----------------------------------------------------------------------------------------



  // инджектим наш сервис и у него получаем нужный массив
  // constructor(private dataHandler: DataHandlerService) {
  //   this.tasks = dataHandler.getTasks();
  // }

  //инджектим наш сервис и у него получаем нужный массив
  constructor(private dataHandler: DataHandlerService) {

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
    this.dataHandler.getAllTasks().subscribe(tasks => {this.tasks = tasks;
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

    //обновим сортировку и пагинацию (но и без этого работает?)
    this.addTableObjects();


    //следующий код даст значение полю dataSource.sortingDataAccessor(для правильной работы сортировки):
    //то dataSource будет знать по каким полям сортировать объект task при нажатии
    // на стрелочки сортировки над разными колонками таблицы (типа кампаратору говорим по каким полям сравниваем).
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

  // ngAfterViewChecked(): void {
  //   this.dataSource.data = this.tasks;
  // }


}

import {Injectable, ViewChild} from '@angular/core';
import {Category} from "../model/Category";
import {TestData} from "../data/TestData";
import {Task} from "../model/Task";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {TasksComponent} from "../views/tasks/tasks/tasks.component";
import {TaskDAOArray} from "../data/dao/impl/TaskDAOArray";
// import {CommonService} from './common.service';


@Injectable({
  providedIn: 'root'
})
//Сервис - постоянный поставщик данных из дб (или inMemory дб)
export class DataHandlerService {

  //Subject - данные на которые подписываются (на него будут подписываться)
  // taskSubject = new Subject<Task[]>();
  // categoriesSubject = new Subject<Category[]>();

  //Observable - издатели - ПОСТОЯННЫЕ поставщики данных
  //BehaviorSubject - данные на которые подписываются (на него будут подписываться)
  //+ BehaviorSubject имеет начальное состояние, задаем в (...), например: (TestData.tasks)
  //+ не надо запускать раздачу методом nexy() - автоматом раздает
  taskSubject = new BehaviorSubject<Task[]>(TestData.tasks);
  categoriesSubject = new BehaviorSubject<Category[]>(TestData.categories);

  //вручную инджектим класс в поле этого класса:
  //начали использовать Dao методы которого уже возвращают объект Observable -
  // - те объект который постоянно транслирует(издает) данные -
  // - и подписчики могут постоянно считывать обновление этих данных:
  // релизации работы с данными с помощью массива
  // (можно подставлять любые релизации, в том числе с БД. Главное - соблюдать интерфейсы)
  private taskDaoArray = new TaskDAOArray();


  //пробую получить доступ к методу другого компонента
  //https://question-it.com/questions/318904/kak-vyzvat-metod-iz-odnogo-komponenta-v-drugoj-komponent-v-angular-2
  // @ViewChild(TasksComponent) private _child: { refreshTable: () => void; };


  //при старте приложения издатель уже сигнализирует подписчикам, что есть в подписке TestData.tasks,
  // но при использовании BehaviorSubject, а не Subject метод next() необязателен?

  constructor() {

    // this.fillTasks()
  }

  //начали использовать Dao
  //метод возвращает объект Observable<Task[]> со всеми тасками
  // на который можно подписываться с помощью метода subscribe() в классах-компонентах
  getAllTasks(): Observable<Task[]> {
    return this.taskDaoArray.getAll();
  }

  // getCategories(): Category[] {
  //   return TestData.categories;
  // }

  // getTasks(): Task[]{
  //   return TestData.tasks
  // }

  //сигнализируем всем подписчикам, что поступило новое значение, отсылая им TestData.tasks
  //метод next() - осуществляет раздачу данных подписчикам(Observer) -
  //- для этого далее  надо подписаться на получение этих данных с помощью метода subscribe()
  // fillTasks(){
  //   this.taskSubject.next(TestData.tasks);
  // }





  // getTasksByCategory(category: Category): Task[]{
  //   const tasks = TestData.tasks.filter(task => task.category === category);
  //   console.log(tasks);
  //   return tasks;
  // }
  //возвращаем массив тасков отфильтрованных по выбранной категории
  //сигнализируем всем подписчикам, что поступило новое значение, отсылая им tasks
  fillTasksByCategory(category: Category){
    //получаем массив отфильтрованных по category тасков
    const tasks = TestData.tasks.filter(task => task.category === category);
    //осуществляем раздачу отфильтрованных тасков (далее можно поискать - кто их слушает)
    this.taskSubject.next(tasks);
    console.log('coll servis');
    console.log(tasks);

    // this.tasksComponent.refreshTable();
  }

}

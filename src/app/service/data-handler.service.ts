import {Injectable, ViewChild} from '@angular/core';
import {Category} from "../model/Category";
import {TestData} from "../data/TestData";
import {Task} from "../model/Task";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {TasksComponent} from "../views/tasks/tasks/tasks.component";
import {TaskDAOArray} from "../data/dao/impl/TaskDAOArray";
import {CategoryDAOArray} from "../data/dao/impl/CategoryDAOArray";
import {Priority} from "../model/Priority";
import {PriorityDAOArray} from "../data/dao/impl/PriorityDAOArray";
// import {CommonService} from './common.service';

//@Injectable - означает, что мы объект этого класса можем заинджектить
//в любой другой класс (а тк providedIn: 'root' - можно его в модуле не прописывать)
@Injectable({
  providedIn: 'root'
})
//Сервис - постоянный поставщик данных из дб (или inMemory дб)
export class DataHandlerService {

  //Инджектим наши ДАО классы, методы которых будут возвращать нам Observable<...>
  // реализации работы с данными с помощью массива
  // (можно подставлять любые реализации, в том числе с БД. Главное - соблюдать интерфейсы)
  private taskDaoArray = new TaskDAOArray();
  private categoryDaoArray = new CategoryDAOArray();
  private priorityDaoArray = new PriorityDAOArray();

  constructor() {
    // this.fillTasks()
  }

  //начали использовать Dao
  //метод возвращает объект Observable<Task[]> со всеми тасками
  // на который можно подписываться с помощью метода subscribe() в классе главного компонента
  //метод возвращает все таски
  getAllTasks(): Observable<Task[]> {
    return this.taskDaoArray.getAll();
  }
  //метод возвращает все категории
  getAllCategories(): Observable<Category[]>{
    return this.categoryDaoArray.getAll();
  }


  // поиск задач по параметрам
  searchTasks(category: Category, searchText?: string, status?: boolean, priority?: Priority): Observable<Task[]> {
    return this.taskDaoArray.search(category, searchText, status, priority);
  }

  //обновление задачи из диалогового окна
  updateTask(task: Task): Observable<Task> {
    return this.taskDaoArray.update(task);
  }

  deleteTask(id: number): Observable<Task> {
    console.log('coll Service-DeleteTask')
    console.log(id)
    return this.taskDaoArray.delete(id);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.categoryDaoArray.update(category);
  }

  deleteCategory(id: number): Observable<Category> {
    return this.categoryDaoArray.delete(id);
  }

  addTask(task: Task): Observable<Task> {
    return this.taskDaoArray.add(task);
  }

  addCategory(title: string): Observable<Category> {
    return this.categoryDaoArray.add(new Category(null, title));
  }

  searchCategories(title: string): Observable<Category[]> {
    return this.categoryDaoArray.search(title);
  }

  //--------------- статистика ---------------------

  getCompletedCountInCategory(category: Category): Observable<number> {
    return this.taskDaoArray.getCompletedCountInCategory(category);
  }

  getUncompletedTotalCount(): Observable<number> {
    return this.taskDaoArray.getUncompletedCountInCategory(null);
  }

  getUncompletedCountInCategory(category: Category): Observable<number> {
    return this.taskDaoArray.getUncompletedCountInCategory(category);
  }

  getTotalCountInCategory(category: Category): Observable<number> {
    return this.taskDaoArray.getTotalCountInCategory(category);
  }

  // приоритеты

  getAllPriorities(): Observable<Priority[]> {
    return this.priorityDaoArray.getAll();
  }

  addPriority(priority: Priority): Observable<Priority> {
    return this.priorityDaoArray.add(priority);
  }

  deletePriority(id: number): Observable<Priority> {
    return this.priorityDaoArray.delete(id);
  }

  updatePriority(priority: Priority): Observable<Priority> {
    return this.priorityDaoArray.update(priority);
  }
//-------------------------------------------------------



  //Subject - данные на которые подписываются (на него будут подписываться)
  // taskSubject = new Subject<Task[]>();
  // categoriesSubject = new Subject<Category[]>();

  //Observable - издатели - ПОСТОЯННЫЕ поставщики данных
  //BehaviorSubject - данные на которые подписываются (на него будут подписываться)
  //+ BehaviorSubject имеет начальное состояние, задаем в (...), например: (TestData.tasks)
  //+ не надо запускать раздачу методом nexy() - автоматом раздает
  // taskSubject = new BehaviorSubject<Task[]>(TestData.tasks);
  // categoriesSubject = new BehaviorSubject<Category[]>(TestData.categories);

  //вручную инджектим класс в поле этого класса:
  //начали использовать Dao методы которого уже возвращают объект Observable -
  // - те объект который постоянно транслирует(издает) данные -
  // - и подписчики могут постоянно считывать обновление этих данных:



  //пробую получить доступ к методу другого компонента
  //https://question-it.com/questions/318904/kak-vyzvat-metod-iz-odnogo-komponenta-v-drugoj-komponent-v-angular-2
  // @ViewChild(TasksComponent) private _child: { refreshTable: () => void; };


  //при старте приложения издатель уже сигнализирует подписчикам, что есть в подписке TestData.tasks,
  // но при использовании BehaviorSubject, а не Subject метод next() необязателен?






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
  // fillTasksByCategory(category: Category){
  //   //получаем массив отфильтрованных по category тасков
  //   const tasks = TestData.tasks.filter(task => task.category === category);
  //   //осуществляем раздачу отфильтрованных тасков (далее можно поискать - кто их слушает)
  //   this.taskSubject.next(tasks);
  //   console.log('coll servis');
  //   console.log(tasks);
  //
  //   // this.tasksComponent.refreshTable();
  // }

}

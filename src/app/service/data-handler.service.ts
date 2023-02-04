import {Injectable} from '@angular/core';
import {Category} from "../model/Category";
import {TestData} from "../data/TestData";
import {Task} from "../model/Task";
import {BehaviorSubject, Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  //Subject - данные на которые подписываются (на него будут подписываться)
  // taskSubject = new Subject<Task[]>();
  // categoriesSubject = new Subject<Category[]>();

  //BehaviorSubject - данные на которые подписываются (на него будут подписываться)
  //+ имеет начальное состояние, задаем в (...)
  taskSubject = new BehaviorSubject<Task[]>(TestData.tasks);
  categoriesSubject = new BehaviorSubject<Category[]>(TestData.categories);


  //при старте приложения издатель уже сигнализирует подписчикам что есть в подриске TestData.tasks
  constructor() {
    this.fillTasks()
  }

  // getCategories(): Category[] {
  //   return TestData.categories;
  // }

  // getTasks(): Task[]{
  //   return TestData.tasks
  // }
  //сигнализируем всем подписчикам, что поступило новое значение, отсылая им TestData.tasks
  fillTasks(){
    this.taskSubject.next(TestData.tasks);
  }

  // getTasksByCategory(category: Category): Task[]{
  //   const tasks = TestData.tasks.filter(task => task.category === category);
  //   console.log(tasks);
  //   return tasks;
  // }
  //возвращаем массив тасков отфильтрованных по выбранной категории
  //сигнализируем всем подписчикам, что поступило новое значение, отсылая им tasks
  fillTasksByCategory(category: Category){
    const tasks = TestData.tasks.filter(task => task.category === category);
    this.taskSubject.next(tasks);
  }

}

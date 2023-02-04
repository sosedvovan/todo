import {Injectable} from '@angular/core';
import {Category} from "../model/Category";
import {TestData} from "../data/TestData";
import {Task} from "../model/Task";
import {BehaviorSubject, Subject} from "rxjs";


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
  taskSubject = new BehaviorSubject<Task[]>(TestData.tasks);
  categoriesSubject = new BehaviorSubject<Category[]>(TestData.categories);


  //при старте приложения издатель уже сигнализирует подписчикам, что есть в подписке TestData.tasks
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
  //метод next() - осуществляет раздачу данных подписчикам(Observer) -
  //- для этого далее  надо подписаться на получение этих данных с помощью метода subscribe()
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
    //получаем массив отфильтрованных по category тасков
    const tasks = TestData.tasks.filter(task => task.category === category);
    //осуществляем раздачу отфильтрованных тасков
    this.taskSubject.next(tasks);
  }

}

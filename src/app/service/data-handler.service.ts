import {Injectable} from '@angular/core';
import {Category} from "../model/Category";
import {TestData} from "../data/TestData";
import {Task} from "../model/Task";
import {Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  //Subject - данные на которые подписываются (на него будут подписываться)
  taskSubject = new Subject<Task[]>();

  constructor() {
  }

  getCategories(): Category[] {
    return TestData.categories;
  }

  // getTasks(): Task[]{
  //   return TestData.tasks
  // }
  //сигнализируем всем подписчикам, что поступило новое значение
  fillTasks(){
    this.taskSubject.next(TestData.tasks);
  }

  // getTasksByCategory(category: Category): Task[]{
  //   const tasks = TestData.tasks.filter(task => task.category === category);
  //   console.log(tasks);
  //   return tasks;
  // }
  //сигнализируем всем подписчикам, что поступило новое значение
  fillTasksByCategory(category: Category){
    const tasks = TestData.tasks.filter(task => task.category === category);
    this.taskSubject.next(tasks);
  }

}

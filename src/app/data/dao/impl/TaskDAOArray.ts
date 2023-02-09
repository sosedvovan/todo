import {TaskDAO} from "../interface/TaskDAO";
import {Category} from "../../../model/Category";
import {Observable, of} from "rxjs";
import {Priority} from "../../../model/Priority";
import {Task} from 'src/app/model/Task';
import {TestData} from "../../TestData";

export class TaskDAOArray implements TaskDAO {


  getAll(): Observable<Task[]> {
    return of(TestData.tasks);
  }

  get(id: number): Observable<Task> {
    const task: Task | any = TestData.tasks.find(todo => todo.id === id);
    return of(task);
  }


  add(arg0: Task): Observable<Task> {
    //return undefined; пока метод не реализован - возвращаем Observable с абы чем
    return of(TestData.tasks[0]);
  }

  delete(id: number): Observable<Task> {
    //return undefined; пока метод не реализован - возвращаем Observable с абы чем
    return of(TestData.tasks[0]);
  }

  getCompletedCountInCategory(category: Category): Observable<number> {
    //return undefined; пока метод не реализован - возвращаем Observable с абы чем
    return of(1);
  }

  getTotalCount(): Observable<number> {
    //return undefined; пока метод не реализован - возвращаем Observable с абы чем
    return of(1);
  }

  getTotalCountInCategory(category: Category): Observable<number> {
    //return undefined; пока метод не реализован - возвращаем Observable с абы чем
    return of(1);
  }

  getUncompletedCountInCategory(category: Category): Observable<number> {
    //return undefined; пока метод не реализован - возвращаем Observable с абы чем
    return of(1);
  }



  search(category: Category, searchText?: string, status?: boolean, priority?: Priority): Observable<Task[]> {
    //return undefined; пока метод не реализован - возвращаем Observable с абы чем
    return of(this.searchTodos(category, searchText, status, priority));
  }
  private searchTodos(category: Category, searchText?: string, status?: boolean, priority?: Priority): Task[] {
    let allTasks = TestData.tasks;

    if (category != null) {
      allTasks = allTasks.filter(todo => todo.category === category);
    }

    return allTasks; // отфильтрованный массив
  }



  //обновление задачи из диалогового окна
  update(task: Task): Observable<Task> {
    //находим задачу, которую хотим обновить по id
    const taskTmp = TestData.tasks.find(t => t.id === task.id); // обновляем по id
    //удаляем(splice) эту задачу - с какого индекса, сколько удалить, чем заменить
    if (taskTmp instanceof Task) {
      TestData.tasks.splice(TestData.tasks.indexOf(taskTmp), 1, task);
    }
    //возвращаем  Observable<Task>
    return of(task);

  }

}

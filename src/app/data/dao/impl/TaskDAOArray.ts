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
    const task: Task | any = TestData.tasks.find(task => task.id === id);
    return of(task);
  }


  add(arg0: Task): Observable<Task> {
    //return undefined; пока метод не реализован - возвращаем Observable с абы чем
    return of(TestData.tasks[0]);
  }

  delete(id: number): Observable<Task> {
    // console.log('coll TaskDAOArray-DeleteTask-ID')
    // console.log(id)
    const taskTmp: Task | any = TestData.tasks.find(t => t.id === id); // удаляем по id
    // console.log('coll TaskDAOArray-DeleteTask-taskTmp')
    // console.log(taskTmp)
    // console.log(taskTmp instanceof Task) //всегда false ?
    if (taskTmp != null) {
      TestData.tasks.splice(TestData.tasks.indexOf(taskTmp), 1);
    }
    return of(taskTmp);
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


//поиск Observable<Task[]> по всем параметрам(полям)(кроме id и data)
  search(category: Category, searchText?: string, status?: boolean, priority?: Priority): Observable<Task[]> {
    //return undefined; пока метод не реализован - возвращаем Observable с абы чем
    return of(this.searchTodos(category, searchText, status, priority));
  }

  private searchTodos(category: Category, searchText?: string, status?: boolean, priority?: Priority): Task[] {
    //заводим новый массив с тасками, присваивая ему уже имеющийся массив с тасками
    let allTasks = TestData.tasks;

    //фильтруем уже имеющийся массив с тасками по категории
    if (category != null) {
      allTasks = allTasks.filter(task => task.category === category);
    }

    // возвращаем отфильтрованный массив,
    //а если в параметры метода пришел null, тогда возвращается массив
    //со всеми имеющимися категориями - без фильтрации
    return allTasks;
  }


  //обновление задачи из диалогового окна
  //в параметры метода приходит таска с обновленными данными(id только не изменяется никогда)
  update(task: Task): Observable<Task> {
    console.log('update:task:data')
    console.log(task)
    //находим старую задачу, которую хотим обновить по id и записываем ее в переменную taskTmp
    const taskTmp = TestData.tasks.find(t => t.id === task.id); // обновляем по id
    //удаляем(splice) эту задачу - с какого индекса, сколько удалить, чем заменить
    if (taskTmp instanceof Task) {
      TestData.tasks.splice(TestData.tasks.indexOf(taskTmp), 1, task);
    }
    //возвращаем обновленную Observable<Task>
    return of(task);
  }
}

import {PriorityDAO} from "../interface/PriorityDAO";
import {Observable, of} from "rxjs";
import {Priority} from "../../../model/Priority";
import {Task} from "../../../model/Task";
import {TestData} from "../../TestData";

export class PriorityDAOArray implements PriorityDAO {
    add(priority: Priority): Observable<Priority> {
      // если id пустой - генерируем его
      if (priority.id === null || priority.id === 0) {
        priority.id = this.getLastIdPriority();
      }
      TestData.priorities.push(priority);

      return of(priority);
    }

  // нужно только для реализации данных из массивов (т.к. в БД id создается автоматически)
  // генерирует id для нового значения
  private getLastIdPriority(): number {
    return Math.max.apply(Math, TestData.priorities.map(c => c.id)) + 1;
  }


    delete(id: number): Observable<Priority> {
      // перед удалением - нужно в задачах занулить все ссылки на удаленное значение
      // в реальной БД сама обновляет все ссылки (cascade update) - здесь нам приходится делать это вручную (т.к. вместо БД - массив)
      TestData.tasks.forEach(task => {
        if (task.priority && task.priority.id === id) {
          task.priority = null;
        }
      });

      const tmpPriority: any = TestData.priorities.find(t => t.id === id); // удаляем по id
      TestData.priorities.splice(TestData.priorities.indexOf(tmpPriority), 1);

      return of(tmpPriority);
    }


    get(id: number): Observable<Priority> {
      //return undefined; пока метод не реализован - возвращаем Observable с абы чем
      return of(TestData.priorities[id]);
    }


    getAll(): Observable<Priority[]> {
      return of(TestData.priorities);
    }


    update(priority: Priority): Observable<Priority> {
      const tmp: any = TestData.priorities.find(t => t.id === priority.id); // обновляем по id
      TestData.priorities.splice(TestData.priorities.indexOf(tmp), 1, priority);

      return of(priority);
    }

}

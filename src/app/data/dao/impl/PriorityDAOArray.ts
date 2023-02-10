import {PriorityDAO} from "../interface/PriorityDAO";
import {Observable, of} from "rxjs";
import {Priority} from "../../../model/Priority";
import {Task} from "../../../model/Task";
import {TestData} from "../../TestData";

export class PriorityDAOArray implements PriorityDAO {
    add(arg0: Priority): Observable<Priority> {
      //return undefined; пока метод не реализован - возвращаем Observable с абы чем
      return of(TestData.priorities[0]);
    }

    delete(id: number): Observable<Priority> {
      //return undefined; пока метод не реализован - возвращаем Observable с абы чем
      return of(TestData.priorities[0]);
    }

    get(id: number): Observable<Priority> {
      //return undefined; пока метод не реализован - возвращаем Observable с абы чем
      return of(TestData.priorities[0]);
    }

    getAll(): Observable<Priority[]> {
      return of(TestData.priorities);
    }

    update(arg0: Priority): Observable<Priority> {
      //return undefined; пока метод не реализован - возвращаем Observable с абы чем
      return of(TestData.priorities[0]);
    }

}

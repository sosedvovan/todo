import {CategoryDAO} from "../interface/CategoryDAO";
import {Observable, of} from "rxjs";
import {Category} from "../../../model/Category";
import {TestData} from "../../TestData";

export class CategoryDAOArray implements CategoryDAO {


    get(id: number): Observable<Category> {
      //return undefined; пока метод не реализован - возвращаем Observable с абы чем
      return of(TestData.categories[0]);
    }

    getAll(): Observable<Category[]> {
        return of(TestData.categories);
    }


    add(category: Category): Observable<Category> {
      //return undefined; пока метод не реализован - возвращаем Observable с абы чем
      return of(TestData.categories[0]);
    }

    delete(id: number): Observable<Category> {
      //return undefined; пока метод не реализован - возвращаем Observable с абы чем
      return of(TestData.categories[0]);
    }

    update(category: Category): Observable<Category> {
      //return undefined; пока метод не реализован - возвращаем Observable с абы чем
      return of(TestData.categories[0]);
    }


    search(title: string): Observable<Category[]> {
      //return undefined; пока метод не реализован - возвращаем Observable с абы чем
      return of(TestData.categories);
    }


}

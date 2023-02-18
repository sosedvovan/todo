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

      // если id пустой - генерируем его
      if (category.id === null || category.id === 0) {
        category.id = this.getLastIdCategory();
      }

      TestData.categories.push(category);

      return of(category);
    }

  // находит последний id (чтобы потом вставить новую запись с id, увеличенным на 1) - в реальной БД это происходит автоматически
  private getLastIdCategory(): number {
    return Math.max.apply(Math, TestData.categories.map(c => c.id)) + 1;
  }

    /////////////////////////////////////////////////////////////////////////////////////////

    delete(id: number): Observable<Category> {
      // перед удалением - нужно в задачах занулить все ссылки на удаленное значение
      // в реальной БД сама обновляет все ссылки (cascade update) - здесь нам приходится делать это вручную (т.к. вместо БД - массив)
      TestData.tasks.forEach(task => {
        if (task.category && task.category.id === id) {
          task.category = null;
        }
      });

      const tmpCategory: Category | any = TestData.categories.find(t => t.id === id); // удаляем по id
      TestData.categories.splice(TestData.categories.indexOf(tmpCategory), 1);

      return of(tmpCategory);
    }

    ////////////////////////////////////////////////////////////////////////////////////////

    update(category: Category | any): Observable<Category> {
      const tmpCategory: Category | any = TestData.categories.find(t => t.id === category.id); // обновляем по id
      TestData.categories.splice(TestData.categories.indexOf(tmpCategory), 1, category);

      return of(tmpCategory);
    }

    ////////////////////////////////////////////////////////////////////////////////////////

    search(title: string): Observable<Category[]> {
      //у массива вызываем метод filter
      return of(TestData.categories.filter(
        //останутся только те категории у которых title совпадает с переданным title-ом
        //оба делаем в верхнем регистре а в includes оставляем только по вхождению
        cat => cat.title.toUpperCase().includes(title.toUpperCase()))
        //сортируем лексикографически
        .sort((c1, c2) => c1.title.localeCompare(c2.title)));
    }


}

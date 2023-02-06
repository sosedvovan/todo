import {Category} from '../../../model/Category';
import {CommonDAO} from './CommonDAO';
import {Observable} from 'rxjs';

//setting -> TypeScript -> Recompile on charger

// специфичные методы для работы с категориями (которые не входят в обычный CRUD)
export interface CategoryDAO extends CommonDAO<Category> {

  //помним что унаследовали CRUD методы

    // поиск категорий по названию
    search(title: string): Observable<Category[]>;

}

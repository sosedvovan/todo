import {Component, OnInit} from '@angular/core';
import {Category} from "../../model/Category";
import {DataHandlerService} from "../../service/data-handler.service";


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit{

  //хотим чтобы такой массив был виден во вьюхе
  categories: Category[] | undefined;

  //хотим чтобы такая переменная была видна во вьюхе (для выделения выбранного пункта из списка ul-li)
  selectedCategory: Category  | undefined;

  //инжектим с помощью конструктора из контекста наш единственный сервис
  //(теперь далее к нему можно обращаться через this)
  constructor(private dataHandler: DataHandlerService) {
    //и у него получаем нужный массив:
    // this.categories = this.dataHandler.getCategories();

    //тк в Сервисе осуществляется постоянная раздача данных, здесь мы подпишемся на получение этих данных
    //чтобы этими данными инициализировать поле этого класса - categories(которое видно во вьюхе).
    //подписываемся с помощью метода subscribe() в параметрах которого и происходит инициализация поля этого класса - categories
    // this.dataHandler.categoriesSubject.subscribe(categories => this.categories = categories);
    //начали пользоваться ДАО методами, возвращающими объект Observable<Category[]> - подписываемся на него:
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);

  }

  //ДЛЯ ПРИМЕРА: вызывается автоматически после инициализации компонента
  ngOnInit(): void {
    // console.log(this.categories)
  }

  //метод вызываем из html кликом (причем название метода придумываем при работе с html файлом)
  //метод получает категорию по которой кликнули мышкой (обратная связь с пользователем)
  showTaskByCategory(category: Category){
    //этой полученной в параметрах категорией инициализируем поле этого класса, которое тоже видно во вьюхе
    this.selectedCategory = category;
    //в вызываемый метод Сервиса попадет категория по которой кликнул пользователь
    //и в Observable (Издателе) обновятся раздаваемые им данные (отфильтруются по кликнутой категории)
    this.dataHandler.fillTasksByCategory(category);

  }
}

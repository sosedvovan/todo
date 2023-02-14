import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category} from "../../model/Category";
import {DataHandlerService} from "../../service/data-handler.service";


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
//это дочерний компонент
export class CategoriesComponent implements OnInit{

  //хотим чтобы такой массив был виден во вьюхе
  //это текущие категории для отображения на странице
  //с помощью директивы @Input() принимаем массив categories из родительского html
  @Input()
  categories: Category[] | undefined;

  // выбрали категорию из списка
  //когда emit() запускает этот @Output() - в родительском app.component.html
  //сработает директива (selectCategory)="onSelectCategory($event)"
  //где $event это то что передали в методе : emit(this.selectedCategory)
  @Output()
  selectCategory = new EventEmitter<Category>();

  //хотим чтобы такая переменная была видна во вьюхе
  // (для выделения выбранного пункта из списка ul-li)
  // [ngClass]="{'active': category !== selectedCategory
  @Input()
  selectedCategory: Category  | any;

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
    // this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);

  }

  //ДЛЯ ПРИМЕРА: вызывается автоматически после инициализации компонента
  ngOnInit(): void {
    // console.log(this.categories)
    this.selectedCategory = null;
    // console.log('call ngOnInit()')
    // console.log(this.selectedCategory)
  }

  //метод вызываем из html кликом (причем название метода придумываем при работе с html файлом)
  //метод получает категорию по которой кликнули мышкой (обратная связь с пользователем)
  showTaskByCategory(category?: Category | any){

    console.log('showTaskByCategory() START')
    console.log(this.selectedCategory)

    // если не изменилось значение, ничего не делать (чтобы лишний раз не делать запрос данных)
    if (this.selectedCategory === category) {
      return;
    }

    this.selectedCategory = category; // сохраняем выбранную категорию

    // вызываем внешний обработчик и передаем туда выбранную категорию
    //emit() запускает @Output()
    this.selectCategory.emit(this.selectedCategory);


    //этой полученной в параметрах категорией инициализируем поле этого класса, которое тоже видно во вьюхе
    // this.selectedCategory = category;
    //в вызываемый метод Сервиса попадет категория по которой кликнул пользователь
    //и в Observable (Издателе) обновятся раздаваемые им данные (отфильтруются по кликнутой категории)
    // this.dataHandler.fillTasksByCategory(category);

  }

// для отображения иконки редактирования при наведении на категорию
  public indexMouseMove: number | any;

  // сохраняет индекс записи категории, над который в данный момент проходит мышка (и там отображается иконка редактирования)
  public showEditIcon(index: number | any) {
    this.indexMouseMove = index;

  }


}

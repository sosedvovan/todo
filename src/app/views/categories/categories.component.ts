import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category} from "../../model/Category";
import {DataHandlerService} from "../../service/data-handler.service";
import {EditCategoryDialogComponent} from "../../dialog/edit-category-dialog/edit-category-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {OperType} from "../../dialog/OperType";


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
  categories: Category[] | any;

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


  // удалили категорию
  @Output()
  deleteCategory = new EventEmitter<Category>();

  // изменили категорию
  @Output()
  updateCategory = new EventEmitter<Category>();

  //инжектим с помощью конструктора из контекста наш единственный сервис
  //(теперь далее к нему можно обращаться через this)
  constructor(private dataHandler: DataHandlerService,
              // внедряем MatDialog, чтобы работать с диалоговыми окнами)
              private dialog: MatDialog)  {
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

  // диалоговое окно для редактирования категории при нажатии
  // на иконку карандаша в левом списке категорий
  public openEditDialog(category: Category) {
    //открываем диалоговое окно EditCategoryDialogComponent и
    //передаем в него data: [...] - 2-е стринги для отображения в нем и его размер
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [category.title, 'Редактирование категории', OperType.EDIT],
      width: '500px'
    });

    //при закрытии диалогового окна(нажатие какой то кнопки в нем)
    //здесь обрабатываем результат
    dialogRef.afterClosed().subscribe(result => {

      // нажали удалить
      if (result === 'delete') {

        // вызываем внешний обработчик - отправляемся в главную компоненту
        //для внесения изменений в дб
        this.deleteCategory.emit(category);

        return;
      }

      // нажали сохранить - тогда в result придет строка с category.title
      // и мы проверим что это действительно стринга пришла
      //так еще можно сказать: if (result as string) {...
      if (typeof (result) === 'string') {
        category.title = result as string; // Кастинг: result as string

        this.updateCategory.emit(category); // вызываем внешний обработчик
        return;
      }
    });
  }

  ///////////////////////////////////////////////////////////////////
  // диалоговое окно для добавления категории при нажатии кнопки + //
  ///////////////////////////////////////////////////////////////////

  // добавили категорию - отослали в смарт компонент результат работы
  // открывшегося диалогового окна
  @Output()
  addCategory = new EventEmitter<string>(); // передаем только название новой категории

  // диалоговое окно для добавления категории при нажатии кнопки +
  public openAddDialog() {

    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {data: ['', 'Добавление категории', OperType.ADD], width: '400px'});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addCategory.emit(result as string); // вызываем внешний обработчик
      }
    });
  }

  ///////////////////////////////////////////////
  // поле ввода вхождения для поиска категории //
  ///////////////////////////////////////////////

  // поиск категории запускаем с помощью emit()
  @Output()
  searchCategory = new EventEmitter<string>(); // передаем строку для поиска

  // текущее значение для поиска категорий (переменную придумали в html)
  public searchCategoryTitle: string;

  // поиск категории (запускаем нажатием клавиши в поле поиска  вхождения для категории)
  public search() {
    //если переменная стала null - (нажали на суб-кнопку очистки)
    //тогда выходим из этого метода
    if (this.searchCategoryTitle == null ) {
      return;
    }
    //emit запускает @Output()
    this.searchCategory.emit(this.searchCategoryTitle);

  }


}

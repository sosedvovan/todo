import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AboutDialogComponent} from "../../dialog/about-dialog/about-dialog.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  public year: Date;
  public site = 'https://javabegin.ru/';
  public blog = 'https://javabegin.ru/blog/tag/angular/';
  public siteName = 'JavaBegin';

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.year = new Date(); // текуший год
  }

  //открываем окно "О программе" без обработки ответного результата
  public openAboutDialog() {
    this.dialog.open(AboutDialogComponent,
      {
        autoFocus: false,
        data: {
          dialogTitle: 'О программе',
          message: 'Данное приложение было создано для видеокурса "Angular для начинающих" на сайте javabegin.ru'
        },
        width: '500px'
      });

  }

}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SettingsDialogComponent} from "../../dialog/settings-dialog/settings-dialog.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  @Input()
  categoryName: string;


  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

/////////////////////////////////
// показать/скрыть статистику  //
/////////////////////////////////

  @Input()
  public showStat: boolean;

  @Output()
  toggleStat = new EventEmitter<boolean>();

  //showStat меняет на !showStat и отправляет в смарт
  public onToggleStat() {
    this.toggleStat.emit(!this.showStat); // вкл/выкл статистику
  }


  // открываем окно настроек для цветов приоритетов
  public showSettings() {
    const dialogRef = this.dialog.open(SettingsDialogComponent,
      {
        autoFocus: false,
        width: '500px'
      });

    // никаких действий не требуется после закрытия окна

  }


}

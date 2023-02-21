import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  @Input()
  categoryName: string;


  constructor() {
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


}

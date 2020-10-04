import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewChecked {

  public currentLanguage = 'es';

  @Output() public sidenavToggle = new EventEmitter();
  @Output() public changeLanguage = new EventEmitter();

  constructor(public translate: TranslateService, private cdRef : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getCurrentLanguage();
  }
  ngAfterViewChecked() {
      this.cdRef.detectChanges();
  }

  getCurrentLanguage(){
    this.currentLanguage = this.translate.currentLang;
  }

  setLanguageSelected(selectedLanguage){
    this.translate.use(selectedLanguage);
    this.changeLanguage.emit(selectedLanguage);
  }

  public onToggleSidenav = () => { 
    this.sidenavToggle.emit();
  }

}

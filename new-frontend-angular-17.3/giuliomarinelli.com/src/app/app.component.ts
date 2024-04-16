import { Component, ElementRef, ViewChild } from '@angular/core';
import { ViewportRuler } from '@angular/cdk/scrolling';

@Component({
  selector: '#root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private viewportRuler: ViewportRuler) { }

  title = 'giuliomarinelli.com';

  @ViewChild('header') private headerEl!: ElementRef
  @ViewChild('footer') private footerEl!: ElementRef

  protected minPageheight!: number

  ngAfterViewInit() {
    // const headerH = this.headerEl?.nativeElement.clientHeight
    // console.log(this.footerEl?.nativeElement)
    // const footerH = this.footerEl?.nativeElement.clientHeight
    // const { height } = this.viewportRuler.getViewportRect()
    // this.minPageheight = height - headerH - footerH
    // console.log(this.minPageheight)

  }

}

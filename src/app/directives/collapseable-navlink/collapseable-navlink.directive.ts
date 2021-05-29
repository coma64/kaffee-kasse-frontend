import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appCollapseableNavlink]',
})
export class CollapseableNavlinkDirective implements OnInit {
  @Input() appCollapseableNavlink!: string;
  @Input() collapseBreakpoint = 991;

  constructor(private element: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    if (this.appCollapseableNavlink === '')
      throw new Error(
        "Property 'appCollapseableNavlink' should contain the id of the target element, e.g. '#navbar'"
      );

    this.onResize();
  }

  @HostListener('window:resize')
  private onResize(): void {
    this.setAttributes();
  }

  private setAttributes(): void {
    const nativeElement = this.element.nativeElement;
    if (
      window.innerWidth > this.collapseBreakpoint &&
      nativeElement.attributes.getNamedItem('data-bs-toggle') != undefined
    ) {
      nativeElement.removeAttribute('data-bs-toggle');
      nativeElement.removeAttribute('data-bs-target');
    } else if (
      window.innerWidth <= this.collapseBreakpoint &&
      nativeElement.attributes.getNamedItem('data-bs-toggle') == undefined
    ) {
      nativeElement.setAttribute('data-bs-toggle', 'collapse');
      nativeElement.setAttribute('data-bs-target', this.appCollapseableNavlink);
    }
  }
}

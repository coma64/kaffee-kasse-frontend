import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[appBalanceHighlight]',
})
export class BalanceHighlightDirective implements OnInit, OnChanges {
  @Input() appBalanceHighlight: number | undefined | null;

  constructor(private element: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.setElementColor();
  }

  ngOnChanges(): void {
    this.setElementColor();
  }

  private setElementColor(): void {
    const classList = this.element.nativeElement.classList;
    const balance = this.appBalanceHighlight;

    if (balance == undefined) return;

    if (balance >= 0.0 && !classList.contains('text-success'))
      classList.add('text-success');
    else if (balance < 0.0 && !classList.contains('text-danger'))
      classList.add('text-danger');
  }
}

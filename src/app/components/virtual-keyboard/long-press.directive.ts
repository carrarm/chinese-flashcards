import { Directive, ElementRef, EventEmitter, OnDestroy, Output } from "@angular/core";
import { Subscription, filter, fromEvent, map, merge, of, switchMap, timer } from "rxjs";

/**
 * Use this directive to detect long press events (at least 500ms) on any
 * HTML element.
 */
@Directive({
  selector: "[chfLongPress]",
  standalone: true,
})
export class LongPressDirective implements OnDestroy {
  @Output() longPress = new EventEmitter<void>();

  private events$: Subscription;
  private pressDuration = 500;

  constructor(elementRef: ElementRef) {
    const mouseDown$ = fromEvent<MouseEvent>(elementRef.nativeElement, "mousedown").pipe(
      filter((event) => event.button === 0), // Only allow left button
      map(() => true)
    );

    const mouseUp$ = fromEvent<MouseEvent>(elementRef.nativeElement, "mouseup").pipe(
      filter((event) => event.button === 0), // Only allow left button
      map(() => false)
    );

    const touchStart$ = fromEvent(elementRef.nativeElement, "touchstart").pipe(
      map(() => true)
    );

    const touchEnd$ = fromEvent(elementRef.nativeElement, "touchend").pipe(
      map(() => false)
    );

    this.events$ = merge(mouseDown$, mouseUp$, touchStart$, touchEnd$)
      .pipe(
        switchMap((isPressing) => (isPressing ? timer(this.pressDuration) : of(null))),
        filter((value) => value !== null)
      )
      .subscribe(() => this.longPress.emit());
  }

  ngOnDestroy(): void {
    if (this.events$) {
      this.events$.unsubscribe();
    }
  }
}

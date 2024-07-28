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
  @Output() longPress = new EventEmitter<Event>();

  private events$: Subscription;
  private pressDuration = 500;

  constructor(elementRef: ElementRef) {
    const mouseDown$ = fromEvent<MouseEvent>(elementRef.nativeElement, "mousedown").pipe(
      filter(this.isLeftClickEvent),
      map((event) => ({ isPressing: true, event }))
    );

    const mouseUp$ = fromEvent<MouseEvent>(elementRef.nativeElement, "mouseup").pipe(
      filter(this.isLeftClickEvent),
      map((event) => ({ isPressing: false, event }))
    );

    const touchStart$ = fromEvent<Event>(elementRef.nativeElement, "touchstart").pipe(
      map((event) => ({ isPressing: true, event }))
    );

    const touchEnd$ = fromEvent<Event>(elementRef.nativeElement, "touchend").pipe(
      map((event) => ({ isPressing: false, event }))
    );

    this.events$ = merge(mouseDown$, mouseUp$, touchStart$, touchEnd$)
      .pipe(
        switchMap((event) =>
          event.isPressing ? timer(this.pressDuration).pipe(map(() => event)) : of(null)
        ),
        filter((value) => value !== null)
      )
      .subscribe((event) => this.longPress.emit(event!.event));
  }

  ngOnDestroy(): void {
    if (this.events$) {
      this.events$.unsubscribe();
    }
  }

  private isLeftClickEvent(event: MouseEvent): boolean {
    return event.button === 0;
  }
}

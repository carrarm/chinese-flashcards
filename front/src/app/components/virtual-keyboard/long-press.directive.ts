import { Directive, ElementRef, inject, output } from "@angular/core";
import { filter, fromEvent, map, merge, of, switchMap, timer } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

/**
 * Use this directive to detect long press events (at least 500ms) on any
 * HTML element.
 */
@Directive({
  selector: "[chfLongPress]",
})
export class LongPressDirective {
  public readonly longPress = output<Event>();

  private readonly elementRef = inject(ElementRef);

  private pressDuration = 500;

  constructor() {
    const mouseDown$ = fromEvent<MouseEvent>(
      this.elementRef.nativeElement,
      "mousedown"
    ).pipe(
      filter(this.isLeftClickEvent),
      map((event) => ({ isPressing: true, event }))
    );

    const mouseUp$ = fromEvent<MouseEvent>(this.elementRef.nativeElement, "mouseup").pipe(
      filter(this.isLeftClickEvent),
      map((event) => ({ isPressing: false, event }))
    );

    const touchStart$ = fromEvent<Event>(
      this.elementRef.nativeElement,
      "touchstart"
    ).pipe(map((event) => ({ isPressing: true, event })));

    const touchEnd$ = fromEvent<Event>(this.elementRef.nativeElement, "touchend").pipe(
      map((event) => ({ isPressing: false, event }))
    );

    merge(mouseDown$, mouseUp$, touchStart$, touchEnd$)
      .pipe(
        takeUntilDestroyed(),
        switchMap((event) =>
          event.isPressing ? timer(this.pressDuration).pipe(map(() => event)) : of(null)
        ),
        filter((value) => value !== null)
      )
      .subscribe((event) => this.longPress.emit(event!.event));
  }

  private isLeftClickEvent(event: MouseEvent): boolean {
    return event.button === 0;
  }
}

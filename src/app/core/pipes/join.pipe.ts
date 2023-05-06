import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "join",
  standalone: true,
})
export class JoinPipe implements PipeTransform {
  transform(values: string[], delimiter: string): unknown {
    return values.join(delimiter);
  }
}

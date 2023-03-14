import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "cardMeanings",
  standalone: true,
})
export class CardMeaningsPipe implements PipeTransform {
  transform(meanings: string[]): string {
    return meanings.length === 1
      ? meanings[0]
      : meanings.map((meaning, index) => `${index + 1}. ${meaning}`).join("<br/>");
  }
}

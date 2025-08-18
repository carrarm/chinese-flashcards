import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import {
  faAdd,
  faArrowRight,
  faBox,
  faBoxOpen,
  faCheck,
  faCheckCircle,
  faCheckToSlot,
  faChevronLeft,
  faChevronRight,
  faCircleXmark,
  faClose,
  faEdit,
  faFaceLaugh,
  faFaceSadTear,
  faFaceSmile,
  faKeyboard,
  faMagnifyingGlass,
  faRotateLeft,
  faShareFromSquare,
  faTrash,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export const SOLID_ICONS = {
  faAdd,
  faBox,
  faBoxOpen,
  faCheck,
  faCheckCircle,
  faCheckToSlot,
  faChevronLeft,
  faChevronRight,
  faCircleXmark,
  faClose,
  faEdit,
  faFaceLaugh,
  faFaceSadTear,
  faFaceSmile,
  faKeyboard,
  faMagnifyingGlass,
  faRotateLeft,
  faShareFromSquare,
  faTrash,
  faArrowRight,
  faTriangleExclamation,
};

export function registerIcons(
  faLibrary: FaIconLibrary,
  iconRegistry: MatIconRegistry,
  domSanitizer: DomSanitizer
): void {
  addSvgIcon(iconRegistry, domSanitizer, "face-sob", "face-sad-cry-solid");
  addSvgIcon(iconRegistry, domSanitizer, "face-laugh", "face-laugh-beam-solid");
  addSvgIcon(iconRegistry, domSanitizer, "face-smile", "face-smile-solid");
  faLibrary.addIcons(...Object.values(SOLID_ICONS));
}

function addSvgIcon(
  iconRegistry: MatIconRegistry,
  domSanitizer: DomSanitizer,
  name: string,
  icon: string
): void {
  iconRegistry.addSvgIcon(
    name,
    domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/" + icon + ".svg")
  );
}

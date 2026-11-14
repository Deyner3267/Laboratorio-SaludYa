import type { GeneradorId } from "../../application/puertos";

export class GeneradorIdSecuencial implements GeneradorId {
  private siguiente = 0;

  nuevo(): string {
    this.siguiente += 1;
    return `cita-${this.siguiente}`;
  }
}

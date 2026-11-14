import { Cita } from "./cita";
import { CitaNoEncontradaError, CruceDeHorarioError } from "./errores";

export class Agenda {
  private readonly citasAgendadas: Cita[];

  constructor(
    readonly medicoId: string,
    citas: Cita[] = [],
  ) {
    this.citasAgendadas = [...citas];
  }

  agendar(cita: Cita): void {
    if (this.citasAgendadas.some((existente) => existente.activa() && existente.rango.seCruzaCon(cita.rango))) {
      throw new CruceDeHorarioError();
    }
    this.citasAgendadas.push(cita);
  }

  cancelar(citaId: string): void {
    const cita = this.citasAgendadas.find((actual) => actual.id === citaId);
    if (!cita) {
      throw new CitaNoEncontradaError();
    }
    cita.cancelar();
  }

  citas(): Cita[] {
    return [...this.citasAgendadas];
  }
}

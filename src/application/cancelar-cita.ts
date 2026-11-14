import type { AgendaRepositorio } from "../domain/agenda-repositorio";
import type { EventBus } from "./puertos";

export interface ComandoCancelarCita {
  medicoId: string;
  citaId: string;
}

export class CancelarCita {
  constructor(
    private readonly agendas: AgendaRepositorio,
    private readonly eventos: EventBus,
  ) {}

  async ejecutar(comando: ComandoCancelarCita): Promise<void> {
    const agenda = await this.agendas.porMedico(comando.medicoId);
    agenda.cancelar(comando.citaId);
    await this.agendas.guardar(agenda);
    await this.eventos.emit("cita.cancelada", { citaId: comando.citaId, medicoId: comando.medicoId });
  }
}

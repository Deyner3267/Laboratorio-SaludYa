import type { AgendaRepositorio } from "../domain/agenda-repositorio";
import { Cita } from "../domain/cita";
import { RangoHorario } from "../domain/rango-horario";
import type { EventBus, GeneradorId } from "./puertos";

export interface ComandoAgendarCita {
  medicoId: string;
  pacienteId: string;
  inicio: Date;
  fin: Date;
}

export class AgendarCita {
  constructor(
    private readonly agendas: AgendaRepositorio,
    private readonly eventos: EventBus,
    private readonly ids: GeneradorId,
  ) {}

  async ejecutar(comando: ComandoAgendarCita): Promise<string> {
    const rango = RangoHorario.crear(comando.inicio, comando.fin);
    const agenda = await this.agendas.porMedico(comando.medicoId);
    const id = this.ids.nuevo();
    agenda.agendar(Cita.nueva(id, comando.pacienteId, rango));
    await this.agendas.guardar(agenda);
    await this.eventos.emit("cita.confirmada", { citaId: id, medicoId: comando.medicoId });
    return id;
  }
}

import { Agenda } from "../../domain/agenda";
import type { AgendaRepositorio } from "../../domain/agenda-repositorio";
import { Cita } from "../../domain/cita";
import { RangoHorario } from "../../domain/rango-horario";

export class AgendaRepositorioMemoria implements AgendaRepositorio {
  private readonly datos = new Map<string, Agenda>();

  async porMedico(medicoId: string): Promise<Agenda> {
    const agenda = this.datos.get(medicoId);
    return agenda ? this.copiar(agenda) : new Agenda(medicoId);
  }

  async guardar(agenda: Agenda): Promise<void> {
    this.datos.set(agenda.medicoId, this.copiar(agenda));
  }

  private copiar(agenda: Agenda): Agenda {
    const citas = agenda.citas().map((cita) =>
      Cita.reconstruir(
        cita.id,
        cita.pacienteId,
        RangoHorario.crear(cita.rango.inicio, cita.rango.fin),
        cita.estado,
      ),
    );
    return new Agenda(agenda.medicoId, citas);
  }
}

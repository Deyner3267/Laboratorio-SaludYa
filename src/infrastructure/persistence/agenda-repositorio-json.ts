import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { Agenda } from "../../domain/agenda";
import type { AgendaRepositorio } from "../../domain/agenda-repositorio";
import { Cita, type EstadoCita } from "../../domain/cita";
import { RangoHorario } from "../../domain/rango-horario";

interface CitaGuardada {
  id: string;
  pacienteId: string;
  inicio: string;
  fin: string;
  estado: EstadoCita;
}

type AgendasGuardadas = Record<string, CitaGuardada[]>;

export class AgendaRepositorioJson implements AgendaRepositorio {
  constructor(private readonly ruta: string) {}

  async porMedico(medicoId: string): Promise<Agenda> {
    const datos = await this.leer();
    const citas = (datos[medicoId] ?? []).map((cita) =>
      Cita.reconstruir(
        cita.id,
        cita.pacienteId,
        RangoHorario.crear(new Date(cita.inicio), new Date(cita.fin)),
        cita.estado,
      ),
    );
    return new Agenda(medicoId, citas);
  }

  async guardar(agenda: Agenda): Promise<void> {
    const datos = await this.leer();
    datos[agenda.medicoId] = agenda.citas().map((cita) => ({
      id: cita.id,
      pacienteId: cita.pacienteId,
      inicio: cita.rango.inicio.toISOString(),
      fin: cita.rango.fin.toISOString(),
      estado: cita.estado,
    }));
    await mkdir(dirname(this.ruta), { recursive: true });
    await writeFile(this.ruta, JSON.stringify(datos), "utf8");
  }

  private async leer(): Promise<AgendasGuardadas> {
    try {
      return JSON.parse(await readFile(this.ruta, "utf8")) as AgendasGuardadas;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
      throw error;
    }
  }
}

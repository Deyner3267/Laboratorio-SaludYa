import { AgendarCita } from "./application/agendar-cita";
import { CancelarCita } from "./application/cancelar-cita";
import type { AgendaRepositorio } from "./domain/agenda-repositorio";
import { CitasController } from "./infrastructure/http/citas-controller";
import { GeneradorIdSecuencial } from "./infrastructure/id/generador-id-secuencial";
import { EventBusMemoria } from "./infrastructure/messaging/event-bus-memoria";
import { AgendaRepositorioJson } from "./infrastructure/persistence/agenda-repositorio-json";
import { AgendaRepositorioMemoria } from "./infrastructure/persistence/agenda-repositorio-memoria";

export type Persistencia = { tipo: "memoria" } | { tipo: "json"; ruta: string };

export function crearApp(persistencia: Persistencia) {
  const agendas: AgendaRepositorio = persistencia.tipo === "memoria"
    ? new AgendaRepositorioMemoria()
    : new AgendaRepositorioJson(persistencia.ruta);
  const eventos = new EventBusMemoria();
  const ids = new GeneradorIdSecuencial();
  const agendar = new AgendarCita(agendas, eventos, ids);
  const cancelar = new CancelarCita(agendas, eventos);
  const controller = new CitasController(agendar);

  return { agendas, eventos, agendar, cancelar, controller };
}

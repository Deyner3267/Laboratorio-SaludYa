import { AgendarCita } from "../../application/agendar-cita";
import { CruceDeHorarioError, RangoInvalidoError } from "../../domain/errores";

interface SolicitudCita {
  medicoId?: string;
  pacienteId?: string;
  inicio?: string;
  fin?: string;
}

export class CitasController {
  constructor(private readonly agendar: AgendarCita) {}

  async post(solicitud: SolicitudCita): Promise<{ status: number; citaId?: string }> {
    if (!solicitud.medicoId || !solicitud.pacienteId || !solicitud.inicio || !solicitud.fin) {
      return { status: 400 };
    }

    const inicio = new Date(solicitud.inicio);
    const fin = new Date(solicitud.fin);
    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
      return { status: 400 };
    }

    try {
      const citaId = await this.agendar.ejecutar({
        medicoId: solicitud.medicoId,
        pacienteId: solicitud.pacienteId,
        inicio,
        fin,
      });
      return { status: 201, citaId };
    } catch (error) {
      if (error instanceof CruceDeHorarioError) return { status: 409 };
      if (error instanceof RangoInvalidoError) return { status: 400 };
      throw error;
    }
  }
}

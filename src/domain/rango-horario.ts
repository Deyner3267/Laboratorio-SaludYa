import { RangoInvalidoError } from "./errores";

export class RangoHorario {
  private constructor(
    private readonly inicioMs: number,
    private readonly finMs: number,
  ) {}

  static crear(inicio: Date, fin: Date): RangoHorario {
    const inicioMs = inicio.getTime();
    const finMs = fin.getTime();
    if (!Number.isFinite(inicioMs) || !Number.isFinite(finMs) || finMs <= inicioMs) {
      throw new RangoInvalidoError();
    }
    return new RangoHorario(inicioMs, finMs);
  }

  get inicio(): Date {
    return new Date(this.inicioMs);
  }

  get fin(): Date {
    return new Date(this.finMs);
  }

  duracionMinutos(): number {
    return (this.finMs - this.inicioMs) / 60_000;
  }

  seCruzaCon(otro: RangoHorario): boolean {
    return this.inicioMs < otro.finMs && otro.inicioMs < this.finMs;
  }

  igualA(otro: RangoHorario): boolean {
    return this.inicioMs === otro.inicioMs && this.finMs === otro.finMs;
  }
}

export class RangoInvalidoError extends Error {
  constructor() {
    super("El fin del rango debe ser posterior al inicio");
    this.name = "RangoInvalidoError";
  }
}

export class CitaYaCanceladaError extends Error {
  constructor() {
    super("La cita ya está cancelada");
    this.name = "CitaYaCanceladaError";
  }
}

export class CruceDeHorarioError extends Error {
  constructor() {
    super("La cita se cruza con otra cita activa");
    this.name = "CruceDeHorarioError";
  }
}

export class CitaNoEncontradaError extends Error {
  constructor() {
    super("No se encontró la cita");
    this.name = "CitaNoEncontradaError";
  }
}

import { DetalleDeEntrega } from "./detalleDeEntrega";

export class HojaDeRuta {
    constructor(
        private readonly _id: string,
        private _fecha: Date,
        private _chofer: string,
        private _entregas: DetalleDeEntrega[] = []
    ) { }

    // Regla de negocio: Calcular cuántos bultos lleva la camioneta hoy
    get totalBultos(): number {
        return this._entregas.reduce((acc, entrega) => acc + entrega.toPrimitives().cantidad, 0);
    }

    // Saber cuánto falta para terminar el día
    get progreso(): string {
        const completadas = this._entregas.filter(e => e.entregado).length;
        return `${completadas}/${this._entregas.length}`;
    }
}
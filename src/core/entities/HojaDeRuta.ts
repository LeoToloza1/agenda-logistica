import { DetalleDeEntrega } from "./detalleDeEntrega.js";
import { EstadoEntrega } from "./enums/EstadoEntrega.js";

export class HojaDeRuta {
    constructor(
        private readonly _id: string,
        private _fecha: Date,
        private _chofer: string,
        private _entregas: DetalleDeEntrega[] = []
    ) { }

    // 1. Corregimos el progreso para que use el Enum
    get progreso(): string {
        const completadas = this._entregas.filter(
            e => e.entregado === EstadoEntrega.ENTREGADO
        ).length;
        return `${completadas}/${this._entregas.length}`;
    }

    // 2. Útil para mostrar todos los pines en un mapa en la PWA
    get mapaDeRuta() {
        return this._entregas.map(e => ({
            de: e.numeroDE,
            obra: e.obra,
            cliente: e.cliente.nombreCompleto,
            coords: e.toPrimitives().latitud !== 0 ? {
                lat: e.toPrimitives().latitud,
                lng: e.toPrimitives().longitud
            } : null
        }));
    }

    // Reglas de negocio existentes mejoradas
    get totalBultos(): number {
        return this._entregas.reduce((acc, entrega) => acc + entrega.cantidad, 0);
    }

    get estaFinalizada(): boolean {
        return this._entregas.every(e =>
            e.entregado === EstadoEntrega.ENTREGADO || e.entregado === EstadoEntrega.FALLIDO
        );
    }

    get tieneAlertas(): boolean {
        return this._entregas.some(e => e.entregado === EstadoEntrega.FALLIDO);
    }

    get resumenCarga() {
        return this._entregas.reduce((resumen: any, entrega) => {
            const tipo = entrega.tipo;
            resumen[tipo] = (resumen[tipo] || 0) + entrega.cantidad;
            return resumen;
        }, {});
    }

    // Getters y métodos de acción
    get id() { return this._id; }
    get entregas() { return [...this._entregas]; } // Devolvemos copia para proteger el array original
    get fecha() { return this._fecha; }
    get chofer() { return this._chofer; }

    public agregarEntrega(entrega: DetalleDeEntrega) {
        this._entregas.push(entrega);
    }

    public toPrimitives() {
        return {
            id: this._id,
            fecha: this._fecha.toISOString(),
            chofer: this._chofer,
            total_entregas: this._entregas.length,
            bultos_totales: this.totalBultos,
            resumen: this.resumenCarga
        };
    }
}
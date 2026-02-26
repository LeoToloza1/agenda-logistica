import { Cliente } from "./Cliente.js";
import { TipoProducto } from "./enums/tipo-producto.js";
import { EntregaInvalidaException } from "./exceptions/entregaInvalida.js";

export class DetalleDeEntrega {
    constructor(
        private readonly _id: number | null,
        private readonly _numeroDE: number,
        private _cantidad: number,
        private _cliente: Cliente,
        private _tipo: TipoProducto,
        private _confirmado: boolean = false,
        private _entregado: boolean = false,
        private _entregadoPor: string = "",
        private _fechaDeEntrega: Date | null = null,
        private _observaciones: string = ""
    ) { }

    /**
     * Registra la entrega de un producto.
     * 
     * @throws {EntregaInvalidaException} Si la entrega no ha sido confirmada por administración.
     * @param {string} nombreChofer - Nombre de la persona que hizo la entrega.
     */
    public registrarEntrega(nombreChofer: string): void {
        if (!this._confirmado) {
            throw new EntregaInvalidaException(this._numeroDE, "No confirmada por administración.");
        }

        this._entregado = true;
        this._entregadoPor = nombreChofer;
        this._fechaDeEntrega = new Date();
    }

    // Getters
    get id() { return this._id; }
    get numeroDE() { return this._numeroDE; }
    get cliente() { return this._cliente; }
    get entregado() { return this._entregado; }

    /**
     * Devuelve los datos planos para guardar en Postgres
     */
    public toPrimitives() {
        return {
            id: this._id,
            numero_de: this._numeroDE,
            cantidad: this._cantidad,
            cliente_id: this._cliente.id,
            tipo_producto: this._tipo,
            confirmado: this._confirmado,
            entregado: this._entregado,
            entregado_por: this._entregadoPor,
            fecha_entrega: this._fechaDeEntrega,
            observaciones: this._observaciones
        };
    }
}
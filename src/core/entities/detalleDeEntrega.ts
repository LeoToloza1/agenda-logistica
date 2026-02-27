import { Cliente } from "./Cliente.js";
import { EstadoEntrega } from "./enums/EstadoEntrega.js";
import { TipoProducto } from "./enums/tipo-producto.js";
import { Ubicacion } from "./value-object/Ubicacion.js";
import { EntregaInvalidaException } from "../exceptions/entregaInvalida.js";

export class DetalleDeEntrega {
    constructor(
        private readonly _id: number | null,
        private readonly _numeroDE: number,
        private _cantidad: number,
        private _cliente: Cliente,
        private _tipo: TipoProducto,
        private _obra: string = 'Particular',
        private _ubicacion: Ubicacion,
        private _contactoResponsable: string = "",
        private _confirmado: boolean = false,
        private _entregado: EstadoEntrega = EstadoEntrega.PENDIENTE,
        private _entregadoPor: string = "",
        private _fechaDeEntrega: Date | null = null,
        private _observaciones: string = ""
    ) { }

    // Factory method actualizado para procesar el string de GPS
    /**
     *  static crearDesdeExcel(params: any, cliente: Cliente): DetalleDeEntrega {
         return new DetalleDeEntrega(
             null,
             params.numeroDE,
             params.cantidad,
             cliente,
             params.tipo,
             params.obra,
             Ubicacion.crearDesdeString(params.ubicacionRaw),
             params.contactoResponsable,
             params.confirmado
         );
     }*/

    get id() { return this._id; }
    get numeroDE() { return this._numeroDE; }
    get cantidad() { return this._cantidad; }
    get cliente() { return this._cliente; }
    get tipo() { return this._tipo; }
    get obra() { return this._obra; }
    get ubicacion() { return this._ubicacion; }
    get contactoResponsable() { return this._contactoResponsable; }
    get confirmado() { return this._confirmado; }
    get entregado() { return this._entregado; }
    get entregadoPor() { return this._entregadoPor; }
    get fechaDeEntrega() { return this._fechaDeEntrega; }
    get observaciones() { return this._observaciones; }


    public registrarEntrega(nombreChofer: string): void {
        if (!this._confirmado) {
            throw new EntregaInvalidaException(this._numeroDE, "No confirmada por administración.");
        }
        this._entregado = EstadoEntrega.ENTREGADO;
        this._entregadoPor = nombreChofer;
        this._fechaDeEntrega = new Date();
    }

    public toPrimitives() {
        return {
            id: this._id,
            numero_de: this._numeroDE,
            cantidad: this._cantidad,
            cliente_id: this._cliente.id,
            obra: this._obra,
            contacto_responsable: this._contactoResponsable,
            latitud: this._ubicacion.lat,
            longitud: this._ubicacion.lng,
            google_maps_url: this._ubicacion.linkOriginal,
            tipo_producto: this._tipo,
            confirmado: this._confirmado,
            entregado: this._entregado,
            entregado_por: this._entregadoPor,
            fecha_entrega: this._fechaDeEntrega,
            observaciones: this._observaciones
        };
    }
}
import { Ubicacion } from "./value-object/Ubicacion.js";

export class Cliente {

    constructor(
        private readonly _id: number,
        private _nombre: string,
        private _apellido: string,
        private _localidad: string,
        private _direccion: string,
        private _telefono: string,
        private _confirmado: boolean,
        private _ubicacion: Ubicacion
    ) { }

    static crear(
        id: number,
        nombre: string,
        apellido: string,
        localidad: string,
        direccion: string,
        telefono: string,
        confirmado: boolean,
        ubicacionRaw: string
    ): Cliente {
        const ubicacion = Ubicacion.crearDesdeString(ubicacionRaw);
        return new Cliente(id, nombre, apellido, localidad, direccion, telefono, confirmado, ubicacion);
    }

    public cambiarUbicacion(nuevoLink: string): void {
        this._ubicacion = Ubicacion.crearDesdeString(nuevoLink);
    }


    get id() { return this._id; }
    get nombreCompleto() { return `${this._nombre} ${this._apellido}`; }
    get coordenadas() {
        return { lat: this._ubicacion.lat, lng: this._ubicacion.lng };
    }


    public datosPrimitivos() {
        return {
            id_de: this._id,
            nombre: this._nombre,
            apellido: this._apellido,
            localidad: this._localidad,
            direccion: this._direccion,
            telefono: this._telefono,
            confirmado: this._confirmado,
            latitud: this._ubicacion.lat,
            longitud: this._ubicacion.lng,
            google_maps_url: this._ubicacion.linkOriginal
        };
    }
}
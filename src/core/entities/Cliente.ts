import { Ubicacion } from "./value-object/Ubicacion.js";

export class Cliente {
    private id: number;
    private nombre: string;
    private apellido: string;
    private localidad: string;
    private direccion: string;
    private telefono: string;
    private confirmado: boolean;
    private ubicacion: Ubicacion;

    constructor(
        id: number,
        nombre: string,
        apellido: string,
        localidad: string,
        direccion: string,
        telefono: string,
        confirmado: boolean,
        ubicacionRaw: string
    ) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.localidad = localidad;
        this.direccion = direccion;
        this.telefono = telefono;
        this.confirmado = confirmado;

        this.ubicacion = Ubicacion.crearDesdeString(ubicacionRaw);
    }

    /**
     * Cambia la ubicacion del cliente por una nueva.
     * 
     * @param {string} nuevoLink - El nuevo link de Google Maps del cliente.
     */
    public cambiarUbicacion(nuevoLink: string): void {
        this.ubicacion = Ubicacion.crearDesdeString(nuevoLink);
    }


    /**
     * Devuelve un objeto con los datos del cliente.
     * @return {object} - Un objeto con los datos del cliente.
     * @property {number} id - El ID del cliente.
     * @property {string} nombreCompleto - El nombre completo del cliente.
     * @property {string} localidad - La localidad del cliente.
     * @property {object} coordenadas - Un objeto con las coordenadas del cliente.
     * @property {number} coordenadas.lat - La latitud del cliente.
     * @property {number} coordenadas.lng - La longitud del cliente.
     * @property {string} urlMaps - La URL de Google Maps del cliente.
     */
    public obtenerDatos() {
        return {
            id: this.id,
            nombreCompleto: `${this.nombre} ${this.apellido}`,
            localidad: this.localidad,
            coordenadas: {
                lat: this.ubicacion.lat,
                lng: this.ubicacion.lng
            },
            urlMaps: this.ubicacion.linkOriginal
        };
    }
}
import { Ubicacion } from "./value-object/Ubicacion.js";

export class Cliente {
    private id: number = 0;
    private nombre: string;
    private apellido: string;
    private localidad: string;
    private direccion: string;
    private telefono: string;
    private confirmado: boolean = false;
    private ubicacion: Ubicacion;

    constructor(id: number, nombre: string, apellido: string, localidad: string, direccion: string, telefono: string, confirmado: boolean, ubicacion: string) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.localidad = localidad;
        this.direccion = direccion;
        this.telefono = telefono;
        this.confirmado = confirmado;
        this.ubicacion = Ubicacion.fromString(ubicacion);
    }

}
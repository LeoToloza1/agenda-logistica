import { ExceptionBase } from "../../../shared/exceptions/ExceptionBase.js";

export class UbicacionInvalidaException extends ExceptionBase {

    /**
     * Constructor de la clase UbicacionInvalidaException.
     * 
     * @param {string} input - Dato que no es un formato de Google Maps o coordenadas válido.
     * @throws {UbicacionInvalidaException} Si el formato de la cadena no es reconocido.
     */
    constructor(input: string) {
        super(`El dato "${input}" no es un formato de Google Maps o coordenadas válido.`, 'UBICACION_INVALIDA');
    }
}
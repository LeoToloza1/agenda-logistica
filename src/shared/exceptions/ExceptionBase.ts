export class ExceptionBase extends Error {
    /**
     * Constructor de la clase ExceptionBase.
     * 
     * @param {string} message - Mensaje de la excepcion.
     * @param {string} code - Codigo de la excepcion.
     */
    constructor(public message: string, public code: string) {
        super(message);
        this.name = this.constructor.name;
    }
}
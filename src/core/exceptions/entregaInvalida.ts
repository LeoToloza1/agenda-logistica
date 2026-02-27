import { ExceptionBase } from "../../../shared/exceptions/ExceptionBase.js";

/**
 * Excepción lanzada cuando una entrega (D.E.) no cumple con las reglas de negocio
 * o no puede ser procesada correctamente.
 */
export class EntregaInvalidaException extends ExceptionBase {

    /**
     * Constructor de la clase EntregaInvalidaException.
     * 
     * @param {string|number} input - D.E. de la entrega que no es válida.
     * @param {string} [motivo] - Motivo por el que no se puede procesar la entrega.
     * @throws {EntregaInvalidaException} Si el D.E. no es válido o no se puede procesar la entrega.
     */
    constructor(input: string | number, motivo?: string) {
        // Si pasas un motivo, lo agregamos al mensaje para que el chofer sepa qué pasó
        const mensajeBase = `La entrega con D.E. #${input} no es válida.`;
        const mensajeCompleto = motivo ? `${mensajeBase} Motivo: ${motivo}` : mensajeBase;

        super(mensajeCompleto, 'ENTREGA_INVALIDA');
    }
}
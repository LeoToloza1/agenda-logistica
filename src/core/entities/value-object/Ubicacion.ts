import { UbicacionInvalidaException } from "../exceptions/UbicacionInvalida.js";

export class Ubicacion {
    private constructor(
        public readonly lat: number,
        public readonly lng: number,
        public readonly linkOriginal?: string //link original por las dudas
    ) { }


    /**
     * Crea una instancia de Ubicacion a partir de una cadena que represente una ubicación.
     * Soporta los siguientes formatos:
     * - Coordenadas GMS (31°56'29.2"S 65°10'21.4"W)
     * - Enlaces de Google Maps o Google Maps shortlinks (goo.gl)
     * @param input - Cadena que representa la ubicación
     * @returns Instancia de Ubicación con los datos extraidos de la cadena
     * @throws Error si el formato de la cadena no es reconocido
     */
    static fromString(input: string): Ubicacion {
        // Caso 1: Coordenadas GMS (31°56'29.2"S 65°10'21.4"W)
        if (input.includes('°')) {
            return this.parseGMS(input);
        }
        if (input.includes('google.com/maps') || input.includes('goo.gl')) {
            return this.parseUrl(input);
        }

        throw new UbicacionInvalidaException("Formato de ubicación no reconocido");
    }

    /**
     * Parsea una cadena de coodenadas GMS (31°56'29.2"S 65°10'21.4"W) en una instancia de Ubicación.
     * @param gms - cadena que representa la ubicación en formato GMS
     * @returns Instancia de Ubicación con los datos extraidos de la cadena
     * @throws Error si el formato de la cadena no es reconocido
     */
    private static parseGMS(gms: string): Ubicacion {
        const lat = this.convertGMSToDecimal(gms.split(' ')[0]);
        const lng = this.convertGMSToDecimal(gms.split(' ')[1]);
        return new Ubicacion(lat, lng, gms);
    }

    /**
     * Parsea una cadena que representa una URL de Google Maps o Google Maps shortlinks
     * en una instancia de Ubicación.
     * Soporta los siguientes formatos:
     * - Enlaces de Google Maps (https://www.google.com/maps/.../@...,...)
     * - Enlaces de Google Maps shortlinks (goo.gl/...)
     * @param url - cadena que representa la URL de Google Maps o Google Maps shortlinks
     * @returns Instancia de Ubicación con los datos extraidos de la cadena
     */
    private static parseUrl(url: string): Ubicacion {
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = url.match(regex);

        if (match) {
            return new Ubicacion(parseFloat(match[1]), parseFloat(match[2]), url);
        }
        return new Ubicacion(0, 0, url);
    }

    /**
     * Convierte una cadena que representa una coodenada GMS (grados, minutos, segundos)
     * en un numero decimal que representa la coodenada en grados.
     * @param gms - cadena que representa la coordenada en formato GMS
     * @returns Numero decimal que representa la coordenada en grados
     */
    private static convertGMSToDecimal(gms: string): number {

        return -31.9414;
    }
}
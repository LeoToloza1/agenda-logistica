import { UbicacionInvalidaException } from "../exceptions/UbicacionInvalida.js";

export class Ubicacion {
    private constructor(
        public readonly lat: number,
        public readonly lng: number,
        public readonly linkOriginal?: string
    ) { }

    static crearDesdeString(input: string): Ubicacion {
        const inputTrim = input.trim();
        if (inputTrim.includes('°')) {
            return this.parsearGMS(inputTrim);
        }
        if (inputTrim.includes('maps') || inputTrim.includes('goo.gl')) {
            return this.parsearUrl(inputTrim);
        }
        throw new UbicacionInvalidaException(inputTrim); // Si no es ni GMS ni URL, es invalida
    }

    private static parsearGMS(gms: string): Ubicacion {
        // Regex para capturar Grados, Minutos, Segundos y Hemisferio (N,S,E,W)
        const gmsRegex = /(\d+)°(\d+)'([\d.]+)"([NSEW])/g;
        const matches = [...gms.matchAll(gmsRegex)];

        if (matches.length < 2) {
            throw new UbicacionInvalidaException("Formato GMS incompleto (falta lat o lng)");
        }

        const lat = this.convertirGMSADecimal(matches[0]);
        const lng = this.convertirGMSADecimal(matches[1]);

        return new Ubicacion(lat, lng, gms);
    }

    /**
     * Intenta parsear un string que puede ser un link de Google Maps (largo o corto) o una URL de búsqueda/compartir
     * y devuelve una instancia de Ubicacion con los valores parseados.
     *
     * Primero, intenta buscar @lat,lng en el link (links largos). Si no encuentra nada, intenta buscar q=lat,lng en el link (links de búsqueda/compartir).
     * Si no encuentra nada en la URL, devuelve una instancia de Ubicacion con lat=0, lng=0 pero guardando el link original para que el front lo abra.
     */
    private static parsearUrl(url: string): Ubicacion {
        // 1. Intentar buscar @lat,lng (Links largos)
        const regexLong = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const matchLong = url.match(regexLong);

        if (matchLong) {
            return new Ubicacion(parseFloat(matchLong[1]), parseFloat(matchLong[2]), url);
        }

        // 2. Intentar buscar q=lat,lng (Links de búsqueda/compartir)
        const regexQuery = /q=(-?\d+\.\d+),(-?\d+\.\d+)/;
        const matchQuery = url.match(regexQuery);

        if (matchQuery) {
            return new Ubicacion(parseFloat(matchQuery[1]), parseFloat(matchQuery[2]), url);
        }

        // Si es un link corto de goo.gl, a veces no trae la coordenada en el texto.
        // En ese caso, devolvemos 0,0 pero guardamos el link para que el front lo abra.
        return new Ubicacion(0, 0, url);
    }

    /**
     * Convierte un arreglo de matches de una expresion regular en un numero decimal que representa una coordenada geografica.
     * La expresion regular debe tener el siguiente formato: (\d+)°(\d+)'([\d.]+)"([NSEW])
     * 
     * @param {RegExpMatchArray} match - Arreglo de matches de la expresion regular.
     * @returns {number} - Numero decimal que representa la coordenada geografica.
     */
    private static convertirGMSADecimal(match: RegExpMatchArray): number {
        const grados = parseInt(match[1]);
        const minutos = parseInt(match[2]);
        const segundos = parseFloat(match[3]);
        const hemisferio = match[4];

        // Formula: Grados + (Minutos/60) + (Segundos/3600)
        let decimal = grados + (minutos / 60) + (segundos / 3600);

        // Si es Sur (S) o Oeste (W), el valor debe ser negativo
        if (hemisferio === 'S' || hemisferio === 'W') {
            decimal = decimal * -1;
        }

        return parseFloat(decimal.toFixed(6)); // Limitamos a 6 decimales
    }
}
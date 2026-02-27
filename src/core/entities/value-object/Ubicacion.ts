import { UbicacionInvalidaException } from "../../exceptions/UbicacionInvalida.js";

export class Ubicacion {
    private constructor(
        public readonly lat: number,
        public readonly lng: number,
        public readonly linkOriginal?: string
    ) { }

    static crearDesdeString(input: string): Ubicacion {
        const inputTrim = input.trim();

        // 1. Detectar GMS (31°56'26.9"S...)
        if (inputTrim.includes('°')) {
            return this.parsearGMS(inputTrim);
        }

        // 2. Detectar URLs (Google Maps, goo.gl, etc)
        if (inputTrim.includes('maps') || inputTrim.includes('goo.gl')) {
            return this.parsearUrl(inputTrim);
        }

        // 3. Detectar Coordenadas Decimales (-31.4167, -64.1833)
        // Buscamos algo que parezca: numero, numero
        const decimalRegex = /^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/;
        const matchDecimal = inputTrim.match(decimalRegex);

        if (matchDecimal) {
            return new Ubicacion(
                parseFloat(matchDecimal[1]),
                parseFloat(matchDecimal[2]),
                `https://www.google.com/maps?q=${matchDecimal[1]},${matchDecimal[2]}`
            );
        }

        throw new UbicacionInvalidaException(inputTrim);
    }

    private static parsearGMS(gms: string): Ubicacion {
        const gmsRegex = /(\d+)°(\d+)'([\d.]+)"([NSEW])/g;
        const matches = [...gms.matchAll(gmsRegex)];

        if (matches.length < 2) {
            throw new UbicacionInvalidaException("Formato GMS incompleto");
        }

        const lat = this.convertirGMSADecimal(matches[0]);
        const lng = this.convertirGMSADecimal(matches[1]);

        // Generamos un link de Google Maps para que el chofer pueda hacer clic
        const link = `https://www.google.com/maps?q=${lat},${lng}`;

        return new Ubicacion(lat, lng, link);
    }

    private static parsearUrl(url: string): Ubicacion {
        const regexLong = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const matchLong = url.match(regexLong);
        if (matchLong) {
            return new Ubicacion(parseFloat(matchLong[1]), parseFloat(matchLong[2]), url);
        }

        const regexQuery = /q=(-?\d+\.\d+),(-?\d+\.\d+)/;
        const matchQuery = url.match(regexQuery);
        if (matchQuery) {
            return new Ubicacion(parseFloat(matchQuery[1]), parseFloat(matchQuery[2]), url);
        }

        // Link corto sin coordenadas visibles (goo.gl/...)
        // Devolvemos 0,0 para que no explote, pero el link original permitirá abrirlo en Maps
        return new Ubicacion(0, 0, url);
    }

    private static convertirGMSADecimal(match: RegExpMatchArray): number {
        const grados = parseInt(match[1]);
        const minutos = parseInt(match[2]);
        const segundos = parseFloat(match[3]);
        const hemisferio = match[4];

        let decimal = grados + (minutos / 60) + (segundos / 3600);
        if (hemisferio === 'S' || hemisferio === 'W') decimal *= -1;

        return parseFloat(decimal.toFixed(6));
    }
}
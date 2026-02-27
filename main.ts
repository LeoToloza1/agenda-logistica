import { Cliente } from "./src/core/entities/Cliente.js";
import { DetalleDeEntrega } from "./src/core/entities/detalleDeEntrega.js";
import { HojaDeRuta } from "./src/core/entities/HojaDeRuta.js";
import { TipoProducto } from "./src/core/entities/enums/tipo-producto.js";
import { EstadoEntrega } from "./src/core/entities/enums/EstadoEntrega.js";
import { Ubicacion } from "./src/core/entities/value-object/Ubicacion.js";

try {
    console.log("🚀 INICIANDO PRUEBA DE DOMINIO: LOGÍSTICA\n");

    // 1. Creamos al Cliente (Datos estáticos)
    const clienteJuan = new Cliente(101, "Juan", "Perez", "3516123456");

    // 2. Definimos dos ubicaciones distintas (pueden ser links de WhatsApp o GMS)
    const linkObraCentro = "https://www.google.com/maps/.../@"; // Simulado
    const linkObraCountry = "https://www.google.com/maps?q=-31.9408054,-65.1821858&entry=gps&shh=CAE&lucs=,94259550,94297699,94284484,94231188,94280568,47071704,94218641,94282134,94286869&g_ep=CAISEjI1LjQ5LjkuODM4ODk5MTgzMBgAINeCAypRLDk0MjU5NTUwLDk0Mjk3Njk5LDk0Mjg0NDg0LDk0MjMxMTg4LDk0MjgwNTY4LDQ3MDcxNzA0LDk0MjE4NjQxLDk0MjgyMTM0LDk0Mjg2ODY5QgJBUg%3D%3D&skid=533bb165-138a-41cb-9b52-99470d1fb053&g_st=iw-31.4167, -64.1833"; // GMS decimal simple

    // 3. Creamos dos Detalles de Entrega para el MISMO cliente pero distintas OBRA/UBICACIÓN
    const entrega1 = new DetalleDeEntrega(
        null, 7075, 2, clienteJuan, TipoProducto.ABERTURAS,
        "Edificio Mirador - Piso 4", // Nombre de la obra
        Ubicacion.crearDesdeString(linkObraCentro),              // Ubicación específica
        "Arq. Roberto (11 2233-4455)", // Contacto en obra
        true                         // Confirmado por administración
    );

    const entrega2 = new DetalleDeEntrega(
        null, 7076, 5, clienteJuan, TipoProducto.PISOS,
        "Casa Country Los Olivos",   // Otra obra distinta
        Ubicacion.crearDesdeString(linkObraCountry),             // Otra ubicación
        "Capataz Mario",             // Otro contacto
        true                         // Confirmado
    );

    // 4. Creamos la Hoja de Ruta para el chofer "Leo"
    const hojaHoy = new HojaDeRuta("HR-20260227-LEO", new Date(), "Leo");
    hojaHoy.agregarEntrega(entrega1);
    hojaHoy.agregarEntrega(entrega2);

    // --- VERIFICACIÓN DE DATOS ---

    console.log(`📍 Hoja de Ruta: ${hojaHoy.id} | Chofer: ${hojaHoy.chofer}`);
    console.log(`📦 Total Bultos a cargar: ${hojaHoy.totalBultos}`);
    console.log(`📊 Resumen por producto:`, hojaHoy.resumenCarga);

    console.log("\n--- MAPA DE RUTA (Puntos de entrega) ---");
    hojaHoy.mapaDeRuta.forEach(punto => {
        console.log(`- DE #${punto.de} | Obra: ${punto.obra} | Coords: ${JSON.stringify(punto.coords)}`);
    });

    // 5. Simulación de proceso en la PWA
    console.log("\n--- SIMULANDO REPARTO ---");
    console.log(`Progreso inicial: ${hojaHoy.progreso}`);

    entrega1.registrarEntrega("Leo");
    console.log(`✅ Entrega #7075 registrada exitosamente.`);

    console.log(`Progreso actual: ${hojaHoy.progreso}`);
    console.log(`¿Finalizada?: ${hojaHoy.estaFinalizada ? "SÍ" : "NO"}`);

    // 6. Ver primitivos de la Hoja de Ruta (Lo que iría a la base de datos)
    console.log("\n--- DATOS PARA PERSISTENCIA (JSON) ---");
    console.log(JSON.stringify(hojaHoy.toPrimitives(), null, 2));

} catch (error: any) {
    console.error(`\n❌ Error en el flujo: [${error.code || 'DOMINIO_ERROR'}] ${error.message}`);
}
import { Cliente } from "./src/core/entities/Cliente.js";
import { DetalleDeEntrega } from "./src/core/entities/detalleDeEntrega.js";
import { HojaDeRuta } from "./src/core/entities/HojaDeRuta.js";
import { TipoProducto } from "./src/core/entities/enums/tipo-producto.js";
import { Ubicacion } from "./src/core/entities/value-object/Ubicacion.js";

try {
    console.log("🚀 INICIANDO MOCK TEST: LOGÍSTICA MULTI-DESTINO\n");

    // 1. MOCK DE CLIENTES
    const cliente1 = new Cliente(101, "Juan", "Perez", "3516123456");
    const cliente2 = new Cliente(102, "Andres", "Degenaro", "3544987654");
    const cliente3 = new Cliente(103, "Maria", "Bebé", "3511122334");

    // 2. MOCK DE HOJA DE RUTA
    const hojaHoy = new HojaDeRuta("HR-20260227-LEO", new Date(), "Leo");

    // 3. GENERACIÓN DE ENTREGAS (Diferentes casos)

    // Caso A: Ubicación por GMS (Captura de WhatsApp)
    const entregaGMS = new DetalleDeEntrega(
        null, 8001, 3, cliente2, TipoProducto.ABERTURAS,
        "Obra Dolores",
        Ubicacion.crearDesdeString(`31°56'26.9"S 65°10'55.9"W`),
        "Prigent Franco",
        true
    );

    // Caso B: Ubicación por Coordenadas Decimales
    const entregaDecimal = new DetalleDeEntrega(
        null, 8002, 1, cliente1, TipoProducto.PUERTAS,
        "Edificio Mirador",
        Ubicacion.crearDesdeString("-31.4167, -64.1833"),
        "Arq. Roberto",
        true
    );

    // Caso C: Link de Google Maps (goo.gl)
    const entregaLink = new DetalleDeEntrega(
        null, 8003, 10, cliente3, TipoProducto.PREMARCOS,
        "Const Nuñez - Obra María",
        Ubicacion.crearDesdeString("https://maps.app.goo.gl/jZhXazV42PuEMcni8"),
        "Fernando (Jefe Instalador)",
        true
    );

    // Caso D: Entrega NO confirmada (Para probar error)
    const entregaNoConfirmada = new DetalleDeEntrega(
        null, 8004, 2, cliente1, TipoProducto.PISOS,
        "Obra Particular",
        Ubicacion.crearDesdeString("-31.9408, -65.1821"),
        "Juan Perez",
        false // <--- IMPORTANTE: No confirmado
    );

    // 4. CARGAMOS LA HOJA DE RUTA
    hojaHoy.agregarEntrega(entregaGMS);
    hojaHoy.agregarEntrega(entregaDecimal);
    hojaHoy.agregarEntrega(entregaLink);
    hojaHoy.agregarEntrega(entregaNoConfirmada);

    // --- REPORTES ---

    console.log(`📍 Hoja de Ruta cargada: ${hojaHoy.id}`);
    console.log(`📦 Bultos totales en camioneta: ${hojaHoy.totalBultos}`);
    console.log(`📋 Resumen de carga:`, hojaHoy.resumenCarga);

    console.log("\n--- HOJA DE RUTA PARA EL CHOFER ---");
    hojaHoy.entregas.forEach(e => {
        const p = e.toPrimitives();
        console.log(`[ ] DE #${p.numero_de} - ${p.obra}`);
        console.log(`    👤 Cliente: ${e.cliente.nombreCompleto} | 📞 ${p.contacto_responsable}`);
        console.log(`    📍 GPS: ${p.latitud}, ${p.longitud}`);
    });

    // 5. SIMULACIÓN DE REPARTO
    console.log("\n--- PROCESANDO ENTREGAS ---");

    // Entregamos la primera (GMS)
    entregaGMS.registrarEntrega("Leo");
    console.log(`✅ DE #8001: Entregada en Obra Dolores.`);

    // Intentamos entregar la NO confirmada (Debería saltar al catch)
    console.log(`⚠️ Intentando entregar DE #8004 (No confirmada)...`);
    entregaNoConfirmada.registrarEntrega("Leo");

} catch (error: any) {
    console.error(`\n❌ ERROR DETECTADO: [${error.code}] ${error.message}`);
}
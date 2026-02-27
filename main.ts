import { Cliente } from "./src/core/entities/Cliente";
import { DetalleDeEntrega } from "./src/core/entities/detalleDeEntrega";
import { EstadoEntrega } from "./src/core/entities/enums/EstadoEntrega";
import { TipoProducto } from "./src/core/entities/enums/tipo-producto";
import { Ubicacion } from "./src/core/entities/value-object/Ubicacion";

try {
    // 1. Mock de Ubicación (Probando el link de WhatsApp con @lat,lng)
    const whatsappLink = "https://www.google.com/maps?q=-31.4167,-64.1833";

    // 2. Mock de Cliente
    const clienteTest = new Cliente(
        101,            // ID interno o D.E.
        "Juan",
        "Perez",
        "Córdoba",
        "Av. Colon 123",
        "3516123456",
        true,           // Confirmado
        Ubicacion.crearDesdeString(whatsappLink)    // El link que procesará Ubicacion.crearDesdeString
    );

    console.log("--- DATOS DEL CLIENTE ---");
    console.log("Nombre Completo:", clienteTest.nombreCompleto);
    console.log("Coordenadas extraídas:", clienteTest.coordenadas);

    // 3. Mock de Detalle de Entrega (Asociado al cliente de arriba)
    const entrega1 = new DetalleDeEntrega(
        null,                   // 1. _id
        7075,                   // 2. _numeroDE
        2,                      // 3. _cantidad
        clienteTest,            // 4. _cliente
        TipoProducto.ABERTURAS, // 5. _tipo
        true,                   // 6. _confirmado
        EstadoEntrega.EN_VIAJE,                  // 7. _entregado (Al inicio es false)
        "",                     // 8. _entregadoPor
        null,                   // 9. _fechaDeEntrega
        "Tocar timbre fuerte"   // 10. _observaciones
    );
    console.log("\n--- ESTADO INICIAL DE ENTREGA ---");
    console.log(`D.E. #${entrega1.numeroDE} - Entregado: ${entrega1.entregado}`);

    // 4. Probar la regla de negocio: Registrar Entrega
    console.log("\n--- REGISTRANDO ENTREGA ---");
    entrega1.registrarEntrega("Chofer Leo");

    console.log("Estado Final:", entrega1.toPrimitives());

    // 5. Prueba de Error: Intentar crear una entrega NO confirmada y registrarla
    const entregaFallida = new DetalleDeEntrega(
        null,
        2020,
        1,
        clienteTest,
        TipoProducto.PUERTAS,
        false, // _confirmado = false
        EstadoEntrega.REPROGRAMADO
    );

    console.log("\n--- PROBANDO REGLA DE NEGOCIO (EXCEPCIÓN) ---");
    entregaFallida.registrarEntrega("Chofer Leo"); // Esto debería disparar tu EntregaInvalidaException

} catch (error: any) {
    console.error(`❌ Error detectado: [${error.code}] ${error.message}`);
}
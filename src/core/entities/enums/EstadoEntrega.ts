export enum EstadoEntrega {
    PENDIENTE = 'PENDIENTE',   // Recién cargado del Excel
    EN_VIAJE = 'EN_VIAJE',     // El chofer lo cargó en la camioneta
    ENTREGADO = 'ENTREGADO',   // ¡Éxito!
    FALLIDO = 'FALLIDO',       // No había nadie, dirección mal, etc.
    REPROGRAMADO = 'REPROGRAMADO'
}
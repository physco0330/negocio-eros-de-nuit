package com.negocio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VentaDTO {
    private Long id;
    private String clienteNombre;
    private String clienteTelefono;
    private String clienteEmail;
    private String vendedor;
    private BigDecimal total;
    private BigDecimal totalAbonado;
    private String estado;
    private String observacion;
    private LocalDateTime fechaVenta;
    private List<DetalleVentaDTO> detalles;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetalleVentaDTO {
        private Long id;
        private Long productoId;
        private String productoNombre;
        private Integer cantidad;
        private BigDecimal precioUnitario;
        private BigDecimal subtotal;
    }
}

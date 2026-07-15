package com.negocio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VentaCreateDTO {
    private String clienteNombre;
    private String clienteTelefono;
    private String clienteEmail;
    private String vendedor;
    private String estado;
    private String observacion;
    private List<DetalleCreateDTO> detalles;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetalleCreateDTO {
        private Long productoId;
        private Long comboId;
        private Integer cantidad;
        private BigDecimal precioUnitario;
    }
}

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
public class ComboCreateDTO {
    private String nombre;
    private String descripcion;
    private BigDecimal precioCombo;
    private String imagenUrl;
    private Boolean activo;
    private List<DetalleDTO> productos;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetalleDTO {
        private Long productoId;
        private Integer cantidad;
    }
}

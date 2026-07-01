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
public class ComboDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precioCombo;
    private String imagenUrl;
    private Boolean activo;
    private List<ComboProductoDTO> productos;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComboProductoDTO {
        private Long id;
        private Long productoId;
        private String productoNombre;
        private BigDecimal productoPrecio;
        private Integer cantidad;
    }
}

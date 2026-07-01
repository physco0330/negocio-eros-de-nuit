package com.negocio.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Long categoriaId;
    private String categoriaNombre;
    private Long marcaId;
    private String marcaNombre;
    private BigDecimal precioCompra;
    private BigDecimal precioVenta;
    private BigDecimal descuentoPorcentaje;
    private BigDecimal precioConDescuento;
    private Integer stockActual;
    private Integer stockMinimo;
    private Boolean activo;
    private List<ImagenDTO> imagenes;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImagenDTO {
        private Long id;
        private String urlImagen;
        private Boolean principal;
    }
}

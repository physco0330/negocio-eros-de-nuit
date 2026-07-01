package com.negocio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoCreateDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    private Long categoriaId;

    private Long marcaId;

    @NotNull(message = "El precio de compra es obligatorio")
    @PositiveOrZero(message = "El precio de compra debe ser positivo")
    private BigDecimal precioCompra;

    @NotNull(message = "El precio de venta es obligatorio")
    @PositiveOrZero(message = "El precio de venta debe ser positivo")
    private BigDecimal precioVenta;

    @PositiveOrZero(message = "El descuento debe ser positivo")
    private BigDecimal descuentoPorcentaje;

    @NotNull(message = "El stock actual es obligatorio")
    private Integer stockActual;

    private Integer stockMinimo;
}

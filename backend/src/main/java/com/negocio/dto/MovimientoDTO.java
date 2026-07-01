package com.negocio.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimientoDTO {
    private Long id;
    private Long productoId;
    private String productoNombre;
    private String tipoMovimiento;
    private Integer cantidad;
    private String observacion;
    private LocalDateTime fecha;
}

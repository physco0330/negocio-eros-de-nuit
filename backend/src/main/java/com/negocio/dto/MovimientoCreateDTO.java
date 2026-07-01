package com.negocio.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimientoCreateDTO {
    private Long productoId;
    private String tipoMovimiento;
    private Integer cantidad;
    private String observacion;
}

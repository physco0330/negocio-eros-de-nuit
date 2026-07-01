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
public class DashboardDTO {
    private Long totalProductos;
    private Long productosAgotados;
    private Long productosBajoStock;
    private BigDecimal valorTotalInventario;
    private BigDecimal ventasEstimadas;
    private Long totalMovimientos;
}

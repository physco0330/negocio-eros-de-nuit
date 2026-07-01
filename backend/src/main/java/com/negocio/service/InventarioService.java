package com.negocio.service;

import com.negocio.dto.*;
import com.negocio.model.*;
import com.negocio.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventarioService {

    @Autowired
    private MovimientoInventarioRepository movimientoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ImagenProductoRepository imagenProductoRepository;

    public List<MovimientoDTO> listarTodos() {
        return movimientoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<MovimientoDTO> porProducto(Long productoId) {
        return movimientoRepository.findByProductoIdOrderByFechaDesc(productoId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MovimientoDTO registrarMovimiento(MovimientoCreateDTO dto) {
        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        MovimientoInventario.TipoMovimiento tipo = MovimientoInventario.TipoMovimiento.valueOf(dto.getTipoMovimiento());

        MovimientoInventario movimiento = MovimientoInventario.builder()
                .producto(producto)
                .tipoMovimiento(tipo)
                .cantidad(dto.getCantidad())
                .observacion(dto.getObservacion())
                .build();

        switch (tipo) {
            case ENTRADA:
                producto.setStockActual(producto.getStockActual() + dto.getCantidad());
                break;
            case SALIDA:
                if (producto.getStockActual() < dto.getCantidad()) {
                    throw new RuntimeException("Stock insuficiente. Stock actual: " + producto.getStockActual());
                }
                producto.setStockActual(producto.getStockActual() - dto.getCantidad());
                break;
            case AJUSTE:
                producto.setStockActual(dto.getCantidad());
                break;
        }

        productoRepository.save(producto);
        MovimientoInventario guardado = movimientoRepository.save(movimiento);
        return toDTO(guardado);
    }

    public DashboardDTO obtenerDashboard() {
        Long totalProductos = productoRepository.countProductosActivos();
        Long productosAgotados = (long) productoRepository.findProductosAgotados().size();
        Long productosBajoStock = (long) productoRepository.findProductosBajoStock().size();
        BigDecimal valorInventario = productoRepository.calcularValorTotalInventario();
        BigDecimal ventasEstimadas = productoRepository.calcularVentasEstimadas();
        Long totalMovimientos = movimientoRepository.countTotalMovimientos();

        return DashboardDTO.builder()
                .totalProductos(totalProductos)
                .productosAgotados(productosAgotados)
                .productosBajoStock(productosBajoStock)
                .valorTotalInventario(valorInventario != null ? valorInventario : BigDecimal.ZERO)
                .ventasEstimadas(ventasEstimadas != null ? ventasEstimadas : BigDecimal.ZERO)
                .totalMovimientos(totalMovimientos)
                .build();
    }

    public List<Map<String, Object>> productosMasVendidos() {
        List<Object[]> data = movimientoRepository.findProductosMasVendidos();
        return data.stream()
                .map(row -> Map.<String, Object>of(
                        "producto", row[0],
                        "cantidad", row[1]
                ))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> resumenMovimientos() {
        List<Object[]> data = movimientoRepository.findResumenMovimientos();
        return data.stream()
                .map(row -> Map.<String, Object>of(
                        "producto", row[0],
                        "tipo", row[1],
                        "cantidad", row[2]
                ))
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> productosBajoStock() {
        return productoRepository.findProductosBajoStock().stream()
                .map(p -> {
                    List<ImagenProducto> imgs = imagenProductoRepository.findByProductoId(p.getId());
                    return ProductoDTO.builder()
                            .id(p.getId())
                            .nombre(p.getNombre())
                            .stockActual(p.getStockActual())
                            .stockMinimo(p.getStockMinimo())
                            .imagenes(imgs.stream()
                                    .map(img -> ProductoDTO.ImagenDTO.builder()
                                            .id(img.getId())
                                            .urlImagen(img.getUrlImagen())
                                            .principal(img.getPrincipal())
                                            .build())
                                    .collect(Collectors.toList()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> productosAgotados() {
        return productoRepository.findProductosAgotados().stream()
                .map(p -> ProductoDTO.builder()
                        .id(p.getId())
                        .nombre(p.getNombre())
                        .stockActual(0)
                        .build())
                .collect(Collectors.toList());
    }

    private MovimientoDTO toDTO(MovimientoInventario movimiento) {
        return MovimientoDTO.builder()
                .id(movimiento.getId())
                .productoId(movimiento.getProducto().getId())
                .productoNombre(movimiento.getProducto().getNombre())
                .tipoMovimiento(movimiento.getTipoMovimiento().name())
                .cantidad(movimiento.getCantidad())
                .observacion(movimiento.getObservacion())
                .fecha(movimiento.getFecha())
                .build();
    }
}

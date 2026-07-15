package com.negocio.service;

import com.negocio.dto.*;
import com.negocio.model.*;
import com.negocio.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private ComboProductoRepository comboProductoRepository;

    public List<VentaDTO> listarTodas() {
        return ventaRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public VentaDTO obtenerPorId(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
        return toDTO(venta);
    }

    public List<VentaDTO> porEstado(String estado) {
        return ventaRepository.findByEstadoOrderByFechaVentaDesc(estado).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<VentaDTO> buscarPorCliente(String nombre) {
        return ventaRepository.findByClienteNombreContaining(nombre).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public VentaDTO crear(VentaCreateDTO dto) {
        BigDecimal total = BigDecimal.ZERO;
        Venta venta = Venta.builder()
                .clienteNombre(dto.getClienteNombre())
                .clienteTelefono(dto.getClienteTelefono())
                .clienteEmail(dto.getClienteEmail())
                .estado(Venta.EstadoVenta.valueOf(dto.getEstado() != null ? dto.getEstado() : "PENDIENTE"))
                .observacion(dto.getObservacion())
                .total(BigDecimal.ZERO)
                .build();

        Venta guardada = ventaRepository.save(venta);

        if (dto.getDetalles() != null && !dto.getDetalles().isEmpty()) {
            List<DetalleVenta> detalles = new ArrayList<>();
            for (VentaCreateDTO.DetalleCreateDTO det : dto.getDetalles()) {
                Producto producto;
                if (det.getComboId() != null) {
                    Combo combo = comboRepository.findById(det.getComboId())
                            .orElseThrow(() -> new RuntimeException("Combo no encontrado: " + det.getComboId()));
                    List<ComboProducto> comboProductos = comboProductoRepository.findByComboId(combo.getId());
                    if (comboProductos.isEmpty()) {
                        throw new RuntimeException("El combo no tiene productos: " + combo.getNombre());
                    }
                    producto = comboProductos.get(0).getProducto();
                } else {
                    producto = productoRepository.findById(det.getProductoId())
                            .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + det.getProductoId()));
                }

                BigDecimal subtotal = det.getPrecioUnitario().multiply(BigDecimal.valueOf(det.getCantidad()));

                DetalleVenta detalle = DetalleVenta.builder()
                        .venta(guardada)
                        .producto(producto)
                        .cantidad(det.getCantidad())
                        .precioUnitario(det.getPrecioUnitario())
                        .subtotal(subtotal)
                        .build();
                detalles.add(detalle);
                total = total.add(subtotal);
            }
            detalleVentaRepository.saveAll(detalles);
            guardada.setTotal(total);
            guardada.setDetalles(detalles);
            ventaRepository.save(guardada);
        }

        return toDTO(guardada);
    }

    public VentaDTO actualizarEstado(Long id, String nuevoEstado) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
        venta.setEstado(Venta.EstadoVenta.valueOf(nuevoEstado));
        Venta actualizada = ventaRepository.save(venta);
        return toDTO(actualizada);
    }

    public VentaDTO actualizar(Long id, VentaCreateDTO dto) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

        venta.setClienteNombre(dto.getClienteNombre());
        venta.setClienteTelefono(dto.getClienteTelefono());
        venta.setClienteEmail(dto.getClienteEmail());
        if (dto.getEstado() != null) {
            venta.setEstado(Venta.EstadoVenta.valueOf(dto.getEstado()));
        }
        venta.setObservacion(dto.getObservacion());

        if (dto.getDetalles() != null) {
            List<DetalleVenta> detallesExistentes = detalleVentaRepository.findByVentaId(id);
            detalleVentaRepository.deleteAll(detallesExistentes);

            BigDecimal total = BigDecimal.ZERO;
            List<DetalleVenta> nuevosDetalles = new ArrayList<>();
            for (VentaCreateDTO.DetalleCreateDTO det : dto.getDetalles()) {
                Producto producto = productoRepository.findById(det.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

                BigDecimal subtotal = det.getPrecioUnitario().multiply(BigDecimal.valueOf(det.getCantidad()));

                DetalleVenta detalle = DetalleVenta.builder()
                        .venta(venta)
                        .producto(producto)
                        .cantidad(det.getCantidad())
                        .precioUnitario(det.getPrecioUnitario())
                        .subtotal(subtotal)
                        .build();
                nuevosDetalles.add(detalle);
                total = total.add(subtotal);
            }
            detalleVentaRepository.saveAll(nuevosDetalles);
            venta.setTotal(total);
            venta.setDetalles(nuevosDetalles);
        }

        Venta actualizada = ventaRepository.save(venta);
        return toDTO(actualizada);
    }

    public void eliminar(Long id) {
        if (!ventaRepository.existsById(id)) {
            throw new RuntimeException("Venta no encontrada");
        }
        ventaRepository.deleteById(id);
    }

    public Map<String, Object> resumenVentas() {
        BigDecimal totalFinalizadas = ventaRepository.calcularTotalVentasFinalizadas();
        BigDecimal totalPendientes = ventaRepository.calcularTotalVentasPendientes();
        Long totalVentas = ventaRepository.countTotalVentas();
        List<Object[]> resumenPorEstado = ventaRepository.findResumenPorEstado();

        Map<String, Object> porEstado = new HashMap<>();
        for (Object[] row : resumenPorEstado) {
            Map<String, Object> item = new HashMap<>();
            item.put("estado", row[0]);
            item.put("cantidad", row[1]);
            item.put("total", row[2]);
            porEstado.put((String) row[0], item);
        }

        Map<String, Object> resumen = new HashMap<>();
        resumen.put("totalVentas", totalVentas);
        resumen.put("totalFinalizadas", totalFinalizadas);
        resumen.put("totalPendientes", totalPendientes);
        resumen.put("porEstado", porEstado);
        return resumen;
    }

    private VentaDTO toDTO(Venta venta) {
        List<VentaDTO.DetalleVentaDTO> detallesDTO = Collections.emptyList();
        if (venta.getDetalles() != null) {
            detallesDTO = venta.getDetalles().stream()
                    .map(d -> VentaDTO.DetalleVentaDTO.builder()
                            .id(d.getId())
                            .productoId(d.getProducto().getId())
                            .productoNombre(d.getProducto().getNombre())
                            .cantidad(d.getCantidad())
                            .precioUnitario(d.getPrecioUnitario())
                            .subtotal(d.getSubtotal())
                            .build())
                    .collect(Collectors.toList());
        }

        return VentaDTO.builder()
                .id(venta.getId())
                .clienteNombre(venta.getClienteNombre())
                .clienteTelefono(venta.getClienteTelefono())
                .clienteEmail(venta.getClienteEmail())
                .total(venta.getTotal())
                .totalAbonado(venta.getTotalAbonado() != null ? venta.getTotalAbonado() : BigDecimal.ZERO)
                .estado(venta.getEstado().name())
                .observacion(venta.getObservacion())
                .fechaVenta(venta.getFechaVenta())
                .detalles(detallesDTO)
                .build();
    }
}

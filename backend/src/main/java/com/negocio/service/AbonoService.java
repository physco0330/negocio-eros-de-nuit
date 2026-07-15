package com.negocio.service;

import com.negocio.model.Abono;
import com.negocio.model.Venta;
import com.negocio.repository.AbonoRepository;
import com.negocio.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AbonoService {

    @Autowired
    private AbonoRepository abonoRepository;

    @Autowired
    private VentaRepository ventaRepository;

    public List<Map<String, Object>> listarPorVenta(Long ventaId) {
        return abonoRepository.findByVentaIdOrderByFechaDesc(ventaId).stream()
                .map(a -> Map.<String, Object>of(
                        "id", a.getId(),
                        "monto", a.getMonto(),
                        "observacion", a.getObservacion() != null ? a.getObservacion() : "",
                        "fecha", a.getFecha()
                ))
                .toList();
    }

    public Map<String, Object> crear(Long ventaId, BigDecimal monto, String observacion) {
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

        if (venta.getEstado() == Venta.EstadoVenta.FINALIZADA || venta.getEstado() == Venta.EstadoVenta.CANCELADA) {
            throw new RuntimeException("No se pueden agregar abonos a una venta " + venta.getEstado());
        }

        BigDecimal restante = venta.getTotal().subtract(venta.getTotalAbonado());
        if (monto.compareTo(restante) > 0) {
            throw new RuntimeException("El abono de $" + monto + " excede el saldo pendiente de $" + restante);
        }

        Abono abono = Abono.builder()
                .venta(venta)
                .monto(monto)
                .observacion(observacion)
                .build();
        abonoRepository.save(abono);

        venta.setTotalAbonado(venta.getTotalAbonado().add(monto));

        if (venta.getTotalAbonado().compareTo(venta.getTotal()) >= 0) {
            venta.setEstado(Venta.EstadoVenta.FINALIZADA);
        } else {
            venta.setEstado(Venta.EstadoVenta.EN_PROCESO);
        }

        ventaRepository.save(venta);

        return Map.<String, Object>of(
                "id", abono.getId(),
                "monto", abono.getMonto(),
                "observacion", abono.getObservacion() != null ? abono.getObservacion() : "",
                "fecha", abono.getFecha(),
                "totalAbonado", venta.getTotalAbonado(),
                "estado", venta.getEstado()
        );
    }

    public void eliminar(Long abonoId) {
        Abono abono = abonoRepository.findById(abonoId)
                .orElseThrow(() -> new RuntimeException("Abono no encontrado"));

        Venta venta = abono.getVenta();
        venta.setTotalAbonado(venta.getTotalAbonado().subtract(abono.getMonto()));

        if (venta.getTotalAbonado().compareTo(BigDecimal.ZERO) <= 0) {
            venta.setEstado(Venta.EstadoVenta.PENDIENTE);
        } else {
            venta.setEstado(Venta.EstadoVenta.EN_PROCESO);
        }

        abonoRepository.delete(abono);
        ventaRepository.save(venta);
    }
}

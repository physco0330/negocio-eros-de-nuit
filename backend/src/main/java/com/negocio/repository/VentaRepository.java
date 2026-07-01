package com.negocio.repository;

import com.negocio.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, Long> {

    List<Venta> findByEstadoOrderByFechaVentaDesc(String estado);

    List<Venta> findByFechaVentaBetweenOrderByFechaVentaDesc(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT v FROM Venta v WHERE v.clienteNombre LIKE %:nombre%")
    List<Venta> findByClienteNombreContaining(@Param("nombre") String nombre);

    @Query("SELECT v.estado, COUNT(v), COALESCE(SUM(v.total), 0) FROM Venta v GROUP BY v.estado")
    List<Object[]> findResumenPorEstado();

    @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venta v WHERE v.estado = 'FINALIZADA'")
    java.math.BigDecimal calcularTotalVentasFinalizadas();

    @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venta v WHERE v.estado IN ('PENDIENTE', 'EN_PROCESO')")
    java.math.BigDecimal calcularTotalVentasPendientes();

    @Query("SELECT COUNT(v) FROM Venta v")
    Long countTotalVentas();
}

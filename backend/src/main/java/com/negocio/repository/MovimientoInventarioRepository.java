package com.negocio.repository;

import com.negocio.model.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {

    List<MovimientoInventario> findByProductoIdOrderByFechaDesc(Long productoId);

    List<MovimientoInventario> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT m FROM MovimientoInventario m WHERE m.tipoMovimiento = :tipo")
    List<MovimientoInventario> findByTipoMovimiento(@Param("tipo") String tipo);

    @Query("SELECT COUNT(m) FROM MovimientoInventario m")
    Long countTotalMovimientos();

    @Query("SELECT m.producto.nombre, m.tipoMovimiento, SUM(m.cantidad) " +
           "FROM MovimientoInventario m " +
           "GROUP BY m.producto.nombre, m.tipoMovimiento")
    List<Object[]> findResumenMovimientos();

    @Query("SELECT p.nombre, COUNT(m) " +
           "FROM MovimientoInventario m JOIN m.producto p " +
           "WHERE m.tipoMovimiento = 'SALIDA' " +
           "GROUP BY p.nombre ORDER BY COUNT(m) DESC")
    List<Object[]> findProductosMasVendidos();
}

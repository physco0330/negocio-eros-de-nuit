package com.negocio.repository;

import com.negocio.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByActivoTrue();

    List<Producto> findByCategoriaIdAndActivoTrue(Long categoriaId);

    List<Producto> findByMarcaIdAndActivoTrue(Long marcaId);

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
           "(LOWER(p.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%')))")
    List<Producto> buscar(@Param("busqueda") String busqueda);

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.stockActual <= p.stockMinimo")
    List<Producto> findProductosBajoStock();

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.stockActual = 0")
    List<Producto> findProductosAgotados();

    @Query("SELECT SUM(p.precioCompra * p.stockActual) FROM Producto p WHERE p.activo = true")
    BigDecimal calcularValorTotalInventario();

    @Query("SELECT SUM(p.precioVenta * p.stockActual) FROM Producto p WHERE p.activo = true")
    BigDecimal calcularVentasEstimadas();

    @Query("SELECT COUNT(p) FROM Producto p WHERE p.activo = true")
    Long countProductosActivos();

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.descuentoPorcentaje > 0")
    List<Producto> findProductosEnDescuento();

    @Query("SELECT p FROM Producto p WHERE p.activo = true ORDER BY p.fechaCreacion DESC")
    List<Producto> findProductosNuevos();
}

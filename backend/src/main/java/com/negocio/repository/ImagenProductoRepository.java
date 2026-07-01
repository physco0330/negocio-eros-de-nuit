package com.negocio.repository;

import com.negocio.model.ImagenProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ImagenProductoRepository extends JpaRepository<ImagenProducto, Long> {
    List<ImagenProducto> findByProductoId(Long productoId);
    ImagenProducto findByProductoIdAndPrincipalTrue(Long productoId);
    void deleteByProductoId(Long productoId);
}

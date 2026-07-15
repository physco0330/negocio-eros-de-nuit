package com.negocio.repository;

import com.negocio.model.Abono;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AbonoRepository extends JpaRepository<Abono, Long> {
    List<Abono> findByVentaIdOrderByFechaDesc(Long ventaId);
}

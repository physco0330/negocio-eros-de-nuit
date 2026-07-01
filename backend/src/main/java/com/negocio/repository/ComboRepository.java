package com.negocio.repository;

import com.negocio.model.Combo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ComboRepository extends JpaRepository<Combo, Long> {

    List<Combo> findByActivoTrue();

    @Query("SELECT c FROM Combo c WHERE c.activo = true ORDER BY c.nombre")
    List<Combo> findCombosActivos();
}

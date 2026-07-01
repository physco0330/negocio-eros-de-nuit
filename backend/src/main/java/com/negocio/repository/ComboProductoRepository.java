package com.negocio.repository;

import com.negocio.model.ComboProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComboProductoRepository extends JpaRepository<ComboProducto, Long> {

    List<ComboProducto> findByComboId(Long comboId);

    void deleteByComboId(Long comboId);
}

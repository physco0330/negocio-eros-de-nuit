package com.negocio.service;

import com.negocio.model.Marca;
import com.negocio.repository.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarcaService {

    @Autowired
    private MarcaRepository marcaRepository;

    public List<Marca> listarTodas() {
        return marcaRepository.findAll();
    }

    public Marca obtenerPorId(Long id) {
        return marcaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
    }

    public Marca crear(Marca marca) {
        return marcaRepository.save(marca);
    }

    public Marca actualizar(Long id, Marca marcaActualizada) {
        Marca marca = obtenerPorId(id);
        marca.setNombre(marcaActualizada.getNombre());
        marca.setDescripcion(marcaActualizada.getDescripcion());
        return marcaRepository.save(marca);
    }

    public void eliminar(Long id) {
        Marca marca = obtenerPorId(id);
        marca.setActivo(false);
        marcaRepository.save(marca);
    }
}

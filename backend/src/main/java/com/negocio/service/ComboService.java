package com.negocio.service;

import com.negocio.dto.*;
import com.negocio.model.*;
import com.negocio.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ComboService {

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private ComboProductoRepository comboProductoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<ComboDTO> listarTodos() {
        return comboRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ComboDTO> listarActivos() {
        return comboRepository.findByActivoTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ComboDTO obtenerPorId(Long id) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Combo no encontrado"));
        return toDTO(combo);
    }

    public ComboDTO crear(ComboCreateDTO dto) {
        Combo combo = Combo.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .precioCombo(dto.getPrecioCombo())
                .imagenUrl(dto.getImagenUrl())
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();

        Combo guardado = comboRepository.save(combo);

        if (dto.getProductos() != null && !dto.getProductos().isEmpty()) {
            List<ComboProducto> detalles = new ArrayList<>();
            for (ComboCreateDTO.DetalleDTO det : dto.getProductos()) {
                Producto producto = productoRepository.findById(det.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + det.getProductoId()));

                ComboProducto cp = ComboProducto.builder()
                        .combo(guardado)
                        .producto(producto)
                        .cantidad(det.getCantidad())
                        .build();
                detalles.add(cp);
            }
            comboProductoRepository.saveAll(detalles);
            guardado.setProductos(detalles);
        }

        return toDTO(guardado);
    }

    public ComboDTO actualizar(Long id, ComboCreateDTO dto) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Combo no encontrado"));

        combo.setNombre(dto.getNombre());
        combo.setDescripcion(dto.getDescripcion());
        combo.setPrecioCombo(dto.getPrecioCombo());
        combo.setImagenUrl(dto.getImagenUrl());
        if (dto.getActivo() != null) {
            combo.setActivo(dto.getActivo());
        }

        List<ComboProducto> existentes = comboProductoRepository.findByComboId(id);
        comboProductoRepository.deleteAll(existentes);

        List<ComboProducto> nuevosDetalles = new ArrayList<>();
        if (dto.getProductos() != null) {
            for (ComboCreateDTO.DetalleDTO det : dto.getProductos()) {
                Producto producto = productoRepository.findById(det.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

                ComboProducto cp = ComboProducto.builder()
                        .combo(combo)
                        .producto(producto)
                        .cantidad(det.getCantidad())
                        .build();
                nuevosDetalles.add(cp);
            }
            comboProductoRepository.saveAll(nuevosDetalles);
        }
        combo.setProductos(nuevosDetalles);

        Combo actualizado = comboRepository.save(combo);
        return toDTO(actualizado);
    }

    public void eliminar(Long id) {
        if (!comboRepository.existsById(id)) {
            throw new RuntimeException("Combo no encontrado");
        }
        comboRepository.deleteById(id);
    }

    private ComboDTO toDTO(Combo combo) {
        List<ComboDTO.ComboProductoDTO> productosDTO = Collections.emptyList();
        if (combo.getProductos() != null) {
            productosDTO = combo.getProductos().stream()
                    .map(cp -> ComboDTO.ComboProductoDTO.builder()
                            .id(cp.getId())
                            .productoId(cp.getProducto().getId())
                            .productoNombre(cp.getProducto().getNombre())
                            .productoPrecio(cp.getProducto().getPrecioVenta())
                            .cantidad(cp.getCantidad())
                            .build())
                    .collect(Collectors.toList());
        }

        return ComboDTO.builder()
                .id(combo.getId())
                .nombre(combo.getNombre())
                .descripcion(combo.getDescripcion())
                .precioCombo(combo.getPrecioCombo())
                .imagenUrl(combo.getImagenUrl())
                .activo(combo.getActivo())
                .productos(productosDTO)
                .build();
    }
}

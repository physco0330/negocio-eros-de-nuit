package com.negocio.controller;

import com.negocio.dto.*;
import com.negocio.service.ComboService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/combos")
public class ComboController {

    @Autowired
    private ComboService comboService;

    @GetMapping
    public ResponseEntity<List<ComboDTO>> listar() {
        return ResponseEntity.ok(comboService.listarTodos());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<ComboDTO>> listarActivos() {
        return ResponseEntity.ok(comboService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComboDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(comboService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<ComboDTO> crear(@RequestBody ComboCreateDTO dto) {
        return ResponseEntity.ok(comboService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComboDTO> actualizar(@PathVariable Long id, @RequestBody ComboCreateDTO dto) {
        return ResponseEntity.ok(comboService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        comboService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

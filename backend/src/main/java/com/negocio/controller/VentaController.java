package com.negocio.controller;

import com.negocio.dto.*;
import com.negocio.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @GetMapping
    public ResponseEntity<List<VentaDTO>> listar() {
        return ResponseEntity.ok(ventaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.obtenerPorId(id));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<VentaDTO>> porEstado(@PathVariable String estado) {
        return ResponseEntity.ok(ventaService.porEstado(estado));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<VentaDTO>> buscar(@RequestParam String cliente) {
        return ResponseEntity.ok(ventaService.buscarPorCliente(cliente));
    }

    @PostMapping
    public ResponseEntity<VentaDTO> crear(@RequestBody VentaCreateDTO dto) {
        return ResponseEntity.ok(ventaService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VentaDTO> actualizar(@PathVariable Long id, @RequestBody VentaCreateDTO dto) {
        return ResponseEntity.ok(ventaService.actualizar(id, dto));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<VentaDTO> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ventaService.actualizarEstado(id, body.get("estado")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ventaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Object>> resumen() {
        return ResponseEntity.ok(ventaService.resumenVentas());
    }
}

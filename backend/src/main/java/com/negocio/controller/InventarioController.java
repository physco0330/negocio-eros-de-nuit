package com.negocio.controller;

import com.negocio.dto.*;
import com.negocio.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @GetMapping
    public ResponseEntity<List<MovimientoDTO>> listar() {
        return ResponseEntity.ok(inventarioService.listarTodos());
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<MovimientoDTO>> porProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(inventarioService.porProducto(productoId));
    }

    @PostMapping
    public ResponseEntity<MovimientoDTO> registrar(@RequestBody MovimientoCreateDTO dto) {
        return ResponseEntity.ok(inventarioService.registrarMovimiento(dto));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> dashboard() {
        return ResponseEntity.ok(inventarioService.obtenerDashboard());
    }

    @GetMapping("/productos-mas-vendidos")
    public ResponseEntity<List<Map<String, Object>>> productosMasVendidos() {
        return ResponseEntity.ok(inventarioService.productosMasVendidos());
    }

    @GetMapping("/resumen-movimientos")
    public ResponseEntity<List<Map<String, Object>>> resumenMovimientos() {
        return ResponseEntity.ok(inventarioService.resumenMovimientos());
    }

    @GetMapping("/bajo-stock")
    public ResponseEntity<List<ProductoDTO>> bajoStock() {
        return ResponseEntity.ok(inventarioService.productosBajoStock());
    }

    @GetMapping("/agotados")
    public ResponseEntity<List<ProductoDTO>> agotados() {
        return ResponseEntity.ok(inventarioService.productosAgotados());
    }
}

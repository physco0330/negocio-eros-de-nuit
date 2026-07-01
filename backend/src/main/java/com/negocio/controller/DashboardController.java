package com.negocio.controller;

import com.negocio.dto.*;
import com.negocio.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private InventarioService inventarioService;

    @GetMapping
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
}

package com.negocio.controller;

import com.negocio.service.AbonoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/abonos")
public class AbonoController {

    @Autowired
    private AbonoService abonoService;

    @GetMapping("/venta/{ventaId}")
    public ResponseEntity<?> listarPorVenta(@PathVariable Long ventaId) {
        return ResponseEntity.ok(abonoService.listarPorVenta(ventaId));
    }

    @PostMapping("/venta/{ventaId}")
    public ResponseEntity<?> crear(@PathVariable Long ventaId, @RequestBody Map<String, Object> body) {
        BigDecimal monto = new BigDecimal(body.get("monto").toString());
        String observacion = body.get("observacion") != null ? body.get("observacion").toString() : null;
        return ResponseEntity.ok(abonoService.crear(ventaId, monto, observacion));
    }

    @DeleteMapping("/{abonoId}")
    public ResponseEntity<?> eliminar(@PathVariable Long abonoId) {
        abonoService.eliminar(abonoId);
        return ResponseEntity.ok(Map.of("message", "Abono eliminado"));
    }
}

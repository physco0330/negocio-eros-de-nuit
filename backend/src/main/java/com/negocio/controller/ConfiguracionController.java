package com.negocio.controller;

import com.negocio.model.Configuracion;
import com.negocio.service.ConfiguracionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracion")
public class ConfiguracionController {

    @Autowired
    private ConfiguracionService configuracionService;

    @GetMapping
    public ResponseEntity<Configuracion> obtener() {
        return ResponseEntity.ok(configuracionService.obtener());
    }

    @PutMapping
    public ResponseEntity<Configuracion> actualizar(@RequestBody Configuracion configuracion) {
        return ResponseEntity.ok(configuracionService.actualizar(configuracion));
    }
}

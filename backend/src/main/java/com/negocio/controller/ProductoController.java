package com.negocio.controller;

import com.negocio.dto.ProductoCreateDTO;
import com.negocio.dto.ProductoDTO;
import com.negocio.model.ImagenProducto;
import com.negocio.repository.ImagenProductoRepository;
import com.negocio.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private ImagenProductoRepository imagenProductoRepository;

    @GetMapping
    public ResponseEntity<List<ProductoDTO>> listar() {
        return ResponseEntity.ok(productoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProductoDTO>> buscar(@RequestParam String q) {
        return ResponseEntity.ok(productoService.buscar(q));
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProductoDTO>> porCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(productoService.porCategoria(categoriaId));
    }

    @GetMapping("/marca/{marcaId}")
    public ResponseEntity<List<ProductoDTO>> porMarca(@PathVariable Long marcaId) {
        return ResponseEntity.ok(productoService.porMarca(marcaId));
    }

    @GetMapping("/descuento")
    public ResponseEntity<List<ProductoDTO>> enDescuento() {
        return ResponseEntity.ok(productoService.enDescuento());
    }

    @GetMapping("/nuevos")
    public ResponseEntity<List<ProductoDTO>> nuevos() {
        return ResponseEntity.ok(productoService.nuevos());
    }

    @GetMapping("/destacados")
    public ResponseEntity<List<ProductoDTO>> destacados() {
        return ResponseEntity.ok(productoService.destacados());
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> crear(@RequestBody ProductoCreateDTO dto) {
        return ResponseEntity.ok(productoService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> actualizar(@PathVariable Long id, @RequestBody ProductoCreateDTO dto) {
        return ResponseEntity.ok(productoService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{productoId}/imagenes")
    public ResponseEntity<ImagenProducto> agregarImagen(
            @PathVariable Long productoId,
            @RequestParam String urlImagen,
            @RequestParam(defaultValue = "false") Boolean principal) {
        ProductoDTO producto = productoService.obtenerPorId(productoId);
        com.negocio.model.Producto prod = new com.negocio.model.Producto();
        prod.setId(productoId);

        if (principal) {
            imagenProductoRepository.findByProductoId(productoId).forEach(img -> {
                img.setPrincipal(false);
                imagenProductoRepository.save(img);
            });
        }

        ImagenProducto imagen = ImagenProducto.builder()
                .producto(prod)
                .urlImagen(urlImagen)
                .principal(principal)
                .build();

        return ResponseEntity.ok(imagenProductoRepository.save(imagen));
    }

    @DeleteMapping("/imagenes/{imagenId}")
    public ResponseEntity<Void> eliminarImagen(@PathVariable Long imagenId) {
        imagenProductoRepository.deleteById(imagenId);
        return ResponseEntity.noContent().build();
    }
}

package com.negocio.service;

import com.negocio.dto.ProductoDTO;
import com.negocio.dto.ProductoCreateDTO;
import com.negocio.model.*;
import com.negocio.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private MarcaRepository marcaRepository;

    @Autowired
    private ImagenProductoRepository imagenProductoRepository;

    @Autowired
    private MovimientoInventarioRepository movimientoInventarioRepository;

    public List<ProductoDTO> listarTodos() {
        return productoRepository.findByActivoTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProductoDTO obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return toDTO(producto);
    }

    public ProductoDTO crear(ProductoCreateDTO dto) {
        Producto producto = Producto.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .precioCompra(dto.getPrecioCompra())
                .precioVenta(dto.getPrecioVenta())
                .descuentoPorcentaje(dto.getDescuentoPorcentaje() != null ? dto.getDescuentoPorcentaje() : BigDecimal.ZERO)
                .stockActual(dto.getStockActual())
                .stockMinimo(dto.getStockMinimo() != null ? dto.getStockMinimo() : 5)
                .activo(true)
                .build();

        if (dto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            producto.setCategoria(categoria);
        }

        if (dto.getMarcaId() != null) {
            Marca marca = marcaRepository.findById(dto.getMarcaId())
                    .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
            producto.setMarca(marca);
        }

        Producto guardado = productoRepository.save(producto);

        if (dto.getStockActual() != null && dto.getStockActual() > 0) {
            MovimientoInventario movimiento = MovimientoInventario.builder()
                    .producto(guardado)
                    .tipoMovimiento(MovimientoInventario.TipoMovimiento.ENTRADA)
                    .cantidad(dto.getStockActual())
                    .observacion("Stock inicial del producto")
                    .build();
            movimientoInventarioRepository.save(movimiento);
        }

        return toDTO(guardado);
    }

    public ProductoDTO actualizar(Long id, ProductoCreateDTO dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecioCompra(dto.getPrecioCompra());
        producto.setPrecioVenta(dto.getPrecioVenta());
        producto.setDescuentoPorcentaje(dto.getDescuentoPorcentaje() != null ? dto.getDescuentoPorcentaje() : BigDecimal.ZERO);
        producto.setStockActual(dto.getStockActual());
        producto.setStockMinimo(dto.getStockMinimo() != null ? dto.getStockMinimo() : 5);

        if (dto.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            producto.setCategoria(categoria);
        }

        if (dto.getMarcaId() != null) {
            Marca marca = marcaRepository.findById(dto.getMarcaId())
                    .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
            producto.setMarca(marca);
        }

        Producto actualizado = productoRepository.save(producto);
        return toDTO(actualizado);
    }

    public void eliminar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    public List<ProductoDTO> buscar(String busqueda) {
        return productoRepository.buscar(busqueda).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> porCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaIdAndActivoTrue(categoriaId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> porMarca(Long marcaId) {
        return productoRepository.findByMarcaIdAndActivoTrue(marcaId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> enDescuento() {
        return productoRepository.findProductosEnDescuento().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> nuevos() {
        return productoRepository.findProductosNuevos().stream()
                .limit(10)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> destacados() {
        List<Object[]> masVendidos = movimientoInventarioRepository.findProductosMasVendidos();
        return masVendidos.stream()
                .limit(10)
                .map(row -> {
                    String nombre = (String) row[0];
                    return productoRepository.buscar(nombre).stream()
                            .findFirst()
                            .map(this::toDTO)
                            .orElse(null);
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    private ProductoDTO toDTO(Producto producto) {
        List<ProductoDTO.ImagenDTO> imagenes = imagenProductoRepository.findByProductoId(producto.getId())
                .stream()
                .map(img -> ProductoDTO.ImagenDTO.builder()
                        .id(img.getId())
                        .urlImagen(img.getUrlImagen())
                        .principal(img.getPrincipal())
                        .build())
                .collect(Collectors.toList());

        return ProductoDTO.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .categoriaId(producto.getCategoria() != null ? producto.getCategoria().getId() : null)
                .categoriaNombre(producto.getCategoria() != null ? producto.getCategoria().getNombre() : null)
                .marcaId(producto.getMarca() != null ? producto.getMarca().getId() : null)
                .marcaNombre(producto.getMarca() != null ? producto.getMarca().getNombre() : null)
                .precioCompra(producto.getPrecioCompra())
                .precioVenta(producto.getPrecioVenta())
                .descuentoPorcentaje(producto.getDescuentoPorcentaje())
                .precioConDescuento(producto.getPrecioConDescuento())
                .stockActual(producto.getStockActual())
                .stockMinimo(producto.getStockMinimo())
                .activo(producto.getActivo())
                .imagenes(imagenes)
                .fechaCreacion(producto.getFechaCreacion())
                .fechaActualizacion(producto.getFechaActualizacion())
                .build();
    }
}

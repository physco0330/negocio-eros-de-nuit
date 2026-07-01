package com.negocio.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "combo_producto")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComboProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combo_id", nullable = false)
    private Combo combo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;
}

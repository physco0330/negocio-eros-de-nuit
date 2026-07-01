package com.negocio.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "configuracion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Configuracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String whatsappNegocio;

    private String nombreTienda = "Negocio Perfumes";

    private String logo;

    private String bannerPrincipal;

    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;
}

package com.negocio.service;

import com.negocio.model.Configuracion;
import com.negocio.repository.ConfiguracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfiguracionService {

    @Autowired
    private ConfiguracionRepository configuracionRepository;

    public Configuracion obtener() {
        List<Configuracion> lista = configuracionRepository.findAll();
        if (lista.isEmpty()) {
            Configuracion config = Configuracion.builder()
                    .whatsappNegocio("573001234567")
                    .nombreTienda("Luxury Perfumes")
                    .build();
            return configuracionRepository.save(config);
        }
        return lista.get(0);
    }

    public Configuracion actualizar(Configuracion configActualizada) {
        Configuracion config = obtener();
        config.setWhatsappNegocio(configActualizada.getWhatsappNegocio());
        config.setNombreTienda(configActualizada.getNombreTienda());
        config.setLogo(configActualizada.getLogo());
        config.setBannerPrincipal(configActualizada.getBannerPrincipal());
        return configuracionRepository.save(config);
    }
}

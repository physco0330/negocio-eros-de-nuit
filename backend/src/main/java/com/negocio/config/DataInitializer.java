package com.negocio.config;

import com.negocio.model.Usuario;
import com.negocio.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createIfNotExists("Administrador", "admin@negocio.com", "admin123", Usuario.Rol.SUPER_ADMIN);
        createIfNotExists("Admin 2", "admin2@negocio.com", "admin123", Usuario.Rol.SUPER_ADMIN);
        createIfNotExists("Admin 3", "admin3@negocio.com", "admin123", Usuario.Rol.SUPER_ADMIN);
    }

    private void createIfNotExists(String nombre, String correo, String contrasena, Usuario.Rol rol) {
        if (!usuarioRepository.existsByCorreo(correo)) {
            Usuario user = Usuario.builder()
                    .nombre(nombre)
                    .correo(correo)
                    .contrasena(passwordEncoder.encode(contrasena))
                    .rol(rol)
                    .build();
            usuarioRepository.save(user);
            System.out.println("=== USER CREATED: " + correo + " / " + contrasena + " [" + rol + "] ===");
        }
    }
}

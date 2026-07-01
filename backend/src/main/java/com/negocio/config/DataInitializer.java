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
        if (!usuarioRepository.existsByCorreo("admin@negocio.com")) {
            Usuario admin = Usuario.builder()
                    .nombre("Administrador")
                    .correo("admin@negocio.com")
                    .contrasena(passwordEncoder.encode("admin123"))
                    .rol(Usuario.Rol.SUPER_ADMIN)
                    .build();
            usuarioRepository.save(admin);
            System.out.println("=== ADMIN USER CREATED: admin@negocio.com / admin123 ===");
        }
    }
}

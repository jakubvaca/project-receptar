package cz.osu.projectreceptar;

import cz.osu.projectreceptar.model.entity.User;
import cz.osu.projectreceptar.model.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class ProjectReceptarApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectReceptarApplication.class, args);
    }

    // TATO ČÁST VYTVOŘÍ TESTOVACÍHO UŽIVATELE PŘI STARTU
    // Uprav v ProjectReceptarApplication.java:
    @Bean
    CommandLineRunner init(UserRepository userRepository, BCryptPasswordEncoder encoder) {
        return args -> {
            if (userRepository.findByUsername("jakub").isEmpty()) {
                User user = new User();
                user.setUsername("jakub");
                user.setPasswordHash(encoder.encode("tajneheslo")); // ZAŠIFROVÁNO
                user.setEmail("jakub@osu.cz");
                userRepository.save(user);
            }
        };
    }
}
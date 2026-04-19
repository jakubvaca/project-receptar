package cz.osu.projectreceptar.service;

import cz.osu.projectreceptar.model.dto.AuthResponseDto;
import cz.osu.projectreceptar.model.dto.LoginRequestDto;
import cz.osu.projectreceptar.model.entity.User;
import cz.osu.projectreceptar.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Import pro šifrování
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder; // Tohle si Spring sám "přitáhne" ze SecurityConfigu

    public AuthResponseDto login(LoginRequestDto request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Uživatel neexistuje!");
        }

        User user = userOptional.get();

        // TADY JE TA ZMĚNA: Porovnáváme heslo z formuláře se zašifrovaným heslem v DB
        if (!encoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Špatné heslo!");
        }

        return new AuthResponseDto(user.getId(), user.getUsername(), "Přihlášení úspěšné");
    }

    // Metoda pro registraci nového uživatele
    public AuthResponseDto register(User user) {
        // Zašifrujeme heslo dřív, než ho uložíme do databáze
        user.setPasswordHash(encoder.encode(user.getPasswordHash()));
        User savedUser = userRepository.save(user);
        return new AuthResponseDto(savedUser.getId(), savedUser.getUsername(), "Registrace byla úspěšná");
    }
}
package cz.osu.projectreceptar.service;

import cz.osu.projectreceptar.model.dto.AuthResponseDto;
import cz.osu.projectreceptar.model.dto.LoginRequestDto;
import cz.osu.projectreceptar.model.entity.User;
import cz.osu.projectreceptar.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder; // Přitaženo ze SecurityConfigu

    public AuthResponseDto login(LoginRequestDto request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Uživatel neexistuje!");
        }

        User user = userOptional.get();

        // Porovnáváme heslo z formuláře se zašifrovaným heslem v DB
        if (!encoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Špatné heslo!");
        }

        return new AuthResponseDto(user.getId(), user.getUsername(), "Přihlášení úspěšné");
    }

    public AuthResponseDto register(User user) {
        // 1. Kontrola, jestli už uživatel s tímto jménem neexistuje
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Uživatelské jméno je již obsazené!");
        }

        // 2. Zašifrujeme heslo dřív, než ho uložíme do databáze
        user.setPasswordHash(encoder.encode(user.getPasswordHash()));

        // 3. Uložení do H2 in-memory databáze
        User savedUser = userRepository.save(user);

        return new AuthResponseDto(savedUser.getId(), savedUser.getUsername(), "Registrace byla úspěšná");
    }
}
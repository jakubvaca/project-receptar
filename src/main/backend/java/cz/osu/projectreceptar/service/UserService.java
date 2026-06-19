package cz.osu.projectreceptar.service;

import cz.osu.projectreceptar.model.dto.AuthResponseDto;
import cz.osu.projectreceptar.model.dto.LoginRequestDto;
import cz.osu.projectreceptar.model.entity.User;
import cz.osu.projectreceptar.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.web.context.SecurityContextRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder; // Přitaženo ze SecurityConfigu
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public AuthResponseDto login(LoginRequestDto request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        // Použijeme AuthenticationManager pro ověření credentials přes UserDetailsServiceImpl
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        Authentication authentication = authenticationManager.authenticate(token);

        // Pokud je autentizace úspěšná, uložíme ji do SecurityContext
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        // Uložení kontextu do repozitáře (typicky HttpSessionSecurityContextRepository)
        securityContextRepository.saveContext(context, httpRequest, httpResponse);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen!"));

        return new AuthResponseDto(user.getId(), user.getUsername(), "Přihlášení úspěšné");
    }

    public AuthResponseDto register(User user, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        // 1. Kontrola, jestli už uživatel s tímto jménem neexistuje
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Uživatelské jméno je již obsazené!");
        }

        String plainPassword = user.getPasswordHash();

        // 2. Zašifrujeme heslo dřív, než ho uložíme do databáze
        user.setPasswordHash(encoder.encode(plainPassword));

        // 3. Uložení do databáze
        User savedUser = userRepository.save(user);

        // 4. Automatické přihlášení po registraci
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user.getUsername(), plainPassword);
        Authentication authentication = authenticationManager.authenticate(token);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);

        return new AuthResponseDto(savedUser.getId(), savedUser.getUsername(), "Registrace byla úspěšná");
    }
}
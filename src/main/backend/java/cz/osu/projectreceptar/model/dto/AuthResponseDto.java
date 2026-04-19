package cz.osu.projectreceptar.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDto {
    private Long userId;
    private String username;
    private String message;
}

package cz.osu.projectreceptar.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IngredientDto {

    @NotBlank(message = "Název suroviny nesmí být prázdný")
    private String name;

    @NotNull(message = "Množství musí být zadáno")
    @DecimalMin(value = "0.0", inclusive = false, message = "Množství musí být větší než 0")
    private Double amount;

    @NotBlank(message = "Jednotka nesmí být prázdná")
    private String unit;
}

package cz.osu.projectreceptar.model.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class RecipeCreateDto {
    @NotBlank(message = "Název receptu nesmí být prázdný")
    private String title;

    @NotBlank(message = "Instrukce nesmí být prázdné")
    private String instructions;

    // authorId odstraněno, aby nebylo možné podvrhnout z frontendu

    @NotEmpty(message = "Recept musí obsahovat alespoň jednu surovinu")
    @Valid
    private List<IngredientDto> ingredients;
}

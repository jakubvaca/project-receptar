package cz.osu.projectreceptar.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class RecipeResponseDto {
    private Long id;
    private String title;
    private String instructions;
    private String authorName;
    private List<IngredientDto> ingredients;
}
package cz.osu.projectreceptar.model.dto;

import lombok.Data;

@Data
public class RecipeCreateDto {
    private String title;
    private String instructions;
    private Long authorId;
    private List<IngredientDto> ingredients;
}

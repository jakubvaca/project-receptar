package cz.osu.projectreceptar.controller;

import cz.osu.projectreceptar.model.dto.PageResponseDto;
import cz.osu.projectreceptar.model.dto.RecipeCreateDto;
import cz.osu.projectreceptar.model.dto.RecipeResponseDto;
import cz.osu.projectreceptar.model.entity.Recipe;
import cz.osu.projectreceptar.service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor

public class RecipeController {

    private final RecipeService recipeService;

    @PostMapping
    public ResponseEntity<String> createRecipe(@Valid @RequestBody RecipeCreateDto dto) {
        Recipe recipe = recipeService.createRecipe(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Recept vytvoren jeho ID je: " + recipe.getId());
    }

    @GetMapping
    public ResponseEntity<PageResponseDto<RecipeResponseDto>> getAllRecipes(
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "6", required = false) int size) {
        PageResponseDto<RecipeResponseDto> recipes = recipeService.getAllRecipes(page, size);
        return ResponseEntity.ok(recipes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateRecipe(@PathVariable Long id, @Valid @RequestBody RecipeCreateDto dto) {
        recipeService.updateRecipe(id, dto);
        return ResponseEntity.ok("Recept úspěšně aktualizován.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.ok("Recept úspěšně smazán.");
    }

}

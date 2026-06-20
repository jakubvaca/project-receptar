package cz.osu.projectreceptar.controller;

import cz.osu.projectreceptar.model.dto.RecipeCreateDto;
import cz.osu.projectreceptar.model.dto.RecipeResponseDto;
import cz.osu.projectreceptar.model.entity.Recipe;
import cz.osu.projectreceptar.service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<List<RecipeResponseDto>> getAllRecipes() {
        List<RecipeResponseDto> recipes = recipeService.getAllRecipes();
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

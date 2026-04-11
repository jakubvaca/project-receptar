package cz.osu.projectreceptar.service;

import cz.osu.projectreceptar.model.dto.IngredientDto;
import cz.osu.projectreceptar.model.dto.RecipeCreateDto;
import cz.osu.projectreceptar.model.dto.RecipeResponseDto;
import cz.osu.projectreceptar.model.entity.Ingredient;
import cz.osu.projectreceptar.model.entity.Recipe;
import cz.osu.projectreceptar.model.entity.RecipeIngredient;
import cz.osu.projectreceptar.model.entity.User;
import cz.osu.projectreceptar.model.repository.IngredientRepository;
import cz.osu.projectreceptar.model.repository.RecipeIngredientRepository;
import cz.osu.projectreceptar.model.repository.RecipeRepository;
import cz.osu.projectreceptar.model.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final UserRepository userRepository;

    @Transactional
    public Recipe createRecipe(RecipeCreateDto dto) {

        // Najdeme autora (nyní máme v DB uživatele s ID 1, kterého jsi vytvořil)
        User author = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Autor nebyl nalezen"));

        // Vytvoříme a uložíme základní recept
        Recipe newRecipe = new Recipe();
        newRecipe.setTitle(dto.getTitle());
        newRecipe.setInstructions(dto.getInstructions());
        newRecipe.setAuthor(author);
        Recipe savedRecipe = recipeRepository.save(newRecipe);

        // Zpracujeme suroviny
        for (IngredientDto ingDto : dto.getIngredients()) {
            // Najdeme surovinu v DB podle jména, pokud neexistuje, vytvoříme ji
            Ingredient ingredient = ingredientRepository.findByNameIgnoreCase(ingDto.getName())
                    .orElseGet(() -> {
                        Ingredient newIngredient = new Ingredient();
                        newIngredient.setName(ingDto.getName());
                        return ingredientRepository.save(newIngredient);
                    });

            // Vytvoříme vazbu mezi receptem a surovinou
            RecipeIngredient recipeIngredient = new RecipeIngredient();
            recipeIngredient.setRecipe(savedRecipe);
            recipeIngredient.setIngredient(ingredient);
            recipeIngredient.setAmount(ingDto.getAmount());
            recipeIngredient.setUnit(ingDto.getUnit());

            recipeIngredientRepository.save(recipeIngredient);
        }
        return savedRecipe;
    }

        public List<RecipeResponseDto> getAllRecipes(){
            List<Recipe> recipes = recipeRepository.findAll();

            return recipes.stream().map(recipe -> {
                RecipeResponseDto dto = new RecipeResponseDto();
                dto.setId(recipe.getId());
                dto.setTitle(recipe.getTitle());
                dto.setInstructions(recipe.getInstructions());
                dto.setAuthorName(recipe.getAuthor().getUsername());

                // Přemapujeme i seznam surovin
                List<IngredientDto> ingredientDtos = recipe.getRecipeIngredients().stream().map(ri -> {
                    IngredientDto iDto = new IngredientDto();
                    iDto.setName(ri.getIngredient().getName());
                    iDto.setAmount(ri.getAmount());
                    iDto.setUnit(ri.getUnit());
                    return iDto;
                }).toList();

                dto.setIngredients(ingredientDtos);
                return dto;
            }).toList();
    }
}

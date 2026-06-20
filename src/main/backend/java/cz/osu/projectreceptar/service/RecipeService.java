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
import cz.osu.projectreceptar.model.dto.PageResponseDto;
import cz.osu.projectreceptar.model.repository.RecipeRepository;
import cz.osu.projectreceptar.model.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User author = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Přihlášený uživatel nebyl nalezen v databázi."));

        // 2. Vytvoříme a uložíme základní recept
        Recipe newRecipe = new Recipe();
        newRecipe.setTitle(dto.getTitle());
        newRecipe.setInstructions(dto.getInstructions());
        newRecipe.setAuthor(author); // Tady už proměnnou 'author' máme k dispozici

        Recipe savedRecipe = recipeRepository.save(newRecipe);

        // 3. Zpracujeme suroviny
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

        @Transactional
        public Recipe updateRecipe(Long id, RecipeCreateDto dto) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();

            Recipe existingRecipe = recipeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Recept nebyl nalezen."));

            if (!existingRecipe.getAuthor().getUsername().equals(currentUsername)) {
                throw new RuntimeException("Nemáte oprávnění upravovat tento recept. Nejste jeho autorem.");
            }

            existingRecipe.setTitle(dto.getTitle());
            existingRecipe.setInstructions(dto.getInstructions());

            // Odstranění původních surovin
            recipeIngredientRepository.deleteAll(existingRecipe.getRecipeIngredients());
            existingRecipe.getRecipeIngredients().clear();

            // Vytvoření nových surovin
            for (IngredientDto ingDto : dto.getIngredients()) {
                Ingredient ingredient = ingredientRepository.findByNameIgnoreCase(ingDto.getName())
                        .orElseGet(() -> {
                            Ingredient newIngredient = new Ingredient();
                            newIngredient.setName(ingDto.getName());
                            return ingredientRepository.save(newIngredient);
                        });

                RecipeIngredient recipeIngredient = new RecipeIngredient();
                recipeIngredient.setRecipe(existingRecipe);
                recipeIngredient.setIngredient(ingredient);
                recipeIngredient.setAmount(ingDto.getAmount());
                recipeIngredient.setUnit(ingDto.getUnit());

                existingRecipe.getRecipeIngredients().add(recipeIngredient);
            }

            return recipeRepository.save(existingRecipe);
        }

        @Transactional
        public void deleteRecipe(Long id) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();

            Recipe existingRecipe = recipeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Recept nebyl nalezen."));

            if (!existingRecipe.getAuthor().getUsername().equals(currentUsername)) {
                throw new RuntimeException("Nemáte oprávnění smazat tento recept. Nejste jeho autorem.");
            }

            recipeRepository.delete(existingRecipe);
        }

        @Transactional(readOnly = true)
        public PageResponseDto<RecipeResponseDto> getAllRecipes(int pageNo, int pageSize){
            Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("id").descending());
            Page<Recipe> recipes = recipeRepository.findAllWithAuthor(pageable);

            List<RecipeResponseDto> content = recipes.stream().map(recipe -> {
                RecipeResponseDto dto = new RecipeResponseDto();
                dto.setId(recipe.getId());
                dto.setTitle(recipe.getTitle());
                dto.setInstructions(recipe.getInstructions());
                dto.setAuthorName(recipe.getAuthor().getUsername());

                // Přemapujeme i seznam surovin (Suroviny se vytáhnou díky batch-fetchingu bez N+1)
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

            return new PageResponseDto<>(
                    content,
                    recipes.getNumber(),
                    recipes.getSize(),
                    recipes.getTotalElements(),
                    recipes.getTotalPages(),
                    recipes.isLast()
            );
    }
}

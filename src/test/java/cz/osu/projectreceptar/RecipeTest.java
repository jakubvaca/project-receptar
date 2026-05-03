package cz.osu.projectreceptar;

import cz.osu.projectreceptar.model.dto.IngredientDto;
import cz.osu.projectreceptar.model.dto.RecipeCreateDto;
import cz.osu.projectreceptar.model.dto.RecipeResponseDto;
import cz.osu.projectreceptar.model.entity.Recipe;
import cz.osu.projectreceptar.model.entity.User;
import cz.osu.projectreceptar.model.repository.IngredientRepository;
import cz.osu.projectreceptar.model.repository.RecipeIngredientRepository;
import cz.osu.projectreceptar.model.repository.RecipeRepository;
import cz.osu.projectreceptar.model.repository.UserRepository;
import cz.osu.projectreceptar.service.RecipeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecipeServiceTest {

    @Mock
    private RecipeRepository recipeRepository;
    @Mock
    private IngredientRepository ingredientRepository;
    @Mock
    private RecipeIngredientRepository recipeIngredientRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RecipeService recipeService;

    @Test
    void createRecipe_ShouldSuccess() {
        // Arrange
        Long authorId = 1L;
        User author = new User();
        author.setId(authorId);
        author.setUsername("petr");

        RecipeCreateDto dto = new RecipeCreateDto();
        dto.setAuthorId(authorId);
        dto.setTitle("Test recept");
        dto.setIngredients(Collections.emptyList());

        Recipe savedRecipe = new Recipe();
        savedRecipe.setId(10L);
        savedRecipe.setTitle("Test recept");

        when(userRepository.findById(authorId)).thenReturn(Optional.of(author));
        when(recipeRepository.save(any(Recipe.class))).thenReturn(savedRecipe);

        // Act
        Recipe result = recipeService.createRecipe(dto);

        // Assert
        assertNotNull(result);
        assertEquals("Test recept", result.getTitle());
        verify(recipeRepository, times(1)).save(any());
    }

    @Test
    void createRecipe_ShouldThrowException_WhenAuthorNotFound() {
        // Arrange
        RecipeCreateDto dto = new RecipeCreateDto();
        dto.setAuthorId(999L);

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> recipeService.createRecipe(dto));
        verify(recipeRepository, never()).save(any());
    }

    @Test
    void getAllRecipes_ShouldReturnCorrectDto() {
        // Arrange
        User author = new User();
        author.setUsername("petr");

        Recipe recipe = new Recipe();
        recipe.setTitle("Gulaš");
        recipe.setAuthor(author);
        recipe.setRecipeIngredients(Collections.emptyList());

        when(recipeRepository.findAll()).thenReturn(List.of(recipe));

        // Act
        List<RecipeResponseDto> results = recipeService.getAllRecipes();

        // Assert
        assertFalse(results.isEmpty());
        assertEquals("Gulaš", results.get(0).getTitle());
        assertEquals("petr", results.get(0).getAuthorName());
    }
}
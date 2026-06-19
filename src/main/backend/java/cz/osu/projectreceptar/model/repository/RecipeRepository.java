package cz.osu.projectreceptar.model.repository;

import cz.osu.projectreceptar.model.entity.Recipe;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe,Long> {

    @EntityGraph(attributePaths = {"author", "recipeIngredients", "recipeIngredients.ingredient"})
    @Query("SELECT r FROM Recipe r")
    List<Recipe> findAllWithDetails();

}

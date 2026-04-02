package cz.osu.projectreceptar.model.repository;

import cz.osu.projectreceptar.model.entity.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient,Long> {
}

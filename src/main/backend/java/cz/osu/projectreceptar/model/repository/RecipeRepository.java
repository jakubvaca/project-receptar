package cz.osu.projectreceptar.model.repository;

import cz.osu.projectreceptar.model.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe,Long> {

}

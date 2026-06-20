package cz.osu.projectreceptar.model.repository;

import cz.osu.projectreceptar.model.entity.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe,Long> {

    @EntityGraph(attributePaths = {"author"})
    @Query("SELECT r FROM Recipe r")
    Page<Recipe> findAllWithAuthor(Pageable pageable);

}

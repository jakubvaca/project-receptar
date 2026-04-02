package cz.osu.projectreceptar.model.repository;

import cz.osu.projectreceptar.model.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface IngredientRepository extends JpaRepository<Ingredient,Long> {
    Optional<Ingredient> findByNameIgnoreCase(String name);
    //radsi dam ingore case, at nevznikaji duplikaty jkao sul / Sul
}

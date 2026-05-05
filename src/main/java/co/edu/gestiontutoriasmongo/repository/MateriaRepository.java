package co.edu.gestiontutoriasmongo.repository;

import co.edu.gestiontutoriasmongo.model.Materia;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MateriaRepository extends MongoRepository<Materia,String> {
    Optional<Materia> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}


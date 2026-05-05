package co.edu.gestiontutoriasmongo.repository;

import co.edu.gestiontutoriasmongo.model.EstadoFranja;
import co.edu.gestiontutoriasmongo.model.FranjaHoraria;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface FranjaHorariaRepository extends MongoRepository<FranjaHoraria, String> {
    List<FranjaHoraria> findByEstado(EstadoFranja estado);
    List<FranjaHoraria> findByTutorId(String tutorId);
    List<FranjaHoraria> findByMateriaId(String materiaId);
    List<FranjaHoraria> findByFecha(LocalDate fecha);
}
package co.edu.gestiontutoriasmongo.repository;
import co.edu.gestiontutoriasmongo.model.Reserva;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReservaRepository extends MongoRepository<Reserva, String> {

    List<Reserva> findByEstudianteId(String estudianteId);
    void deleteByFranjaHorariaId(String franjaHorariaId);
    List<Reserva> findByFranjaHorariaId(String franjaHorariaId);
}

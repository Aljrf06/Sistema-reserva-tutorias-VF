package co.edu.gestiontutoriasmongo.service;

import co.edu.gestiontutoriasmongo.excepcion.ApiExcepcion;
import co.edu.gestiontutoriasmongo.model.Materia;
import co.edu.gestiontutoriasmongo.repository.MateriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MateriaService {

    @Autowired
    private MateriaRepository materiaRepository;

    public Materia registrarMateria(Materia materia) {
        if (materia.getNombre() == null || materia.getNombre().isBlank()) {
            throw new ApiExcepcion("Nombre obligatorio", 400);
        }

        if (materiaRepository.existsByNombre(materia.getNombre())) {
            throw new ApiExcepcion("La materia ya está registrada",409);
        }

        return materiaRepository.save(materia);
    }

    public List<Materia> listarMaterias() {

        return materiaRepository.findAll();
    }

    public Materia buscarMateria(String idMateria) {
        return materiaRepository.findById(idMateria).
                orElseThrow(() -> new ApiExcepcion("Materia no encontrada",404));
    }



    public void eliminarMateria(String idMateria) {
        if (!materiaRepository.existsById(idMateria)) {
            throw new ApiExcepcion("Materia no encontrada",404);
        }

        materiaRepository.deleteById(idMateria);
    }
}

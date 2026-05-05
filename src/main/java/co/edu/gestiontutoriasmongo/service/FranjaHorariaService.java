package co.edu.gestiontutoriasmongo.service;

import co.edu.gestiontutoriasmongo.excepcion.ApiExcepcion;
import co.edu.gestiontutoriasmongo.model.*;
import co.edu.gestiontutoriasmongo.repository.FranjaHorariaRepository;
import co.edu.gestiontutoriasmongo.repository.MateriaRepository;
import co.edu.gestiontutoriasmongo.repository.ReservaRepository;
import co.edu.gestiontutoriasmongo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class FranjaHorariaService {
    @Autowired
    private FranjaHorariaRepository franjaHorariaRepository;
    @Autowired
    private MateriaRepository materiaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ReservaRepository reservaRepository;

    public FranjaHoraria crearFranja(FranjaHoraria franja) {
        Materia materia = materiaRepository.findById(franja.getMateriaId())
                .orElseThrow(() -> new ApiExcepcion("Materia no encontrada", 404));

        Usuario tutor = usuarioRepository.findById(franja.getTutorId())
                .orElseThrow(() -> new ApiExcepcion("Tutor no encontrado", 404));


        if (tutor.getTipo() == null || !tutor.getTipo().equals(TipoUsuario.tutor))
            throw new ApiExcepcion("El usuario no es tutor", 400);

        franja.setTutorId(tutor.getId());
        franja.setMateriaId(materia.getId());
        franja.setEstado(EstadoFranja.disponible);
        return franjaHorariaRepository.save(franja);
    }

    public List<FranjaHoraria> listarTodas() {
        return franjaHorariaRepository.findAll();
    }

    public List<FranjaHoraria> listarPorTutor(String tutorId) {
        return franjaHorariaRepository.findByTutorId(tutorId);
    }

    public List<FranjaHoraria> listarPorMateria(String materiaId) {
        return franjaHorariaRepository.findByMateriaId(materiaId);
    }

    public FranjaHoraria buscarPorId(String id) {
        return franjaHorariaRepository.findById(id)
                .orElseThrow(() -> new ApiExcepcion("Franja horaria no encontrada", 404));
    }

    public FranjaHoraria actualizarFranja(String id, FranjaHoraria franja) {
        if (!franjaHorariaRepository.existsById(id))
            throw new ApiExcepcion("Franja horaria no encontrada", 404);
        franja.setId(id);
        return franjaHorariaRepository.save(franja);
    }

    public void eliminarFranja(String id) {
        if (!franjaHorariaRepository.existsById(id))
            throw new ApiExcepcion("Franja horaria no encontrada", 404);
        reservaRepository.deleteByFranjaHorariaId(id);
        franjaHorariaRepository.deleteById(id);
    }

    public List<FranjaHoraria> listarPorFecha(LocalDate fecha) {
        return franjaHorariaRepository.findByFecha(fecha);
    }
}

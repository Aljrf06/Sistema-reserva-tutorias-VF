package co.edu.gestiontutoriasmongo.service;

import co.edu.gestiontutoriasmongo.excepcion.ApiExcepcion;
import co.edu.gestiontutoriasmongo.model.EstadoFranja;
import co.edu.gestiontutoriasmongo.model.EstadoReserva;
import co.edu.gestiontutoriasmongo.model.FranjaHoraria;
import co.edu.gestiontutoriasmongo.model.Reserva;
import co.edu.gestiontutoriasmongo.repository.FranjaHorariaRepository;
import co.edu.gestiontutoriasmongo.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private FranjaHorariaRepository franjaHorariaRepository;

    public Reserva crearReserva(Reserva reserva) {
        FranjaHoraria franja = franjaHorariaRepository.findById(reserva.getFranjaHorariaId())
                .orElseThrow(() -> new ApiExcepcion("Franja horaria no encontrada", 404));

        if (!franja.getEstado().equals(EstadoFranja.disponible))
            throw new ApiExcepcion("La franja horaria no está disponible", 400);

        franja.setEstado(EstadoFranja.reservada);
        franjaHorariaRepository.save(franja);

        reserva.setEstado(EstadoReserva.activa);
        reserva.setFechaReserva(LocalDateTime.now());
        return reservaRepository.save(reserva);
    }

    public List<Reserva> listarReserva() {
        return reservaRepository.findAll();
    }

    public List<Reserva> listarPorEstudiante(String estudianteId) {
        return reservaRepository.findByEstudianteId(estudianteId);
    }

    public List<Reserva> listarPorTutor(String tutorId) {
        // Buscar las franjas del tutor
        List<FranjaHoraria> franjas = franjaHorariaRepository.findByTutorId(tutorId);

        // Buscar las reservas de esas franjas
        return franjas.stream()
                .flatMap(f -> reservaRepository.findByFranjaHorariaId(f.getId()).stream())
                .toList();
    }

    public Reserva cancelarReserva(String id, String motivo) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new ApiExcepcion("Reserva no encontrada", 404));

        if (reserva.getEstado().equals(EstadoReserva.cancelada))
            throw new ApiExcepcion("La reserva ya está cancelada", 400);

        reserva.setEstado(EstadoReserva.cancelada);
        reserva.setFechaCancelacion(LocalDateTime.now());
        reserva.setMotivoCancelacion(motivo);

        // Liberar franja horaria
        franjaHorariaRepository.findById(reserva.getFranjaHorariaId())
                .ifPresent(franja -> {
                    franja.setEstado(EstadoFranja.disponible);
                    franjaHorariaRepository.save(franja);
                });

        return reservaRepository.save(reserva);
    }
}
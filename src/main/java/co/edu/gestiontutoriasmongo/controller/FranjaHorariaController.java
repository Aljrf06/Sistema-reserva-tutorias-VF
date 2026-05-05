package co.edu.gestiontutoriasmongo.controller;

import co.edu.gestiontutoriasmongo.model.FranjaHoraria;
import co.edu.gestiontutoriasmongo.repository.FranjaHorariaRepository;
import co.edu.gestiontutoriasmongo.service.FranjaHorariaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/franjas-horarias")
@CrossOrigin(origins = "*")
public class FranjaHorariaController {

    @Autowired
    FranjaHorariaService franjaHorariaService;
    @Autowired
    FranjaHorariaRepository franjaHorariaRepository;

    @PostMapping("/crearFranja")
    public ResponseEntity<FranjaHoraria> crearFranja(@RequestBody FranjaHoraria franja) {
        return ResponseEntity.status(HttpStatus.CREATED).body(franjaHorariaService.crearFranja(franja));
    }

    @GetMapping("/listarFranjas")
    public ResponseEntity<List<FranjaHoraria>> listarFranjas() {
        return ResponseEntity.ok(franjaHorariaService.listarTodas());
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<FranjaHoraria>> listarPorTutor(
            @PathVariable String tutorId) {
        return ResponseEntity.ok(franjaHorariaService.listarPorTutor(tutorId));
    }

    @GetMapping("/materia/{materiaId}")
    public ResponseEntity<List<FranjaHoraria>> listarPorMateria(
            @PathVariable String materiaId) {
        return ResponseEntity.ok(franjaHorariaService.listarPorMateria(materiaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FranjaHoraria> buscarPorId(
            @PathVariable String id) {
        return ResponseEntity.ok(franjaHorariaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FranjaHoraria> actualizarFranja(
            @PathVariable String id,
            @RequestBody FranjaHoraria franja) {
        return ResponseEntity.ok(franjaHorariaService.actualizarFranja(id, franja));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarFranja(
            @PathVariable String id) {
        franjaHorariaService.eliminarFranja(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<FranjaHoraria>> listarPorFecha(
            @PathVariable LocalDate fecha) {
        return ResponseEntity.ok(franjaHorariaService.listarPorFecha(fecha));
    }
}
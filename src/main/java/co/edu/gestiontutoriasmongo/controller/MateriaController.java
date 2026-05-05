package co.edu.gestiontutoriasmongo.controller;

import co.edu.gestiontutoriasmongo.model.Materia;
import co.edu.gestiontutoriasmongo.service.MateriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/materias")
@CrossOrigin(origins = "*")

public class MateriaController {
    @Autowired
    private MateriaService materiaService;

    @PostMapping("/registrar")
    public ResponseEntity<Materia> registrarMateria(@RequestBody Materia materia) {
        Materia nuevaMateria = materiaService.registrarMateria(materia);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaMateria);
    }

    @GetMapping("/listarMaterias")
    public ResponseEntity<List<Materia>> listarMaterias() {
        return ResponseEntity.ok(materiaService.listarMaterias());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Materia> buscarMateria(@PathVariable String id) {
        return ResponseEntity.ok(materiaService.buscarMateria(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMateria(@PathVariable String id) {
        materiaService.eliminarMateria(id);
        return ResponseEntity.noContent().build();
    }
}



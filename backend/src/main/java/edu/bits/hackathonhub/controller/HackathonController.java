package edu.bits.hackathonhub.controller;

import edu.bits.hackathonhub.model.Hackathon;
import edu.bits.hackathonhub.model.HackathonStatus;
import edu.bits.hackathonhub.service.HackathonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hackathons")
@RequiredArgsConstructor
public class HackathonController {

    private final HackathonService service;

    @GetMapping("/public")
    public ResponseEntity<List<Hackathon>> getAllPublicHackathons() {
        return ResponseEntity.ok(service.getAllHackathons());
    }

    @GetMapping("/public/status/{status}")
    public ResponseEntity<List<Hackathon>> getHackathonsByStatus(@PathVariable HackathonStatus status) {
        return ResponseEntity.ok(service.getHackathonsByStatus(status));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Hackathon> getHackathonById(@PathVariable Long id) {
        return service.getHackathonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Hackathon> createHackathon(@RequestBody Hackathon hackathon) {
        return ResponseEntity.ok(service.createHackathon(hackathon));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Hackathon> updateHackathon(@PathVariable Long id, @RequestBody Hackathon hackathon) {
        return ResponseEntity.ok(service.updateHackathon(id, hackathon));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHackathon(@PathVariable Long id) {
        service.deleteHackathon(id);
        return ResponseEntity.ok().build();
    }
}

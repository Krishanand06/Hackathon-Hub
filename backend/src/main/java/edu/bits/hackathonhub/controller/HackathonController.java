package edu.bits.hackathonhub.controller;

import edu.bits.hackathonhub.dto.HackathonRequest;
import edu.bits.hackathonhub.model.Hackathon;
import edu.bits.hackathonhub.model.HackathonStatus;
import edu.bits.hackathonhub.service.HackathonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hackathons")
@RequiredArgsConstructor
@Slf4j
public class HackathonController {

    private final HackathonService service;

    @GetMapping
    public ResponseEntity<List<Hackathon>> getAllHackathons() {
        return ResponseEntity.ok(service.getAllHackathons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hackathon> getHackathon(@PathVariable Long id) {
        return service.getHackathonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

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
    public ResponseEntity<Hackathon> createHackathon(@Valid @RequestBody HackathonRequest request, Authentication authentication) {
        logProtectedAccess("POST /api/hackathons", authentication);
        return ResponseEntity.ok(service.createHackathon(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Hackathon> updateHackathon(@PathVariable Long id, @Valid @RequestBody HackathonRequest request, Authentication authentication) {
        logProtectedAccess("PUT /api/hackathons/" + id, authentication);
        return ResponseEntity.ok(service.updateHackathon(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHackathon(@PathVariable Long id, Authentication authentication) {
        logProtectedAccess("DELETE /api/hackathons/" + id, authentication);
        service.deleteHackathon(id);
        return ResponseEntity.ok().build();
    }

    private void logProtectedAccess(String action, Authentication authentication) {
        log.info(
                "{} authenticatedUser='{}' roles={}",
                action,
                authentication == null ? "anonymous" : authentication.getName(),
                authentication == null ? List.of() : authentication.getAuthorities()
        );
    }
}

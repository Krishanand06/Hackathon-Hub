package edu.bits.hackathonhub.controller;

import edu.bits.hackathonhub.model.Team;
import edu.bits.hackathonhub.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService service;

    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(service.getAllTeams());
    }

    @GetMapping("/hackathon/{hackathonId}")
    public ResponseEntity<List<Team>> getTeamsByHackathon(@PathVariable Long hackathonId) {
        return ResponseEntity.ok(service.getTeamsByHackathon(hackathonId));
    }

    @GetMapping("/open")
    public ResponseEntity<List<Team>> getOpenTeams() {
        return ResponseEntity.ok(service.getOpenTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        return service.getTeamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<Team> createTeam(@RequestBody Team team, @RequestParam Long leaderId) {
        return ResponseEntity.ok(service.createTeam(team, leaderId));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Team> joinTeam(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(service.joinTeam(id, userId));
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<Void> leaveTeam(@PathVariable Long id, @RequestParam Long userId) {
        service.leaveTeam(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')") // Check if requester is leader logic could be added
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        service.deleteTeam(id);
        return ResponseEntity.ok().build();
    }
}

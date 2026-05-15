package edu.bits.hackathonhub.controller;

import edu.bits.hackathonhub.model.Team;
import edu.bits.hackathonhub.model.TeamDTO;
import edu.bits.hackathonhub.model.TeamMemberDTO;
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
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(service.getAllTeams().stream().map(this::toDTO).collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/hackathon/{hackathonId}")
    public ResponseEntity<List<TeamDTO>> getTeamsByHackathon(@PathVariable Long hackathonId) {
        return ResponseEntity.ok(service.getTeamsByHackathon(hackathonId).stream().map(this::toDTO).collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/open")
    public ResponseEntity<List<TeamDTO>> getOpenTeams() {
        return ResponseEntity.ok(service.getOpenTeams().stream().map(this::toDTO).collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long id) {
        return service.getTeamById(id)
                .map(this::toDTO)
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

    private TeamDTO toDTO(Team team) {
        return TeamDTO.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .hackathonId(team.getHackathon() != null ? team.getHackathon().getId() : null)
                .hackathonTitle(team.getHackathon() != null ? team.getHackathon().getTitle() : "Unknown")
                .leaderId(team.getLeader() != null ? team.getLeader().getId() : null)
                .leaderName(team.getLeader() != null ? team.getLeader().getFullName() : "Unknown")
                .isOpen(team.isOpen())
                .maxSize(team.getMaxSize() != null ? team.getMaxSize() : 4)
                .requiredSkills(team.getRequiredSkills() != null ? new java.util.ArrayList<>(team.getRequiredSkills()) : java.util.List.of("React", "Java", "Python"))
                .members(team.getMembers() != null ? team.getMembers().stream()
                        .map(m -> TeamMemberDTO.builder()
                                .id(m.getId())
                                .userId(m.getId())
                                .username(m.getUsername())
                                .fullName(m.getFullName())
                                .role(m.getRole() != null ? m.getRole().name() : "MEMBER")
                                .skills(java.util.List.of())
                                .isLeader(team.getLeader() != null && team.getLeader().getId().equals(m.getId()))
                                .build())
                        .collect(java.util.stream.Collectors.toList()) : java.util.List.of())
                .build();
    }
}

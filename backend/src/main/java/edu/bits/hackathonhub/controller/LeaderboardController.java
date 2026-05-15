package edu.bits.hackathonhub.controller;

import edu.bits.hackathonhub.model.LeaderboardEntryDTO;
import edu.bits.hackathonhub.model.Submission;
import edu.bits.hackathonhub.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final SubmissionRepository submissionRepository;

    @GetMapping
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard(@RequestParam(required = false) Long hackathonId) {
        List<Submission> submissions;
        if (hackathonId != null) {
            submissions = submissionRepository.findByHackathonId(hackathonId);
        } else {
            submissions = submissionRepository.findAll();
        }

        // Filter and map
        List<LeaderboardEntryDTO> leaderboard = submissions.stream()
                .filter(sub -> sub.getScore() != null)
                .sorted(Comparator.comparing(Submission::getScore).reversed())
                .map(sub -> LeaderboardEntryDTO.builder()
                        .id(sub.getId())
                        .teamName(sub.getTeam() != null ? sub.getTeam().getName() : sub.getSubmittedBy().getFullName())
                        .projectTitle(sub.getProjectTitle())
                        .totalScore(sub.getScore())
                        .trend("same") // simplify
                        .submissionId(sub.getId())
                        .members(sub.getTeam() != null && sub.getTeam().getMembers() != null 
                            ? sub.getTeam().getMembers().stream().map(u -> u.getFullName()).collect(Collectors.toList()) 
                            : List.of(sub.getSubmittedBy().getFullName()))
                        .build())
                .collect(Collectors.toList());

        // Assign ranks
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }

        return ResponseEntity.ok(leaderboard);
    }
}

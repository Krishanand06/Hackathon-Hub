package edu.bits.hackathonhub.controller;

import edu.bits.hackathonhub.model.Submission;
import edu.bits.hackathonhub.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService service;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('JUDGE')")
    public ResponseEntity<List<Submission>> getAllSubmissions() {
        return ResponseEntity.ok(service.getAllSubmissions());
    }

    @GetMapping("/hackathon/{hackathonId}")
    public ResponseEntity<List<Submission>> getSubmissionsByHackathon(@PathVariable Long hackathonId) {
        return ResponseEntity.ok(service.getSubmissionsByHackathon(hackathonId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmissionById(@PathVariable Long id) {
        return service.getSubmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Submission> createSubmission(@RequestBody Submission submission) {
        return ResponseEntity.ok(service.createSubmission(submission));
    }

    @PostMapping("/{id}/evaluate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('JUDGE')")
    public ResponseEntity<Submission> evaluateSubmission(
            @PathVariable Long id,
            @RequestParam Double score,
            @RequestParam String feedback
    ) {
        return ResponseEntity.ok(service.evaluateSubmission(id, score, feedback));
    }
}

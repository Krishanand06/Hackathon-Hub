package edu.bits.hackathonhub.service;

import edu.bits.hackathonhub.model.Submission;
import edu.bits.hackathonhub.model.SubmissionStatus;
import edu.bits.hackathonhub.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository repository;

    public List<Submission> getAllSubmissions() {
        return repository.findAll();
    }

    public List<Submission> getSubmissionsByHackathon(Long hackathonId) {
        return repository.findByHackathonId(hackathonId);
    }

    public Optional<Submission> getSubmissionById(Long id) {
        return repository.findById(id);
    }

    public Submission createSubmission(Submission submission) {
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(SubmissionStatus.SUBMITTED);
        return repository.save(submission);
    }

    public Submission evaluateSubmission(Long id, Double score, String feedback) {
        Submission submission = repository.findById(id).orElseThrow();
        submission.setScore(score);
        submission.setFeedback(feedback);
        submission.setStatus(SubmissionStatus.EVALUATED);
        return repository.save(submission);
    }
}

package edu.bits.hackathonhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "submissions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id")
    private Long id;

    @Column(name = "project_title", nullable = false)
    private String projectTitle;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @ManyToOne
    @JoinColumn(name = "hackathon_id", nullable = false)
    private Hackathon hackathon;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User submittedBy;

    @Column(name = "repo_url")
    private String repoUrl;
    @Column(name = "demo_url")
    private String demoUrl;

    @ElementCollection
    @CollectionTable(name = "submission_tech_stack", joinColumns = @JoinColumn(name = "submission_id"))
    @Column(name = "tech_name")
    private Set<String> techStack;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    private SubmissionStatus status;

    private Double score;
    private String feedback;
}

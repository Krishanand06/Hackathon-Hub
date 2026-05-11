package edu.bits.hackathonhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "evaluations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "evaluation_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne
    @JoinColumn(name = "judge_id", nullable = false)
    private User judge;

    @Transient
    private Map<String, Double> scores;

    private String feedback;
    @Column(name = "total_score")
    private Double totalScore;
    @Column(name = "evaluated_at")
    private LocalDateTime evaluatedAt;
}

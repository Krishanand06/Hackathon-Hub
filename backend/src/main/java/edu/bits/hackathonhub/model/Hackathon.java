package edu.bits.hackathonhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "hackathons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hackathon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false)
    private LocalDateTime registrationDeadline;

    private String theme;
    private String organizerName;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private Integer minTeamSize;
    private Integer maxTeamSize;
    private String prizePool;
    private boolean isOnline;
    private String venue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HackathonStatus status;

    @ElementCollection
    private Set<String> tags;
}

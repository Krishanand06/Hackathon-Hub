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
    @Column(name = "hackathon_id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "registration_deadline", nullable = false)
    private LocalDateTime registrationDeadline;

    private String theme;
    @Column(name = "organizer_name")
    private String organizerName;
    @Column(name = "max_participants")
    private Integer maxParticipants;
    @Column(name = "current_participants")
    private Integer currentParticipants;
    @Column(name = "min_team_size")
    private Integer minTeamSize;
    @Column(name = "max_team_size")
    private Integer maxTeamSize;
    @Column(name = "prize_pool")
    private String prizePool;
    @Column(name = "is_online")
    private boolean isOnline;
    private String venue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HackathonStatus status;

    @ElementCollection
    @CollectionTable(name = "hackathon_tags", joinColumns = @JoinColumn(name = "hackathon_id"))
    @Column(name = "tag_name")
    private Set<String> tags;
}

package edu.bits.hackathonhub.dto;

import edu.bits.hackathonhub.model.HackathonStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class HackathonRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String theme;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    @NotNull(message = "Registration deadline is required")
    private LocalDateTime registrationDeadline;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be greater than 0")
    private Integer maxParticipants;

    @NotNull(message = "Minimum team size is required")
    @Min(value = 1, message = "Minimum team size must be at least 1")
    private Integer minTeamSize;

    @NotNull(message = "Maximum team size is required")
    @Min(value = 1, message = "Maximum team size must be at least 1")
    private Integer maxTeamSize;

    private String prizePool;
    private HackathonStatus status;
    private Boolean isOnline;
    private String venue;
    private Long organizerId;
    private String organizerName;
    private String bannerUrl;
    private Set<String> tags;
}

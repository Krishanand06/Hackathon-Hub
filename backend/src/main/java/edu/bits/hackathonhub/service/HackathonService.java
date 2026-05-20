package edu.bits.hackathonhub.service;

import edu.bits.hackathonhub.dto.HackathonRequest;
import edu.bits.hackathonhub.model.Hackathon;
import edu.bits.hackathonhub.model.HackathonStatus;
import edu.bits.hackathonhub.repository.HackathonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
@Slf4j
public class HackathonService {

    private final HackathonRepository repository;
    private final JdbcTemplate jdbcTemplate;

    public List<Hackathon> getAllHackathons() {
        return repository.findAll();
    }

    public List<Hackathon> getHackathonsByStatus(HackathonStatus status) {
        return repository.findByStatus(status);
    }

    public Optional<Hackathon> getHackathonById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public Hackathon createHackathon(HackathonRequest request) {
        validateRequest(request);
        Hackathon hackathon = toHackathon(request, new Hackathon());
        log.info("Creating hackathon title='{}' status='{}'", hackathon.getTitle(), hackathon.getStatus());
        return repository.save(hackathon);
    }

    @Transactional
    public Hackathon updateHackathon(Long id, HackathonRequest request) {
        validateRequest(request);
        Hackathon hackathon = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Hackathon not found"));
        toHackathon(request, hackathon);
        log.info("Updating hackathon id={} title='{}'", id, hackathon.getTitle());
        return repository.save(hackathon);
    }

    @Transactional
    public void deleteHackathon(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "Hackathon not found");
        }
        log.info("Deleting hackathon id={} and dependent records", id);
        cleanupDependentRecords(id);
        repository.deleteById(id);
    }

    private Hackathon toHackathon(HackathonRequest request, Hackathon hackathon) {
        hackathon.setTitle(request.getTitle().trim());
        hackathon.setTheme(defaultText(request.getTheme(), "General Innovation"));
        hackathon.setDescription(request.getDescription().trim());
        hackathon.setStartDate(request.getStartDate());
        hackathon.setEndDate(request.getEndDate());
        hackathon.setRegistrationDeadline(request.getRegistrationDeadline());
        hackathon.setMaxParticipants(request.getMaxParticipants());
        hackathon.setCurrentParticipants(
                hackathon.getCurrentParticipants() == null ? 0 : hackathon.getCurrentParticipants()
        );
        hackathon.setMinTeamSize(request.getMinTeamSize());
        hackathon.setMaxTeamSize(request.getMaxTeamSize());
        hackathon.setPrizePool(defaultText(request.getPrizePool(), "TBA"));
        hackathon.setStatus(request.getStatus() == null ? HackathonStatus.UPCOMING : request.getStatus());
        hackathon.setOnline(request.getIsOnline() == null || request.getIsOnline());
        hackathon.setVenue(hackathon.isOnline() ? null : request.getVenue());
        hackathon.setOrganizerId(request.getOrganizerId());
        hackathon.setOrganizerName(defaultText(request.getOrganizerName(), "BITS Admin"));
        hackathon.setBannerUrl(request.getBannerUrl());
        hackathon.setTags(normalizeTags(request.getTags()));
        return hackathon;
    }

    private void validateRequest(HackathonRequest request) {
        if (!request.getStartDate().isBefore(request.getEndDate())) {
            throw new ResponseStatusException(BAD_REQUEST, "Start date must be before end date");
        }
        if (request.getRegistrationDeadline().isAfter(request.getStartDate())) {
            throw new ResponseStatusException(BAD_REQUEST, "Registration deadline cannot be after start date");
        }
        if (request.getMinTeamSize() > request.getMaxTeamSize()) {
            throw new ResponseStatusException(BAD_REQUEST, "Minimum team size cannot exceed maximum team size");
        }
    }

    private Set<String> normalizeTags(Set<String> tags) {
        if (tags == null) {
            return Set.of();
        }
        return tags.stream()
                .filter(tag -> tag != null && !tag.isBlank())
                .map(String::trim)
                .collect(Collectors.toSet());
    }

    private String defaultText(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private void cleanupDependentRecords(Long hackathonId) {
        jdbcTemplate.update("""
                DELETE es FROM evaluation_scores es
                JOIN evaluations e ON e.evaluation_id = es.evaluation_id
                JOIN submissions s ON s.submission_id = e.submission_id
                WHERE s.hackathon_id = ?
                """, hackathonId);
        jdbcTemplate.update("""
                DELETE e FROM evaluations e
                JOIN submissions s ON s.submission_id = e.submission_id
                WHERE s.hackathon_id = ?
                """, hackathonId);
        jdbcTemplate.update("""
                DELETE st FROM submission_tech_stack st
                JOIN submissions s ON s.submission_id = st.submission_id
                WHERE s.hackathon_id = ?
                """, hackathonId);
        jdbcTemplate.update("DELETE FROM submissions WHERE hackathon_id = ?", hackathonId);
        jdbcTemplate.update("DELETE FROM registrations WHERE hackathon_id = ?", hackathonId);
        jdbcTemplate.update("""
                DELETE trs FROM team_required_skills trs
                JOIN teams t ON t.team_id = trs.team_id
                WHERE t.hackathon_id = ?
                """, hackathonId);
        jdbcTemplate.update("""
                DELETE tm FROM team_members tm
                JOIN teams t ON t.team_id = tm.team_id
                WHERE t.hackathon_id = ?
                """, hackathonId);
        jdbcTemplate.update("DELETE FROM teams WHERE hackathon_id = ?", hackathonId);
        jdbcTemplate.update("DELETE FROM hackathon_tags WHERE hackathon_id = ?", hackathonId);
        jdbcTemplate.update("DELETE FROM evaluation_criteria WHERE hackathon_id = ?", hackathonId);
    }
}

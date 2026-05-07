package edu.bits.hackathonhub.service;

import edu.bits.hackathonhub.model.Hackathon;
import edu.bits.hackathonhub.model.HackathonStatus;
import edu.bits.hackathonhub.repository.HackathonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HackathonService {

    private final HackathonRepository repository;

    public List<Hackathon> getAllHackathons() {
        return repository.findAll();
    }

    public List<Hackathon> getHackathonsByStatus(HackathonStatus status) {
        return repository.findByStatus(status);
    }

    public Optional<Hackathon> getHackathonById(Long id) {
        return repository.findById(id);
    }

    public Hackathon createHackathon(Hackathon hackathon) {
        return repository.save(hackathon);
    }

    public Hackathon updateHackathon(Long id, Hackathon hackathonDetails) {
        Hackathon hackathon = repository.findById(id).orElseThrow();
        // Update fields...
        hackathon.setTitle(hackathonDetails.getTitle());
        hackathon.setDescription(hackathonDetails.getDescription());
        hackathon.setStartDate(hackathonDetails.getStartDate());
        hackathon.setEndDate(hackathonDetails.getEndDate());
        hackathon.setStatus(hackathonDetails.getStatus());
        // ... more fields
        return repository.save(hackathon);
    }

    public void deleteHackathon(Long id) {
        repository.deleteById(id);
    }
}

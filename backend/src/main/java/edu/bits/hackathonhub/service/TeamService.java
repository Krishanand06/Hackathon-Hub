package edu.bits.hackathonhub.service;

import edu.bits.hackathonhub.model.Role;
import edu.bits.hackathonhub.model.Team;
import edu.bits.hackathonhub.model.User;
import edu.bits.hackathonhub.repository.TeamRepository;
import edu.bits.hackathonhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    private User getOrCreateUser(Long userId) {
        return userRepository.findById(userId).orElseGet(() -> {
            User newUser = User.builder()
                // Do not set id manually if it's auto-generated, but since frontend relies on it:
                .username("demo_" + userId)
                .email("demo" + userId + "@example.com")
                .password("123456")
                .fullName("Demo User " + userId)
                .role(Role.STUDENT)
                .build();
            return userRepository.save(newUser);
        });
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public List<Team> getTeamsByHackathon(Long hackathonId) {
        return teamRepository.findByHackathonId(hackathonId);
    }

    public List<Team> getOpenTeams() {
        return teamRepository.findByIsOpenTrue();
    }

    public Optional<Team> getTeamById(Long id) {
        return teamRepository.findById(id);
    }

    public Team createTeam(Team team, Long leaderId) {
        User leader = getOrCreateUser(leaderId);
        // Enforce 1 team per user per hackathon
        if (team.getHackathon() == null || team.getHackathon().getId() == null) {
            throw new RuntimeException("Hackathon is required to create a team.");
        }
        Long hackathonId = team.getHackathon().getId();
        boolean leadsATeamInThisHackathon = teamRepository.findAll().stream()
            .anyMatch(t -> t.getLeader().getId().equals(leaderId) 
                    && t.getHackathon() != null 
                    && t.getHackathon().getId().equals(hackathonId));
        if (leadsATeamInThisHackathon) {
            throw new RuntimeException("You can only create one team per hackathon.");
        }
        team.setLeader(leader);
        if (team.getMembers() == null) {
            team.setMembers(new HashSet<>());
        }
        if (team.getPendingRequests() == null) {
            team.setPendingRequests(new HashSet<>());
        }
        team.getMembers().add(leader);
        return teamRepository.save(team);
    }

    public Team joinTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId).orElseThrow();
        User user = getOrCreateUser(userId);
        
        if (team.getMembers().size() >= team.getMaxSize()) {
            throw new RuntimeException("Team is full");
        }
        
        if (!team.isOpen()) {
            if (team.getPendingRequests() == null) team.setPendingRequests(new HashSet<>());
            team.getPendingRequests().add(user);
        } else {
            team.getMembers().add(user);
        }
        return teamRepository.save(team);
    }

    public Team approveRequest(Long teamId, Long userId, Long leaderId) {
        Team team = teamRepository.findById(teamId).orElseThrow();
        User user = getOrCreateUser(userId);
        
        if (!team.getLeader().getId().equals(leaderId)) {
            throw new RuntimeException("Only leader can approve");
        }
        if (team.getMembers().size() >= team.getMaxSize()) {
            throw new RuntimeException("Team is full");
        }
        
        if (team.getPendingRequests() != null) {
            team.getPendingRequests().remove(user);
        }
        team.getMembers().add(user);
        return teamRepository.save(team);
    }

    public Team rejectRequest(Long teamId, Long userId, Long leaderId) {
        Team team = teamRepository.findById(teamId).orElseThrow();
        User user = getOrCreateUser(userId);
        
        if (!team.getLeader().getId().equals(leaderId)) {
            throw new RuntimeException("Only leader can reject");
        }
        
        if (team.getPendingRequests() != null) {
            team.getPendingRequests().remove(user);
        }
        return teamRepository.save(team);
    }

    public void leaveTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId).orElseThrow();
        User user = getOrCreateUser(userId);
        
        if (team.getLeader().getId().equals(userId)) {
            throw new RuntimeException("Leader cannot leave the team. Dissolve it instead.");
        }
        
        team.getMembers().remove(user);
        teamRepository.save(team);
    }

    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }
}

package edu.bits.hackathonhub.service;

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
        User leader = userRepository.findById(leaderId).orElseThrow();
        team.setLeader(leader);
        if (team.getMembers() == null) {
            team.setMembers(new HashSet<>());
        }
        team.getMembers().add(leader);
        return teamRepository.save(team);
    }

    public Team joinTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        
        if (!team.isOpen() || team.getMembers().size() >= team.getMaxSize()) {
            throw new RuntimeException("Team is closed or full");
        }
        
        team.getMembers().add(user);
        return teamRepository.save(team);
    }

    public void leaveTeam(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        
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

package br.com.reservasegura.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.com.reservasegura.entity.*;
import br.com.reservasegura.repository.*;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public Goal criarMeta(String userId, Double valor) {
        User user = userRepository.findById(userId).orElseThrow();

        Goal goal = new Goal();
        goal.setValorAlvo(valor);
        goal.setUser(user);

        return goalRepository.save(goal);
    }
}
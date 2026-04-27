package br.com.reservasegura.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.reservasegura.entity.Goal;

public interface GoalRepository extends JpaRepository<Goal, String> {
}
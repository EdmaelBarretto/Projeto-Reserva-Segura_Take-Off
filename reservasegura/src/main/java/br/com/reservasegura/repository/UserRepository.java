package br.com.reservasegura.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.reservasegura.entity.User;

public interface UserRepository extends JpaRepository<User, String> {
}
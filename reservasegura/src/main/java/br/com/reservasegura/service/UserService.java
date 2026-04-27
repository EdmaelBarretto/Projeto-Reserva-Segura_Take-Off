package br.com.reservasegura.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.com.reservasegura.entity.User;
import br.com.reservasegura.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    public User criar(User user) {
        return repository.save(user);
    }

    public User login(String email, String senha) {
        return repository.findAll()
                .stream()
                .filter(u -> u.getEmail().equals(email) && u.getSenha().equals(senha))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Usuário inválido"));
    }
}
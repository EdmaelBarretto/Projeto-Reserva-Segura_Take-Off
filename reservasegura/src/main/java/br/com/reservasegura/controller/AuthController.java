package br.com.reservasegura.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import br.com.reservasegura.dto.*;
import br.com.reservasegura.entity.User;
import br.com.reservasegura.service.UserService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService service;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        User user = new User();
        user.setNome(request.nome);
        user.setEmail(request.email);
        user.setCpf(request.cpf);
        user.setSenha(request.senha);

        return service.criar(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        return service.login(request.email, request.senha);
    }
}
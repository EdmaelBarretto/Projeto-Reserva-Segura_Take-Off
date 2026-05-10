package br.com.reservasegura.dto;

public class AuthResponse {
    public String token;
    public String userId;
    public String nome;

    public AuthResponse(String token, String userId, String nome) {
        this.token = token;
        this.userId = userId;
        this.nome = nome;
    }
}

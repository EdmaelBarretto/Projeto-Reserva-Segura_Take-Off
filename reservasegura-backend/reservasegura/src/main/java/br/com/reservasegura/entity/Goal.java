package br.com.reservasegura.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "goals")
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String nome;
    private Double valorAlvo;
    private Double valorAtual = 0.0;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

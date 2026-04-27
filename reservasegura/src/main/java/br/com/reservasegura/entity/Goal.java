package br.com.reservasegura.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private Double valorAlvo;
    private Double valorAtual = 0.0;

    @ManyToOne
    private User user;
}
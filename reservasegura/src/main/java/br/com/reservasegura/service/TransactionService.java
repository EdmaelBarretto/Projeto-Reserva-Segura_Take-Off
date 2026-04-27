package br.com.reservasegura.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.com.reservasegura.entity.*;
import br.com.reservasegura.repository.*;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final GoalRepository goalRepository;

    public void depositar(String goalId, Double valor) {
        Goal goal = goalRepository.findById(goalId).orElseThrow();

        goal.setValorAtual(goal.getValorAtual() + valor);

        Transaction t = new Transaction();
        t.setValor(valor);
        t.setTipo("DEPOSITO");
        t.setUser(goal.getUser());

        transactionRepository.save(t);
        goalRepository.save(goal);
    }
}
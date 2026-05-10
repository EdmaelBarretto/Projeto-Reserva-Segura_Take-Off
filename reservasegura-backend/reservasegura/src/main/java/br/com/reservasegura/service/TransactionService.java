package br.com.reservasegura.service;

import br.com.reservasegura.dto.DepositRequest;
import br.com.reservasegura.entity.Goal;
import br.com.reservasegura.entity.Transaction;
import br.com.reservasegura.entity.User;
import br.com.reservasegura.repository.GoalRepository;
import br.com.reservasegura.repository.TransactionRepository;
import br.com.reservasegura.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public Transaction depositar(DepositRequest request) {
        Goal goal = goalRepository.findById(request.goalId)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada"));
        User user = userRepository.findById(request.userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        goal.setValorAtual(goal.getValorAtual() + request.valor);
        goalRepository.save(goal);

        Transaction transaction = new Transaction();
        transaction.setValor(request.valor);
        transaction.setTipo("DEPOSITO");
        transaction.setGoal(goal);
        transaction.setUser(user);

        int xpGanho = (int) (request.valor / 10);
        user.setXpTotal(user.getXpTotal() + xpGanho);
        userRepository.save(user);

        return transactionRepository.save(transaction);
    }

    public List<Transaction> listarPorUsuario(String userId) {
        return transactionRepository.findByUserId(userId);
    }
}

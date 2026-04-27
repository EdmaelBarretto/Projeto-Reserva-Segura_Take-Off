package br.com.reservasegura.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.reservasegura.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
}
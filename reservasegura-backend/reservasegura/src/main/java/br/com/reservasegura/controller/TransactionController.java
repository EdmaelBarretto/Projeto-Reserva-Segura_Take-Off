package br.com.reservasegura.controller;

import br.com.reservasegura.dto.DepositRequest;
import br.com.reservasegura.entity.Transaction;
import br.com.reservasegura.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimentacoes")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @PostMapping("/deposito")
    public ResponseEntity<Transaction> depositar(@RequestBody DepositRequest request) {
        return ResponseEntity.ok(service.depositar(request));
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> listar(@RequestParam String userId) {
        return ResponseEntity.ok(service.listarPorUsuario(userId));
    }
}

package br.com.reservasegura.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import br.com.reservasegura.dto.DepositRequest;
import br.com.reservasegura.service.TransactionService;

@RestController
@RequestMapping("/movimentacoes")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @PostMapping("/deposito")
    public void depositar(@RequestBody DepositRequest request) {
        service.depositar(request.goalId, request.valor);
    }
}
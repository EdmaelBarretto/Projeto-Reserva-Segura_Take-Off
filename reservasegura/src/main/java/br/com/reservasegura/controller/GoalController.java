package br.com.reservasegura.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import br.com.reservasegura.dto.GoalRequest;
import br.com.reservasegura.entity.Goal;
import br.com.reservasegura.service.GoalService;

@RestController
@RequestMapping("/metas")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService service;

    @PostMapping
    public Goal criar(@RequestBody GoalRequest request) {
        return service.criarMeta(request.userId, request.valor);
    }
}
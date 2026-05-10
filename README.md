# 💰 Reserva Segura

> Aplicação de gestão de reservas financeiras pessoais com metas, depósitos e gamificação.

---

## 🏛️ Informações Acadêmicas

| | |
|---|---|
| **Instituição** | Faculdade Senac Pernambuco |
| **Programa** | Residência Tecnológica — Porto Digital |
| **Empresa Parceira** | Bradesco |
| **Turma** | 2026.1 |
| **Código/Sigla** | RS |
| **Squad** | 29 |

---

## 👥 Squad 29

| Nome | Papel |
|---|---|
| Agnes Letícia Soares Ribeiro | Front-End |
| Allan Harrison Lemos de Barros Falcão | Front-End |
| Ana Carolina da Silva Santos | Dados |
| Arthur Henrique Silveira de Paula | Design |
| Edmael Paulo Ribeiro Barreto | Back-End / QA |
| Gabriel Gleydson Lima dos Santos | Dados / Gestão |

---

## 🔗 Repositórios

| Camada | Repositório |
|---|---|
| ⚙️ Back-End | [github.com/EdmaelBarretto/Projeto-Reserva-Segura_Take-Off](https://github.com/EdmaelBarretto/Projeto-Reserva-Segura_Take-Off) |
| 🎨 Front-End | [github.com/AgnesRibeiro/Reserva-Segura](https://github.com/AgnesRibeiro/Reserva-Segura) |
| 🌐 Deploy | [reserva-segura.vercel.app](https://reserva-segura.vercel.app) |

---

## 📌 Sobre o Projeto

O **Reserva Segura** é uma aplicação web voltada para a **educação financeira** e **gestão de metas de poupança**. O usuário pode criar metas de reserva, realizar depósitos, acompanhar seu progresso e acumular pontos em um sistema de gamificação — incentivando o hábito de poupar de forma contínua.

---

## 🛠️ Tecnologias

### Back-End
![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.2.5-6DB33F?style=flat&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat&logo=railway&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=jsonwebtokens&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=flat&logo=apachemaven&logoColor=white)

### Front-End
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

---

## 🏗️ Arquitetura

```
[Usuário no navegador]
        ↓
[Front-End — React / Vite]
  localhost:5173 | reserva-segura.vercel.app
        ↓  HTTP REST + JWT
[Back-End — Spring Boot]
  localhost:8080
        ↓  JPA / Hibernate
[Banco de Dados — PostgreSQL]
  Railway (nuvem)
```

---

## 📂 Estrutura do Back-End

```
br.com.reservasegura
│
├── controller/
│   ├── AuthController.java
│   ├── GoalController.java
│   └── TransactionController.java
│
├── dto/
│   ├── AuthResponse.java
│   ├── DepositRequest.java
│   ├── GoalRequest.java
│   ├── LoginRequest.java
│   └── RegisterRequest.java
│
├── entity/
│   ├── Goal.java
│   ├── Transaction.java
│   └── User.java
│
├── exception/
│   └── GlobalExceptionHandler.java
│
├── repository/
│   ├── GoalRepository.java
│   ├── TransactionRepository.java
│   └── UserRepository.java
│
├── security/
│   ├── JwtFilter.java
│   ├── JwtService.java
│   └── SecurityConfig.java
│
├── service/
│
└── ReservaSeguraApplication.java
```

---

## 🗄️ Banco de Dados

| Tabela | Campos principais |
|---|---|
| `users` | id, nome, email, cpf, senha, xp_total, pontos_premio |
| `goals` | id, nome, valor_alvo, valor_atual, user_id |
| `transactions` | id, valor, tipo, criado_em, goal_id, user_id |

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Java 17+
- Maven
- Node.js 18+
- Conta no Railway (ou PostgreSQL local)

### Back-End

```bash
# Clone o repositório
git clone https://github.com/EdmaelBarretto/Projeto-Reserva-Segura_Take-Off

# Acesse a pasta
cd Projeto-Reserva-Segura_Take-Off/reservasegura

# Configure o application.properties
# src/main/resources/application.properties

# Rode o projeto
./mvnw spring-boot:run
```

O servidor sobe em: `http://localhost:8080`

### Front-End

```bash
# Clone o repositório
git clone https://github.com/AgnesRibeiro/Reserva-Segura

# Acesse a pasta
cd Reserva-Segura

# Instale as dependências
npm install --legacy-peer-deps

# Rode o projeto
npm run dev
```

O front sobe em: `http://localhost:5173`

---

## ⚙️ Configuração — application.properties

```properties
server.port=8080

spring.datasource.url=jdbc:postgresql://<HOST>:<PORTA>/railway
spring.datasource.username=postgres
spring.datasource.password=<SUA_SENHA>
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

jwt.secret=<SUA_CHAVE_SECRETA>
jwt.expiration=86400000

spring.main.allow-circular-references=true
```

> ⚠️ Nunca suba credenciais reais para o GitHub. Use variáveis de ambiente ou `.env`.

---

## 🔐 Endpoints da API

### Autenticação (pública)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cadastrar novo usuário |
| `POST` | `/auth/login` | Autenticar e obter token JWT |

### Metas (autenticado)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/goals` | Criar nova meta |
| `GET` | `/goals` | Listar metas do usuário |
| `PUT` | `/goals/{id}` | Atualizar meta |
| `DELETE` | `/goals/{id}` | Deletar meta |

### Transações (autenticado)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/transactions` | Registrar depósito |
| `GET` | `/transactions` | Listar transações |

> Rotas autenticadas exigem header: `Authorization: Bearer <token>`

---

## 🧪 Testes

Os testes da API foram realizados com o **HTTP Client** do IntelliJ IDEA.

Arquivo de testes: `src/test/java/br/com/reservasegura/api-test.http`

Cenários cobertos:
- ✅ Cadastro com sucesso
- ✅ Login com sucesso e retorno de token JWT
- ✅ Validações de campos obrigatórios
- ✅ Bloqueio de email e CPF duplicados
- ✅ Rejeição de credenciais inválidas
- ✅ Proteção de rotas autenticadas

---

## 📄 Licença

Projeto acadêmico desenvolvido para a **Residência Tecnológica Porto Digital — Bradesco 2026.1**.

---

<p align="center">
  Desenvolvido com pelo <strong>Squad 29</strong> — Residência Tecnológica Porto Digital × Bradesco
</p>

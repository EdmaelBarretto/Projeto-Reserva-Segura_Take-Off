# Reserva Segura

Aplicativo gamificado de educação financeira que ensina crianças e jovens a poupar dinheiro através de "caixinhas" personalizadas, missões diárias e um sistema de recompensas.

---

## 👥 Equipe — Squad 29

**Código/Sigla:** RS · **Nome do Projeto:** RESERVA SEGURA

| Nome | Papel |
|------|-------|
| Agnes Letícia Soares Ribeiro | Front-End |
| Allan Harrison Lemos de Barros Falcão | Front-End |
| Ana Carolina da Silva Santos | Dados |
| Arthur Henrique Silveira de Paula | Design |
| Edmael Paulo Ribeiro Barreto | Back-End / QA |
| Gabriel Gleydson Lima dos Santos | Dados / Gestão |

**Programa:** Residência Tecnológica Take Off · Bradesco 2026.1

---

## 🔗 Links do Projeto

| Recurso | Link |
|---------|------|
| 🌐 Aplicação em Produção | [projeto-reserva-segura-front-end.vercel.app](https://projeto-reserva-segura-front-end.vercel.app/) |
| 🎨 Repositório Front-End | [Projeto-Reserva-Segura_Take-Off](https://github.com/EdmaelBarretto/Projeto-Reserva-Segura_Take-Off) |
| ⚙️ Repositório Back-End | [ProjetoReservaSegura_Back-End](https://github.com/EdmaelBarretto/ProjetoReservaSegura_Back-End) |
| 🛡️ Repositório QA | [Reserva-Segura-QA](https://github.com/EdmaelBarretto/Reserva-Segura-QA) |

---

## 🦖 Sobre o Projeto

Reserva Segura é uma plataforma educacional que combina gamificação com educação financeira, permitindo que usuários criem "caixinhas" para diferentes objetivos de economia, completem missões diárias e ganhem recompensas.

### Funcionalidades

- 🏠 **Dashboard Inicial**: Visualização de progresso, missões diárias e estatísticas
- 🏆 **Sistema de Ligas**: Competição saudável com rankings e zonas de promoção/rebaixamento
- 📚 **Lições**: Conteúdo educacional sobre educação financeira
- 💰 **Caixinhas**: Gestão de objetivos de economia personalizados
- 🛍️ **Loja**: Sistema de recompensas com badges, ícones, temas e gift cards
- 👤 **Perfil**: Acompanhamento de progresso, conquistas e estatísticas pessoais

---

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Tailwind CSS v4** para estilização
- **Lucide React** para ícones
- **React Slick** para carrosséis
- **Vite** como bundler
- **npm** como gerenciador de pacotes

---

## 📦 Como Usar no VS Code

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) (recomendado)

### 2. Clonar o Projeto

```bash
git clone https://github.com/EdmaelBarretto/Projeto-Reserva-Segura_Take-Off.git
cd Projeto-Reserva-Segura_Take-Off/Front-Reserva
```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Configurar variável de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
VITE_API_URL=https://projetoreservaseguraback-end-production.up.railway.app
```

### 5. Executar o Projeto

```bash
npm run dev
```

O aplicativo estará disponível em: `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
Front-Reserva/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── AuthScreen.tsx      # Telas de login/cadastro
│   │   │   ├── Boxes.tsx           # Gerenciamento de caixinhas
│   │   │   ├── ChangePassword.tsx  # Mudar senha
│   │   │   ├── DesktopLayout.tsx   # Layout desktop
│   │   │   ├── EditProfile.tsx     # Editar perfil
│   │   │   ├── Leagues.tsx         # Sistema de ligas
│   │   │   ├── Lessons.tsx         # Lições educacionais
│   │   │   ├── ProfileScreen.tsx   # Perfil do usuário
│   │   │   ├── Shop.tsx            # Loja de recompensas
│   │   │   └── icons/              # Ícones customizados
│   │   ├── utils/
│   │   │   └── xp.ts              # Cálculo de XP e nível
│   │   └── App.tsx                # Componente principal
│   ├── context/
│   │   └── AuthContext.tsx        # Gerenciamento de autenticação
│   ├── services/
│   │   └── api.ts                 # Serviços de API
│   ├── imports/                   # Assets importados do Figma
│   └── styles/
│       ├── fonts.css
│       ├── globals.css
│       ├── tailwind.css
│       └── theme.css
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🎨 Tema de Cores

- **Verde Principal**: `#618c78`
- **Verde Claro**: `#5bb49b`
- **Dourado (Moedas)**: `#f59e0b`
- **Texto Escuro**: `#101828`
- **Texto Secundário**: `#6a7282`

---

## 📱 Responsividade

O aplicativo é totalmente responsivo com:
- **Mobile**: Layout vertical com navegação inferior
- **Desktop**: Layout com header, sidebar e conteúdo central

---

## 🚀 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza build de produção localmente

---

## 🔧 Configuração do VS Code (Recomendado)

Extensões recomendadas:
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Vue Plugin (Volar)**
- **Prettier - Code formatter**

---

## 📝 Licença

Este projeto é de código aberto para fins educacionais.

---

Desenvolvido usando React + Tailwind CSS · Squad 29 · Bradesco 2026.1

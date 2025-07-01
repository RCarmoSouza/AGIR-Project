# AGIR - Sistema de Gestão Ágil

## 🎯 Visão Geral

O **AGIR** é um sistema completo de gestão ágil que integra todas as funcionalidades necessárias para gerenciar projetos, sprints, tarefas e controle de horas em uma única aplicação moderna e responsiva.

## ✨ Funcionalidades Principais

### 🏠 Dashboard Executivo
- **Visão consolidada** de todos os módulos
- **Métricas em tempo real** de projetos, sprints e horas
- **Cards de navegação** para acesso rápido aos módulos
- **Atividades recentes** e resumo da equipe

### 📁 Gerenciamento de Projetos
- **Criação e edição** de projetos
- **Configuração de equipes** e responsáveis
- **Suporte a sprints** configurável
- **Status e acompanhamento** de progresso

### 📋 Planejamento de Sprints
- **Backlog vertical** para melhor usabilidade
- **Drag-and-drop** entre sprints e backlog
- **Criação de tarefas** integrada
- **Hierarquia de tarefas** até 6 níveis
- **Sistema de comentários** e anexos

### 🎨 Quadro Kanban
- **5 colunas** de status funcionais
- **WIP limits** com alertas visuais
- **Filtros por sprint** e projeto
- **Cards informativos** com todas as informações

### ⏰ Controle de Horas (Timesheet)
- **Interface em formato planilhão** profissional
- **Registro de horas** com início/fim separados
- **Cálculo automático** de horas e custos
- **Filtros avançados** e relatórios
- **Seções expansíveis** para melhor organização

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework frontend moderno
- **Vite** - Build tool rápido e eficiente
- **Tailwind CSS** - Framework CSS utilitário
- **Heroicons** - Ícones SVG profissionais
- **React Router** - Roteamento SPA
- **Zustand** - Gerenciamento de estado
- **date-fns** - Manipulação de datas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- pnpm (recomendado) ou npm

### Instalação
```bash
# Clone o repositório
git clone https://github.com/SEU_USERNAME/AGIR-Project.git

# Entre no diretório
cd AGIR-Project

# Instale as dependências
pnpm install

# Execute o servidor de desenvolvimento
pnpm run dev
```

### Acesso
- **URL Local:** http://localhost:5173
- **Usuário padrão:** Ana Silva (Manager)

## 📊 Estrutura do Projeto

```
AGIR-Project/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes UI (shadcn/ui)
│   │   ├── Layout.jsx      # Layout principal
│   │   ├── Header.jsx      # Cabeçalho
│   │   └── Sidebar.jsx     # Menu lateral
│   ├── pages/              # Páginas da aplicação
│   │   ├── Dashboard.jsx   # Dashboard principal
│   │   ├── Projects.jsx    # Gerenciamento de projetos
│   │   ├── SprintPlanning.jsx # Planejamento de sprints
│   │   ├── KanbanBoard.jsx # Quadro Kanban
│   │   └── Timesheet.jsx   # Controle de horas
│   ├── stores/             # Estado global
│   │   └── appStore.js     # Store principal (Zustand)
│   ├── types/              # Definições de tipos
│   │   └── index.js        # Tipos TypeScript
│   └── lib/                # Utilitários
│       └── utils.js        # Funções auxiliares
├── public/                 # Arquivos estáticos
└── package.json           # Dependências e scripts
```

## 🎨 Design e UX

### Cores da Marca
- **Primária:** Rosa (#EC4899)
- **Secundária:** Azul Ciano (#06B6D4)
- **Neutras:** Escala de cinzas

### Responsividade
- **Desktop:** Layout completo com sidebar
- **Tablet:** Layout adaptado
- **Mobile:** Menu colapsável e interface otimizada

### Acessibilidade
- **Contraste adequado** em todos os elementos
- **Navegação por teclado** suportada
- **Ícones descritivos** e textos alternativos

## 💾 Persistência de Dados

- **localStorage** para dados locais
- **Estado sincronizado** entre páginas
- **Dados de exemplo** incluídos para demonstração

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run dev

# Build para produção
pnpm run build

# Preview da build
pnpm run preview

# Linting
pnpm run lint
```

## 📈 Funcionalidades Avançadas

### Hierarquia de Tarefas
- **Até 6 níveis** de profundidade
- **Épicos automáticos** exibidos nas tarefas
- **Relacionamentos** pai-filho

### Sistema de Comentários
- **Comentários por tarefa** com autor e data
- **Interface intuitiva** para adição
- **Histórico completo** de interações

### Sistema de Anexos
- **Upload de arquivos** de qualquer tipo
- **Informações detalhadas** (nome, tamanho, data)
- **Download e remoção** de anexos

### Controle de Custos
- **Taxa horária** por usuário
- **Cálculo automático** de custos
- **Relatórios financeiros** por projeto

## 🎯 Próximas Funcionalidades

- [ ] **Relatórios avançados** com gráficos
- [ ] **Notificações** em tempo real
- [ ] **Integração com APIs** externas
- [ ] **Módulo de configurações** globais
- [ ] **Sistema de permissões** avançado

## 📝 Licença

Este projeto está licenciado sob a **MIT License**.

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📞 Suporte

Para suporte ou dúvidas, entre em contato através do repositório GitHub.

---

**AGIR** - Transformando a gestão ágil em uma experiência simples e eficiente! 🚀


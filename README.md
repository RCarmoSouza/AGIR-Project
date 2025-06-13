# AGIR - Sistema de Gestão Ágil

## 📋 **Sobre o Projeto**

**AGIR** é um sistema completo de gestão ágil composto por múltiplos módulos independentes, cada um focado em uma área específica do gerenciamento de projetos e equipes.

## 🏗️ **Arquitetura Modular**

```
agir/
├── apps/                       # Aplicações independentes
│   ├── sprint-planning/        # Módulo de Planejamento de Sprints
│   └── timesheet/             # Módulo de Timesheet
├── shared/                    # Recursos compartilhados
│   ├── components/            # Componentes UI reutilizáveis
│   ├── types/                 # Definições TypeScript
│   ├── utils/                 # Utilitários
│   └── stores/                # Estado global
└── docs/                      # Documentação
```

## 📱 **Módulos Implementados**

### 🎯 **Sprint Planning** (Next.js + TypeScript)
- **Localização:** `apps/sprint-planning/`
- **Tecnologia:** Next.js 14, TypeScript, Tailwind CSS
- **Funcionalidades:**
  - Gerenciamento completo de projetos
  - Planejamento de sprints com backlog vertical
  - Quadro Kanban interativo com drag-and-drop
  - Hierarquia de tarefas até 6 níveis
  - Sistema de comentários e anexos
  - Exibição automática de épicos

### ⏰ **Timesheet** (React + JavaScript)
- **Localização:** `apps/timesheet/`
- **Tecnologia:** React 18, Vite, Tailwind CSS
- **Funcionalidades:**
  - Interface em formato planilhão profissional
  - Registro de horas com início/fim separados
  - Cálculo automático de horas e custos
  - Sistema de aprovações
  - Resumos por projeto e usuário
  - Filtros avançados

## 🚀 **Como Executar**

### **Sprint Planning:**
```bash
cd apps/sprint-planning
npm install
npm run dev
# Acesse: http://localhost:3000
```

### **Timesheet:**
```bash
cd apps/timesheet
pnpm install
pnpm run dev
# Acesse: http://localhost:5173
```

## 🛠️ **Tecnologias Utilizadas**

### **Compartilhadas:**
- **Tailwind CSS** - Estilização
- **Lucide Icons** - Ícones
- **TypeScript/JavaScript** - Linguagens

### **Sprint Planning:**
- **Next.js 14** - Framework React
- **Zustand** - Estado global
- **@dnd-kit** - Drag-and-drop
- **date-fns** - Manipulação de datas

### **Timesheet:**
- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **shadcn/ui** - Componentes UI

## 📊 **Funcionalidades por Módulo**

### **Sprint Planning:**
- ✅ Projetos com configuração flexível
- ✅ Sprints com planejamento visual
- ✅ Kanban com 5 colunas funcionais
- ✅ Tarefas com hierarquia complexa
- ✅ Comentários e anexos
- ✅ Drag-and-drop entre sprints

### **Timesheet:**
- ✅ Apontamento de horas inline
- ✅ Cálculo automático de custos
- ✅ Resumos expansíveis
- ✅ Filtros por período/projeto
- ✅ Status de aprovação
- ✅ Persistência local

## 🔄 **Integração entre Módulos**

Os módulos são independentes mas compartilham:
- **Estrutura de dados** similar
- **Design system** consistente
- **Padrões de UX** unificados
- **Tipos TypeScript** compartilhados

## 📈 **Roadmap**

### **Próximos Módulos:**
- **Relatórios** - Dashboard executivo
- **Configurações** - Gestão de usuários
- **API Gateway** - Integração entre módulos
- **Mobile Apps** - Versões mobile

### **Melhorias Planejadas:**
- **SSO** - Single Sign-On
- **Real-time** - Colaboração em tempo real
- **Notificações** - Sistema de alertas
- **Integrações** - APIs externas

## 🏢 **Casos de Uso**

- **Startups** - Gestão ágil completa
- **Consultorias** - Controle de horas e projetos
- **Equipes de TI** - Desenvolvimento ágil
- **Freelancers** - Gestão pessoal de projetos

## 📄 **Licença**

MIT License - Cada módulo pode ser usado independentemente.

---

**AGIR - Agilidade Integrada para Resultados** 🚀


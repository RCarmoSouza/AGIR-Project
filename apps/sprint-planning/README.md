# 📋 Sprint Planning Tool

Uma ferramenta moderna e completa para planejamento de sprints ágeis, desenvolvida com Next.js 14 e TypeScript.

## ✨ Funcionalidades

### 🎯 Gerenciamento de Projetos
- ✅ Criação e edição de projetos
- ✅ Configuração flexível (com/sem sprints)
- ✅ Gestão de equipes e membros
- ✅ Status e acompanhamento de progresso

### 📋 Planejamento de Sprints
- ✅ Backlog vertical organizado
- ✅ Criação e gestão de sprints
- ✅ Drag-and-drop entre backlog e sprints
- ✅ Filtros e seleção de projetos

### ✅ Gerenciamento Avançado de Tarefas
- ✅ **Hierarquia até 6 níveis** (tarefa pai/filho)
- ✅ **11 tipos de tarefa** personalizáveis
- ✅ **Sistema de comentários** em tempo real
- ✅ **Sistema de anexos** com upload
- ✅ **Exibição automática do épico pai**
- ✅ Story points e estimativas
- ✅ Prioridades com cores visuais
- ✅ Tags organizacionais

### 🎨 Quadro Kanban Interativo
- ✅ 5 colunas de status
- ✅ Drag-and-drop nativo
- ✅ WIP limits com alertas visuais
- ✅ Cards compactos e informativos
- ✅ Filtros por sprint

### 💾 Persistência e Estado
- ✅ localStorage para dados locais
- ✅ Estado global com Zustand
- ✅ Dados mantidos entre sessões

## 🛠️ Tecnologias

- **Next.js 14** - Framework React moderno
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Zustand** - Gerenciamento de estado
- **@dnd-kit** - Drag-and-drop
- **Heroicons** - Ícones
- **date-fns** - Manipulação de datas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/SEU_USERNAME/sprint-planning-tool.git
cd sprint-planning-tool
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse a aplicação**
```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js 14 (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Dashboard inicial
│   ├── projects/          # Páginas de projetos
│   └── sprints/           # Página de planejamento
├── components/            # Componentes React
│   ├── Header.tsx         # Cabeçalho da aplicação
│   ├── Sidebar.tsx        # Menu lateral
│   ├── TaskCard.tsx       # Card de tarefa otimizado
│   ├── KanbanBoard.tsx    # Quadro Kanban
│   └── ...               # Outros componentes
├── stores/               # Estado global (Zustand)
├── types/                # Definições TypeScript
├── lib/                  # Utilitários e dados
└── hooks/                # Hooks customizados
```

## 🎯 Funcionalidades Principais

### Hierarquia de Tarefas
- Suporte a até 6 níveis de hierarquia
- Seleção de tarefa pai no modal de criação
- Cálculo automático do épico pai
- Visualização apenas de tarefas folha no backlog

### Sistema de Comentários
- Comentários em tempo real
- Lista cronológica
- Informações do autor e data
- Interface intuitiva no modal de detalhes

### Sistema de Anexos
- Upload de arquivos de qualquer tipo
- Download e remoção de anexos
- Informações de tamanho e data
- Interface drag-and-drop

### Layout Otimizado
- Cards compactos com informações lateralizadas
- Descrição expansível opcional
- Indicadores visuais para comentários/anexos
- Épico destacado em badge roxo

## 📊 Dados de Exemplo

A aplicação vem com dados de exemplo pré-configurados:
- 3 projetos com diferentes configurações
- 8 tarefas com hierarquia e relacionamentos
- 4 usuários com diferentes roles
- Sprints ativas e concluídas

## 🎨 Interface

- **Design moderno** com cores da marca (rosa e azul ciano)
- **Layout responsivo** para desktop e mobile
- **Navegação intuitiva** com sidebar numerada
- **Feedback visual** em todas as interações
- **Acessibilidade** considerada no design

## 🔧 Configuração

### Tipos de Tarefa
11 tipos pré-configurados:
- 🎯 Épico
- 📖 User Story  
- ⭐ Feature
- 🐛 Bug
- ✅ Tarefa
- 🔧 Melhoria
- 🔍 Pesquisa
- 📝 Documentação
- 🧪 Teste
- ♻️ Refatoração
- ⚡ Spike

### Prioridades
- 🔴 Crítica
- 🟠 Alta
- 🟡 Média
- 🟢 Baixa

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através das issues do GitHub.

---

**Desenvolvido com ❤️ usando Next.js e TypeScript**


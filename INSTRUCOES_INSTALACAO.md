# AGIR Project - Instruções de Instalação e Execução

## 📋 **Pré-requisitos**

### **Software Necessário**
- **Node.js**: versão 18.0.0 ou superior
- **npm**: versão 8.0.0 ou superior (ou yarn/pnpm)
- **Git**: para controle de versão

### **Verificar Instalações**
```bash
node --version
npm --version
git --version
```

---

## 🚀 **Instalação**

### **1. Clonar o Repositório**
```bash
git clone https://github.com/RCarmoSouza/AGIR-Project.git
cd AGIR-Project
```

### **2. Instalar Dependências**
```bash
# Usando npm
npm install

# Ou usando yarn
yarn install

# Ou usando pnpm
pnpm install
```

**Nota**: Se houver conflitos de dependências, use:
```bash
npm install --legacy-peer-deps
```

---

## ▶️ **Execução**

### **Modo Desenvolvimento**
```bash
# Usando npm
npm run dev

# Ou usando yarn
yarn dev

# Ou usando pnpm
pnpm dev
```

### **Acessar a Aplicação**
- **URL Local**: http://localhost:5173
- **Porta padrão**: 5173 (configurável no vite.config.js)

---

## 🏗️ **Build para Produção**

### **Gerar Build**
```bash
npm run build
```

### **Visualizar Build Local**
```bash
npm run preview
```

---

## 📁 **Estrutura do Projeto**

```
AGIR-Project/
├── public/                 # Arquivos estáticos
├── src/
│   ├── apps/              # Módulos da aplicação
│   │   ├── PeopleApp.jsx  # Módulo de Pessoas
│   │   ├── ProjectsApp.jsx # Módulo de Projetos
│   │   ├── TimesheetApp.jsx # Módulo de Timesheet
│   │   └── pages/         # Páginas dos módulos
│   │       ├── BasesManagement.jsx
│   │       ├── CalendarsManagement.jsx
│   │       ├── PeopleManagement.jsx
│   │       ├── TeamsManagement.jsx
│   │       └── ...
│   ├── components/        # Componentes reutilizáveis
│   ├── lib/              # Utilitários e configurações
│   ├── pages/            # Páginas principais
│   │   └── Dashboard.jsx # Dashboard principal
│   ├── store/            # Estado global (Zustand)
│   ├── App.jsx           # Componente principal
│   └── main.jsx          # Ponto de entrada
├── package.json          # Dependências e scripts
├── vite.config.js        # Configuração do Vite
└── tailwind.config.js    # Configuração do Tailwind
```

---

## 🎯 **Funcionalidades Disponíveis**

### **Dashboard Principal**
- Visão geral do sistema
- Navegação para todos os módulos
- Métricas em tempo real

### **Módulo de Projetos**
- Gestão de projetos
- Cronograma Gantt (com correções de alinhamento)
- Kanban de tarefas
- Planejamento de sprints

### **Módulo de Timesheet**
- Controle de horas trabalhadas
- Interface em formato planilhão
- Cálculos automáticos

### **Módulo de Pessoas** ⭐ **NOVO**
- **Dashboard de Pessoas**: Métricas e visão geral
- **Gestão de Bases**: Cadastro de cidades/locais
- **Calendários de Disponibilidade**: Horários, dias úteis, feriados
- **Cadastro de Pessoas**: Dados pessoais, skills, hierarquia
- **Gestão de Equipes**: Organização, líderes, membros

---

## 🔧 **Configurações**

### **Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto (se necessário):
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=AGIR
```

### **Portas Personalizadas**
Para alterar a porta padrão, edite `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3000 // Sua porta desejada
  }
})
```

---

## 🐛 **Solução de Problemas**

### **Erro de Dependências**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### **Erro de Porta em Uso**
```bash
# Matar processo na porta 5173
npx kill-port 5173

# Ou usar porta diferente
npm run dev -- --port 3000
```

### **Erro de Permissões (Linux/Mac)**
```bash
sudo chown -R $USER:$USER node_modules
chmod +x node_modules/.bin/*
```

---

## 📱 **Compatibilidade**

### **Navegadores Suportados**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### **Dispositivos**
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

---

## 🔄 **Atualizações**

### **Verificar Atualizações**
```bash
npm outdated
```

### **Atualizar Dependências**
```bash
npm update
```

---

## 📞 **Suporte**

### **Logs de Desenvolvimento**
- Console do navegador (F12)
- Terminal onde o servidor está rodando

### **Arquivos de Log**
- Erros de build: `dist/` (após build)
- Erros de desenvolvimento: Console do terminal

---

## ✅ **Checklist de Instalação**

- [ ] Node.js instalado (v18+)
- [ ] Repositório clonado
- [ ] Dependências instaladas
- [ ] Servidor de desenvolvimento rodando
- [ ] Aplicação acessível em http://localhost:5173
- [ ] Todos os módulos funcionando
- [ ] Navegação entre páginas funcionando

---

**Última atualização**: 03/07/2025  
**Versão**: Módulo de Pessoas v1.0


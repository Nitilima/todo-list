# Sistema de Gerenciamento de Tarefas (Task Manager)

Um sistema completo de gerenciamento de tarefas desenvolvido com Node.js, Express, React e PostgreSQL.

## Funcionalidades

### Autenticação
- Cadastro de usuários
- Login com JWT
- Proteção de rotas privadas
- Gerenciamento de sessão

### Gerenciamento de Tarefas
- Criar, editar e excluir tarefas
- Marcar tarefas como pendente, em progresso ou concluída
- Definir prioridade (baixa, média, alta)
- Definir data de vencimento
- Buscar e filtrar tarefas por status, prioridade ou texto
- Visualizar tarefas atrasadas

### Dashboard
- Estatísticas de tarefas (total, concluídas, pendentes, atrasadas)
- Progresso semanal
- Lista de tarefas recentes

### Perfil do Usuário
- Editar informações do perfil
- Alterar senha

## Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM moderno para PostgreSQL
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Express Validator** - Validação de dados
- **Helmet** - Segurança HTTP
- **Morgan** - Logger de requisições
- **CORS** - Controle de acesso

### Frontend
- **React** - Biblioteca UI
- **React Router** - Roteamento
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas

## Estrutura do Projeto

```
todo-list/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma            # Schema do Prisma (modelos)
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js            # Cliente do Prisma
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # Controlador de autenticação
│   │   │   ├── task.controller.js   # Controlador de tarefas
│   │   │   └── user.controller.js   # Controlador de usuários
│   │   ├── middleware/
│   │   │   └── auth.middleware.js   # Middleware de autenticação
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # Rotas de autenticação
│   │   │   ├── task.routes.js       # Rotas de tarefas
│   │   │   └── user.routes.js       # Rotas de usuários
│   │   ├── utils/
│   │   │   └── hashPassword.js      # Utilitários de hash
│   │   └── server.js                # Configuração do servidor
│   ├── .env.example                 # Exemplo de variáveis de ambiente
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Layout.jsx       # Layout principal
│   │   │   │   └── PrivateRoute.jsx # Rota protegida
│   │   │   └── tasks/
│   │   │       ├── TaskCard.jsx     # Card de tarefa
│   │   │       ├── TaskFilters.jsx  # Filtros de tarefas
│   │   │       ├── TaskList.jsx     # Lista de tarefas
│   │   │       └── TaskModal.jsx    # Modal de criar/editar
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Contexto de autenticação
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Página dashboard
│   │   │   ├── Login.jsx            # Página de login
│   │   │   ├── Profile.jsx          # Página de perfil
│   │   │   ├── Register.jsx         # Página de cadastro
│   │   │   └── Tasks.jsx            # Página de tarefas
│   │   ├── services/
│   │   │   ├── api.js               # Configuração do Axios
│   │   │   └── taskService.js       # Serviço de tarefas
│   │   ├── styles/
│   │   │   └── index.css            # Estilos globais
│   │   ├── App.jsx                  # Componente principal
│   │   └── main.jsx                 # Entry point
│   ├── .env.example                 # Exemplo de variáveis de ambiente
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Instalação e Configuração

### Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd todo-list
```

### 2. Configurar o Banco de Dados

Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE todo_list_db;
```

### 3. Configurar o Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar o arquivo .env com suas configurações
# nano .env ou code .env
```

Configure as variáveis de ambiente no arquivo `.env`:

```env
PORT=5000
NODE_ENV=development

# Prisma Database URL
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
DATABASE_URL="postgresql://seu_usuario_postgres:sua_senha_postgres@localhost:5432/todo_list_db?schema=public"

JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

### Criar as tabelas do banco de dados com Prisma

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar as migrations e aplicar no banco de dados
npx prisma migrate dev --name init

# (Opcional) Abrir o Prisma Studio para visualizar os dados
npx prisma studio
```

### 4. Configurar o Frontend

```bash
cd ../frontend

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# O arquivo .env já está configurado corretamente por padrão
```

### 5. Executar o Projeto

#### Opção 1: Executar tudo de uma vez (Recomendado)

No diretório raiz do projeto:

```bash
# Instalar todas as dependências
npm run install:all

# Executar backend e frontend simultaneamente
npm run dev
```

#### Opção 2: Executar separadamente

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## Endpoints da API

### Autenticação

```
POST   /api/auth/register    # Cadastrar novo usuário
POST   /api/auth/login       # Fazer login
GET    /api/auth/me          # Obter usuário autenticado
```

### Tarefas

```
GET    /api/tasks                  # Listar tarefas (com filtros)
GET    /api/tasks/:id              # Obter tarefa específica
POST   /api/tasks                  # Criar nova tarefa
PUT    /api/tasks/:id              # Atualizar tarefa
DELETE /api/tasks/:id              # Excluir tarefa
GET    /api/tasks/stats/summary    # Obter estatísticas
```

### Usuários

```
PUT    /api/users/profile    # Atualizar perfil
PUT    /api/users/password   # Alterar senha
```

## Filtros de Tarefas

A API suporta os seguintes parâmetros de query para filtrar tarefas:

- `status`: `pending`, `in_progress`, `completed`
- `priority`: `low`, `medium`, `high`
- `search`: Busca por título ou descrição
- `sortBy`: Campo para ordenação (padrão: `createdAt`)
- `order`: `ASC` ou `DESC` (padrão: `DESC`)

Exemplo:
```
GET /api/tasks?status=pending&priority=high&search=reunião
```

## Recursos de Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT
- Validação de dados de entrada
- Proteção CORS
- Headers de segurança com Helmet
- SQL Injection prevention (Sequelize ORM)
- XSS protection

## Scripts Disponíveis

### Raiz do projeto

```bash
npm run dev              # Executar backend e frontend
npm run dev:backend      # Executar apenas backend
npm run dev:frontend     # Executar apenas frontend
npm run install:all      # Instalar todas as dependências
```

### Backend

```bash
npm run dev                # Modo desenvolvimento com nodemon
npm start                  # Modo produção
npm test                   # Executar testes
npm run prisma:generate    # Gerar Prisma Client
npm run prisma:migrate     # Criar e aplicar migrations
npm run prisma:studio      # Abrir Prisma Studio
npm run prisma:push        # Push schema sem criar migration
```

### Frontend

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Executar linter
```

## Próximas Funcionalidades (Roadmap)

- [ ] Categorias/Tags para tarefas
- [ ] Anexos de arquivos
- [ ] Comentários nas tarefas
- [ ] Compartilhamento de tarefas
- [ ] Notificações por email
- [ ] Modo escuro
- [ ] Aplicativo mobile (React Native)
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Integração com calendário
- [ ] Tarefas recorrentes

## Testes

Execute os testes com:

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Deploy

### Backend (Heroku, Railway, Render)

1. Configure as variáveis de ambiente
2. Configure o PostgreSQL
3. Execute `npm start`

### Frontend (Vercel, Netlify)

1. Configure a variável `VITE_API_URL` apontando para sua API
2. Execute `npm run build`
3. Deploy da pasta `dist`

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Autor

Desenvolvido por [Seu Nome]

## Suporte

Para reportar bugs ou solicitar features, abra uma issue no repositório do projeto.

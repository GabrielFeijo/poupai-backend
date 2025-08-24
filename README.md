# PoupAí API - Sistema de Análise Financeira

A **PoupAí API** é uma API REST robusta e moderna para gestão financeira pessoal. Desenvolvida com NestJS, oferece endpoints completos para controle de despesas, categorização, relatórios e integração com APIs externas de dados financeiros.

## 🚀 Funcionalidades

### 🔐 Sistema de Autenticação

- **JWT Authentication** - Token-based authentication seguro
- **Registro de Usuários** - Criação de contas com validação
- **Guards de Proteção** - Proteção automática de rotas

### 💰 Gestão Financeira

- **CRUD de Despesas** - Criação, leitura, atualização e exclusão
- **Categorização** - Sistema completo de categorias personalizáveis
- **Filtros Avançados** - Busca por data, categoria, tipo e valor
- **Paginação** - Navegação otimizada em grandes volumes

### 📊 Análise e Relatórios

- **Resumo Financeiro** - Totalizadores de receitas, despesas e saldo
- **Relatórios Mensais** - Análise detalhada por mês
- **Relatórios Anuais** - Visão anual com dados mensais
- **Exportação CSV/PDF** - Relatórios em múltiplos formatos

### 🌐 Integração Externa

- **Cotações de Moedas** - Exchange rates em tempo real
- **Preços de Criptomoedas** - Bitcoin, Ethereum, Litecoin

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MongoDB (local ou Atlas)
- npm ou yarn
- (Opcional) Docker para containerização

## 🛠️ Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/GabrielFeijo/poupai-backend.git
   cd poupai-backend
   ```

2. **Instale as dependências**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz do projeto:

   ```env
   # Banco de Dados
   DATABASE_URL="mongodb://localhost:27017/poupai"
   # ou para MongoDB Atlas:
   # DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/poupai"

   # JWT Configuration
   JWT_SECRET="sua-chave-jwt-super-secreta-aqui"

   # Server Configuration
   PORT=3333
   NODE_ENV=development

   # CORS Configuration
   FRONTEND_URL="http://localhost:5173"

   # Swagger Documentation (Opcional)
   SWAGGER_USER="admin"
   SWAGGER_PASSWORD="sua-senha-swagger-segura"
   ```

4. **Configure o banco de dados**

   ```bash
   # Gerar cliente Prisma
   npm run db:generate

   # Sincronizar schema com o banco
   npm run db:push

   # (Opcional) Popular com dados de exemplo
   npm run db:seed
   ```

5. **Inicie a aplicação**

   ```bash
   # Modo de desenvolvimento
   npm run start:dev

   # Modo de produção
   npm run build
   npm run start:prod
   ```

6. **Acesse a documentação**
   Abra seu navegador em: `http://localhost:3333/docs`

## 📚 Documentação da API

### 🔗 Acesso à Documentação Swagger

Com a aplicação rodando, acesse a documentação interativa:

```
http://localhost:3333/docs
```

### 🔐 Autenticação da Documentação

| Ambiente        | Proteção  | Credenciais      |
| --------------- | --------- | ---------------- |
| **Development** | Livre     | Sem autenticação |
| **Production**  | Protegida | HTTP Basic Auth  |

**Credenciais padrão para produção:**

- **Usuário**: `admin` (configurável via `SWAGGER_USER`)
- **Senha**: `admin` (configurável via `SWAGGER_PASSWORD`)

### 🔑 Testando Endpoints Protegidos

1. **Faça login** via `/auth/login`
2. **Copie o token** JWT retornado
3. **Clique "Authorize"** no Swagger
4. **Cole o token** no campo
5. **Teste endpoints** protegidos

## 🔧 Endpoints da API

### Autenticação

| Método | Endpoint         | Descrição                | Autenticação |
| ------ | ---------------- | ------------------------ | ------------ |
| `POST` | `/auth/register` | Registrar novo usuário   | ❌           |
| `POST` | `/auth/login`    | Login e obter JWT        | ❌           |
| `GET`  | `/auth/profile`  | Perfil do usuário logado | ✅           |

### Usuários

| Método   | Endpoint     | Descrição                | Autenticação |
| -------- | ------------ | ------------------------ | ------------ |
| `GET`    | `/users`     | Listar todos usuários    | ✅           |
| `GET`    | `/users/me`  | Dados do usuário atual   | ✅           |
| `GET`    | `/users/:id` | Obter usuário específico | ✅           |
| `PATCH`  | `/users/:id` | Atualizar usuário        | ✅           |
| `DELETE` | `/users/:id` | Excluir usuário          | ✅           |

### Categorias

| Método   | Endpoint            | Descrição                   | Autenticação |
| -------- | ------------------- | --------------------------- | ------------ |
| `POST`   | `/categories`       | Criar categoria             | ✅           |
| `GET`    | `/categories`       | Listar categorias           | ✅           |
| `GET`    | `/categories/stats` | Categorias com estatísticas | ✅           |
| `GET`    | `/categories/:id`   | Obter categoria específica  | ✅           |
| `PATCH`  | `/categories/:id`   | Atualizar categoria         | ✅           |
| `DELETE` | `/categories/:id`   | Excluir categoria           | ✅           |

### Despesas

| Método   | Endpoint            | Descrição                  | Autenticação |
| -------- | ------------------- | -------------------------- | ------------ |
| `POST`   | `/expenses`         | Criar despesa              | ✅           |
| `GET`    | `/expenses`         | Listar despesas (paginado) | ✅           |
| `GET`    | `/expenses/summary` | Resumo financeiro          | ✅           |
| `GET`    | `/expenses/:id`     | Obter despesa específica   | ✅           |
| `PATCH`  | `/expenses/:id`     | Atualizar despesa          | ✅           |
| `DELETE` | `/expenses/:id`     | Excluir despesa            | ✅           |

### Relatórios

| Método | Endpoint              | Descrição        | Autenticação |
| ------ | --------------------- | ---------------- | ------------ |
| `GET`  | `/reports/monthly`    | Relatório mensal | ✅           |
| `GET`  | `/reports/yearly`     | Relatório anual  | ✅           |
| `GET`  | `/reports/export/csv` | Exportar CSV     | ✅           |
| `GET`  | `/reports/export/pdf` | Exportar PDF     | ✅           |

### Dados Externos

| Método | Endpoint                   | Descrição              | Autenticação |
| ------ | -------------------------- | ---------------------- | ------------ |
| `GET`  | `/external-api/currencies` | Cotações de moedas     | ✅           |
| `GET`  | `/external-api/crypto`     | Preços de criptomoedas | ✅           |

## 🏗️ Estrutura do Projeto

```
src/
├── auth/                    # Módulo de autenticação
│   ├── dto/                 # DTOs de entrada
│   ├── guards/              # Guards de proteção
│   ├── strategies/          # Estratégias Passport
│   ├── auth.controller.ts   # Controller de autenticação
│   ├── auth.service.ts      # Lógica de negócio
│   └── auth.module.ts       # Módulo principal
├── users/                   # Gerenciamento de usuários
│   ├── dto/                 # DTOs de usuários
│   ├── users.controller.ts  # Endpoints de usuários
│   ├── users.service.ts     # Serviços de usuários
│   └── users.module.ts      # Módulo de usuários
├── categories/              # Sistema de categorias
│   ├── dto/                 # DTOs de categorias
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
├── expenses/                # Gestão de despesas
│   ├── dto/                 # DTOs de despesas
│   ├── expenses.controller.ts
│   ├── expenses.service.ts
│   └── expenses.module.ts
├── reports/                 # Sistema de relatórios
│   ├── reports.controller.ts
│   ├── reports.service.ts
│   └── reports.module.ts
├── external-api/            # Integração externa
│   ├── external-api.controller.ts
│   ├── external-api.service.ts
│   └── external-api.module.ts
├── prisma/                  # ORM Prisma
│   ├── schema.prisma        # Schema do banco
│   ├── seed.ts              # Dados iniciais
│   ├── prisma.service.ts    # Cliente Prisma
│   └── prisma.module.ts     # Módulo global
├── main.ts                  # Bootstrap da aplicação
├── app.module.ts            # Módulo raiz
└── setupSwagger.ts          # Configuração do Swagger
```

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia com hot reload
npm run start:debug        # Inicia com debugger

# Produção
npm run build              # Build da aplicação
npm run start:prod         # Inicia em modo produção

# Banco de Dados
npm run prisma:generate    # Gerar cliente Prisma
npm run prisma:push        # Sincronizar schema
npm run prisma:seed        # Popular dados iniciais
npm run prisma:studio      # Interface visual do banco

# Qualidade de Código
npm run lint               # ESLint
npm run format             # Prettier

# Testes
npm run test               # Testes unitários
npm run test:e2e           # Testes end-to-end
npm run test:cov           # Coverage de testes
```

## 🛠️ Feito com

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" width="40" height="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swagger/swagger-original.svg" width="40" height="40"/>
</div>

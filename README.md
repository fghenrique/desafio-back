# Servindo a Aplicação Desafio-back em NestJS

Este guia fornece instruções sobre como servir a aplicação Desafio-back desenvolvida em NestJS. Você tem a opção de servir a aplicação em modo de desenvolvimento ou em modo de produção usando Docker Compose.

### Pré-requisitos

Antes de começar, certifique-se de ter o seguinte:

- Node.js instalado na sua máquina.
- Yarn ou npm instalado na sua máquina.
- Docker e Docker Compose instalados, se optar pelo modo de produção.

### Modo de Desenvolvimento

Para servir a aplicação em modo de desenvolvimento, siga estas etapas:

1. Certifique-se de ter um banco de dados PostgreSQL em execução. Você precisará preencher as seguintes variáveis de ambiente em um arquivo `.env`:

   - `DB_HOST`: O endereço do banco de dados PostgreSQL, por padrão o docker compose espera que seja `postgres`, altere caso vá usar em desenvolvimento.
   - `DB_PORT`: A porta do banco de dados PostgreSQL.
   - `DB_USERNAME`: O nome de usuário do banco de dados PostgreSQL.
   - `DB_PASSWORD`: A senha do banco de dados PostgreSQL.
   - `DB_DATABASE`: O nome do banco de dados PostgreSQL a ser utilizado.
   - `REDIS_URL`: O endereço da instância do Redis, por padrão o docker compose espera que seja `redis`, altere caso vá usar em desenvolvimento
   - `REDIS_PORT`: Porta da instância do Redis
   - `MODE`: Define o modo de execução como, por padrão defina como `dev` para melhor funcionamento.
   - `JWT_SECRET`: Uma chave secreta para assinar e verificar tokens JWT.
   - `PORT`: A porta na qual o servidor será executado.
   - `SENDGRID_DEPOSIT_EMAIL`: O id do template de email para enviar notificações de depósito via Sendgrid.
   - `SENDGRID_WITHDRAW_EMAIL`: O id do template de email para enviar notificações de saque via Sendgrid.
   - `SENDGRID_SELL_BTC_EMAIL`: O id do template de email para enviar notificações de venda de BTC via Sendgrid.
   - `SENDGRID_BUY_BTC_EMAIL`: O id do template de email para enviar notificações de compra de BTC via Sendgrid.

2. Certifique-se de ter uma instância Redis em execução.

3. Execute o seguinte comando para iniciar a aplicação em modo de desenvolvimento:

```
yarn start:dev
```

### Modo de Produção

Para servir a aplicação em modo de produção usando Docker Compose, siga estas etapas:

1. Certifique-se de ter o Docker e o Docker Compose instalados na sua máquina.

2. Execute o seguinte comando para iniciar a aplicação em modo de produção:

```
docker compose up -d --build
```

### Atualização e Rebuild

Se você fizer alterações no código e desejar atualizar a aplicação em produção, execute o seguinte comando para rebuildar a aplicação:

```
docker compose up -d --build
```

Com essas instruções, você deverá ser capaz de servir a aplicação Desafio-back em NestJS tanto em modo de desenvolvimento quanto em modo de produção.

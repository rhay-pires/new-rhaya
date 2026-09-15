# 🗄️ Projeto Base de Banco de Dados (SQLite + Git)

Este projeto foi estruturado para você aprender e praticar banco de dados de forma simples, organizada e pronta para versionamento no Git / GitHub.

---

## 📁 Estrutura do Projeto

```text
├── schema.sql      # Estrutura do banco (CREATE TABLE, colunas, chaves) [Vai pro Git]
├── seed.sql        # Dados iniciais para testes (INSERT INTO)           [Vai pro Git]
├── database.js     # Script de automação e manipulação com Node.js      [Vai pro Git]
├── .gitignore      # Impede que arquivos de banco ou senhas subam       [Vai pro Git]
├── dados.db        # Arquivo local do SQLite (gerado automaticamente)    [NÃO vai pro Git]
└── README.md       # Este guia de uso
```

---

## 🚀 Como Usar no Terminal

Não precisa rodar `npm install` nem instalar pacotes pesados. O Node.js já possui suporte nativo ao SQLite!

### 1. Criar e popular o banco de dados
```bash
node database.js init
```
> Isso lerá o `schema.sql` e o `seed.sql`, criando o arquivo local `dados.db`.

### 2. Listar os dados cadastrados
```bash
node database.js listar
```

### 3. Inserir um novo usuário
```bash
node database.js adicionar-usuario "Ana Beatriz" "ana@email.com"
```

### 4. Inserir uma nova tarefa
```bash
# Formato: node database.js adicionar-tarefa <ID_DO_USUARIO> "Título"
node database.js adicionar-tarefa 1 "Aprender Git e GitHub"
```

---

## 🔒 Regra de Ouro do Git com Bancos de Dados

O arquivo `.gitignore` já está configurado para ignorar `*.db` e `.env`.

- **O que sobe pro Git:** `schema.sql`, `seed.sql`, `database.js`, `.gitignore` e `README.md`.
- **O que NÃO sobe:** `dados.db` (cada desenvolvedor ou ambiente cria seu próprio banco localmente rodando `node database.js init`).

---

## 📤 Como Subir no GitHub

1. Abra o terminal nesta pasta e inicie o Git (caso ainda não tenha feito):
   ```bash
   git init
   ```

2. Adicione os arquivos e faça o primeiro commit:
   ```bash
   git add .
   git commit -m "feat: configuracao inicial do banco de dados e scripts"
   ```

3. No seu GitHub ([github.com](https://github.com)), crie um novo repositório (ex: `meu-banco-de-dados`).

4. Conecte com o seu repositório remoto e envie o código:
   ```bash
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```

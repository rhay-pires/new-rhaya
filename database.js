/**
 * Gerenciador simples de banco de dados SQLite com Node.js (nativo do Node 22+)
 * Não requer nenhuma instalação de pacotes externos!
 */

const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const DB_FILE = path.join(__dirname, 'dados.db');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');
const SEED_FILE = path.join(__dirname, 'seed.sql');

function obterConexao() {
  const db = new DatabaseSync(DB_FILE);
  db.exec('PRAGMA foreign_keys = ON;');
  return db;
}

function inicializarBanco() {
  console.log('📦 Inicializando banco de dados...');

  const db = obterConexao();

  if (fs.existsSync(SCHEMA_FILE)) {
    const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf-8');
    db.exec(schemaSql);
    console.log('✅ Estrutura criada com sucesso via schema.sql!');
  } else {
    console.error('❌ Arquivo schema.sql não encontrado.');
    return;
  }

  if (fs.existsSync(SEED_FILE)) {
    const seedSql = fs.readFileSync(SEED_FILE, 'utf-8');
    try {
      db.exec(seedSql);
      console.log('🌱 Dados iniciais inseridos com sucesso via seed.sql!');
    } catch (err) {
      console.log('ℹ️ Nota ao inserir dados de teste (podem já existir):', err.message);
    }
  }

  console.log(`\n🎉 Banco pronto em: ${DB_FILE}`);
  console.log('Execute "node database.js listar" para conferir os dados.');
  db.close();
}

function listarDados() {
  if (!fs.existsSync(DB_FILE)) {
    console.log('⚠️ O banco de dados ainda não foi criado. Execute primeiro: node database.js init');
    return;
  }

  const db = obterConexao();

  console.log('\n--- 👥 USUÁRIOS CADASTRADOS ---');
  const usuarios = db.prepare('SELECT id, nome, email, criado_em FROM usuarios').all();
  console.table(usuarios);

  console.log('\n--- 📋 TAREFAS REGISTRADAS ---');
  const queryTarefas = `
    SELECT 
      t.id,
      u.nome AS usuario,
      t.titulo,
      CASE WHEN t.concluida = 1 THEN 'Concluída' ELSE 'Pendente' END AS status,
      t.criado_em
    FROM tarefas t
    INNER JOIN usuarios u ON u.id = t.usuario_id
  `;
  const tarefas = db.prepare(queryTarefas).all();
  console.table(tarefas);

  db.close();
}

function adicionarUsuario(nome, email) {
  if (!nome || !email) {
    console.log('❌ Uso: node database.js adicionar-usuario "Nome" "email@email.com"');
    return;
  }

  const db = obterConexao();
  try {
    const stmt = db.prepare('INSERT INTO usuarios (nome, email) VALUES (?, ?)');
    stmt.run(nome, email);
    console.log(`✅ Usuário "${nome}" (${email}) cadastrado com sucesso!`);
  } catch (err) {
    console.error('❌ Erro ao adicionar usuário:', err.message);
  } finally {
    db.close();
  }
}

function adicionarTarefa(usuarioId, titulo) {
  if (!usuarioId || !titulo) {
    console.log('❌ Uso: node database.js adicionar-tarefa <ID_DO_USUARIO> "Título da tarefa"');
    return;
  }

  const db = obterConexao();
  try {
    const stmt = db.prepare('INSERT INTO tarefas (usuario_id, titulo) VALUES (?, ?)');
    stmt.run(Number(usuarioId), titulo);
    console.log(`✅ Tarefa "${titulo}" cadastrada para o usuário ID ${usuarioId}!`);
  } catch (err) {
    console.error('❌ Erro ao adicionar tarefa:', err.message);
  } finally {
    db.close();
  }
}

// Roteador de comandos via linha de comando
const [, , comando, ...args] = process.argv;

switch (comando) {
  case 'init':
    inicializarBanco();
    break;
  case 'listar':
    listarDados();
    break;
  case 'adicionar-usuario':
    adicionarUsuario(args[0], args[1]);
    break;
  case 'adicionar-tarefa':
    adicionarTarefa(args[0], args[1]);
    break;
  default:
    console.log(`
📖 Como usar este banco de dados:

  node database.js init
    -> Cria o arquivo do banco local (dados.db) usando schema.sql e seed.sql.

  node database.js listar
    -> Lista todos os usuários e tarefas em formato de tabela.

  node database.js adicionar-usuario "Fulano" "fulano@email.com"
    -> Adiciona um novo usuário.

  node database.js adicionar-tarefa 1 "Minha nova tarefa"
    -> Adiciona uma nova tarefa vinculada ao usuário ID 1.
`);
    break;
}

-- Habilita o suporte a chaves estrangeiras no SQLite
PRAGMA foreign_keys = ON;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Tarefas (relacionada com Usuários)
CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    concluida INTEGER DEFAULT 0 CHECK(concluida IN (0, 1)),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índice para acelerar buscas de tarefas por usuário
CREATE INDEX IF NOT EXISTS idx_tarefas_usuario ON tarefas(usuario_id);

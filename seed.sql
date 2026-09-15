-- Inserindo alguns usuários de exemplo
INSERT INTO usuarios (nome, email) VALUES 
    ('Rhay', 'rhay@exemplo.com'),
    ('Dev Teste', 'dev@exemplo.com'),
    ('Maria Silva', 'maria@exemplo.com');

-- Inserindo tarefas para os usuários criados
INSERT INTO tarefas (usuario_id, titulo, concluida) VALUES
    (1, 'Criar estrutura do banco de dados', 1),
    (1, 'Configurar o .gitignore', 1),
    (1, 'Subir o primeiro commit no Git', 0),
    (2, 'Estudar comandos SQL (SELECT, INSERT)', 0),
    (3, 'Testar conexão com o banco', 1);

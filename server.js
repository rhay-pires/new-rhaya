/**
 * Servidor Web e API REST em Node.js com SQLite Nativo (Node 22+)
 * Servidor leve sem dependências externas!
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'dados.db');
const HTML_FILE = path.join(__dirname, 'rhay-os-prototype.html');

// Conexão com SQLite nativo
function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    // Se o banco não existir, chama o script database.js para inicializar
    require('./database.js');
  }
  const db = new DatabaseSync(DB_FILE);
  db.exec('PRAGMA foreign_keys = ON;');
  return db;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;

  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Router de API
  if (url.pathname === '/api/tarefas' && method === 'GET') {
    try {
      const db = getDb();
      const query = `
        SELECT t.id, t.titulo, t.concluida, t.criado_em, u.nome AS usuario 
        FROM tarefas t 
        LEFT JOIN usuarios u ON u.id = t.usuario_id 
        ORDER BY t.id DESC
      `;
      const tarefas = db.prepare(query).all();
      db.close();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(tarefas));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (url.pathname === '/api/tarefas' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const db = getDb();
        const stmt = db.prepare('INSERT INTO tarefas (usuario_id, titulo, concluida) VALUES (?, ?, ?)');
        stmt.run(data.usuario_id || 1, data.titulo, data.concluida ? 1 : 0);
        db.close();

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Tarefa adicionada ao SQLite!' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (url.pathname.startsWith('/api/tarefas/') && method === 'DELETE') {
    const id = url.pathname.split('/')[3];
    try {
      const db = getDb();
      const stmt = db.prepare('DELETE FROM tarefas WHERE id = ?');
      stmt.run(Number(id));
      db.close();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: `Tarefa ${id} removida do SQLite!` }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Servir arquivos estáticos (HTML)
  if (url.pathname === '/' || url.pathname === '/rhay-os-prototype.html') {
    fs.readFile(HTML_FILE, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao carregar o arquivo HTML.');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      }
    });
    return;
  }

  // 404 Not Found
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Rota não encontrada.');
});

server.listen(PORT, () => {
  console.log(`\n🚀 Servidor do Rhay OS rodando com sucesso!`);
  console.log(`🌐 Acesse no seu navegador: http://localhost:${PORT}`);
  console.log(`📡 API REST disponível em: http://localhost:${PORT}/api/tarefas\n`);
});

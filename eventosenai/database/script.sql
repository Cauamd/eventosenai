DROP DATABASE IF EXISTS eventosenai;
CREATE DATABASE eventosenai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eventosenai;

CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(120) NOT NULL,
  descricao TEXT,
  data_evento DATETIME NOT NULL,
  local VARCHAR(100) NOT NULL,
  vagas INT NOT NULL CHECK (vagas > 0),
  categoria_id INT NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE participantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  turma VARCHAR(40)
);

CREATE TABLE inscricoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evento_id INT NOT NULL,
  participante_id INT NOT NULL,
  data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (evento_id, participante_id),
  FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
  FOREIGN KEY (participante_id) REFERENCES participantes(id) ON DELETE CASCADE
);

INSERT INTO categorias (nome) VALUES ('Palestra'), ('Oficina'), ('Workshop');

INSERT INTO eventos (titulo, descricao, data_evento, local, vagas, categoria_id) VALUES
('Carreira em Tecnologia', 'Palestra sobre o mercado de TI', '2026-11-10 14:00:00', 'Auditório', 100, 1),
('Introdução ao Git e GitHub', 'Oficina prática de versionamento', '2026-11-12 09:00:00', 'Laboratório 3', 20, 2),
('Workshop de API REST', 'Construindo uma API com Node e Express', '2026-11-17 19:00:00', 'Laboratório 1', 2, 3),
('Segurança da Informação', 'Boas práticas e SQL Injection', '2026-11-20 10:30:00', 'Sala 12', 40, 1),
('Oficina de Next.js', 'Criando interfaces com React e Next', '2026-11-25 13:30:00', 'Laboratório 2', 15, 2);

INSERT INTO participantes (nome, email, turma) VALUES
('Ana Souza', 'ana@senai.com', 'DS-2026'),
('Bruno Lima', 'bruno@senai.com', 'DS-2026'),
('Carla Mendes', 'carla@senai.com', 'ADS-2026'),
('Diego Alves', 'diego@senai.com', 'ADS-2026'),
('Elisa Rocha', 'elisa@senai.com', 'DS-2025');

INSERT INTO inscricoes (evento_id, participante_id) VALUES (1,1),(1,2),(2,1),(3,3);

-- ===== CONSULTAS =====
-- 1) Eventos com categoria
SELECT e.id, e.titulo, c.nome AS categoria, e.data_evento, e.local
FROM eventos e JOIN categorias c ON c.id = e.categoria_id;

-- 2) Inscritos de um evento (evento 1)
SELECT p.id, p.nome, p.email, p.turma, i.data_inscricao
FROM inscricoes i JOIN participantes p ON p.id = i.participante_id
WHERE i.evento_id = 1;

-- 3) Total de inscritos e vagas restantes
SELECT e.id, e.titulo, e.vagas, COUNT(i.id) AS inscritos, e.vagas - COUNT(i.id) AS vagas_restantes
FROM eventos e LEFT JOIN inscricoes i ON i.evento_id = e.id
GROUP BY e.id ORDER BY e.data_evento;

-- 4) Inscrição duplicada (descomente para testar). Erro esperado:
-- ERROR 1062 (23000): Duplicate entry '1-1' for key 'inscricoes.evento_id'
-- INSERT INTO inscricoes (evento_id, participante_id) VALUES (1,1);

CREATE TABLE lancamentos (
  id        INTEGER PRIMARY KEY,
  dia       TEXT,
  descricao TEXT,
  categoria TEXT,
  tipo      TEXT,
  valor     REAL
);

INSERT INTO lancamentos
  (dia, descricao, categoria, tipo, valor) VALUES
  ('2026-11-05', 'Salário', 'Trabalho', 'entrada', 3200.00),
  ('2026-11-06', 'Aluguel', 'Casa', 'saida', 1100.00),
  ('2026-11-08', 'Mercado do mês', 'Mercado', 'saida', 480.00),
  ('2026-11-09', 'Pizza', 'Delivery', 'saida', 89.90),
  ('2026-11-12', 'Internet', 'Casa', 'saida', 99.90),
  ('2026-11-14', 'Hambúrguer', 'Delivery', 'saida', 64.50),
  ('2026-11-15', 'Freela de site', 'Trabalho', 'entrada', 450.00),
  ('2026-11-16', 'Feira', 'Mercado', 'saida', 75.00),
  ('2026-11-18', 'Sushi', 'Delivery', 'saida', 142.00),
  ('2026-11-21', 'Marmita', 'Delivery', 'saida', 96.00),
  ('2026-11-23', 'Açaí', 'Delivery', 'saida', 38.00),
  ('2026-11-27', 'Pizza de novo', 'Delivery', 'saida', 149.60);

SELECT ROUND(SUM(CASE WHEN tipo = 'entrada'
  THEN valor ELSE -valor END), 2) AS saldo
FROM lancamentos;

SELECT categoria, ROUND(SUM(valor), 2) AS total
FROM lancamentos WHERE tipo = 'saida'
GROUP BY categoria
ORDER BY total DESC;

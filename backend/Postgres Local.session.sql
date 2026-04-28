CREATE TABLE candidaturas (
    id SERIAL PRIMARY KEY,
    empresa VARCHAR(100),
    stack_principal VARCHAR(50),
    data_candidatura DATE DEFAULT CURRENT_DATE
);

INSERT INTO candidaturas (empresa, stack_principal) 
VALUES 
('Gr4vy', 'Python/Backend'),
('Agentologist', 'AI/FastAPI'),
('Aether Legals', 'React/Frontend');

SELECT * FROM candidaturas;
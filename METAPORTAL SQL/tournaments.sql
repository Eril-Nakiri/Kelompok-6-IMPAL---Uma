INSERT INTO "tournaments" (id_tournament, nama_turnamen, penyelenggara) VALUES (1, 'Master Santiago 2026', 'Riot Games');
INSERT INTO "tournaments" (id_tournament, nama_turnamen, penyelenggara) VALUES (2, 'VCT Champions 2026', 'Riot Games');
INSERT INTO "tournaments" (id_tournament, nama_turnamen, penyelenggara) VALUES (3, 'VCT Masters Bangkok 2026', 'Riot Games');
INSERT INTO "tournaments" (id_tournament, nama_turnamen, penyelenggara) VALUES (4, 'VCT Pacific Stage 1 2026', 'Riot Games');
INSERT INTO "tournaments" (id_tournament, nama_turnamen, penyelenggara) VALUES (5, 'VCT Americas Stage 1 2026', 'Riot Games');
INSERT INTO "tournaments" (id_tournament, nama_turnamen, penyelenggara) VALUES (6, 'VCT EMEA Stage 1 2026', 'Riot Games');
INSERT INTO "tournaments" (id_tournament, nama_turnamen, penyelenggara) VALUES (7, 'VCT CN Stage 1 2026', 'Riot Games');
INSERT INTO "tournaments" (id_tournament, nama_turnamen, penyelenggara) VALUES (8, 'VCT Pacific Kickoff 2026', 'Riot Games');
INSERT INTO "tournaments" (id_tournament, nama_turnamen, penyelenggara) VALUES (9, 'VCT Americas Kickoff 2026', 'Riot Games');
INSERT INTO "tournaments" (id_tournament, nama_turnamen, penyelenggara) VALUES (10, 'VCT EMEA Kickoff 2026', 'Riot Games');
INSERT INTO "tournaments" (id_tournament, nama_turnamen, penyelenggara) VALUES (11, 'VCT CN Kickoff 2026', 'Riot Games');

-- Perintah Opsional: Menyelaraskan ulang urutan auto-increment ID di PostgreSQL agar tidak bentrok saat input data baru dari web nanti
SELECT setval(pg_get_serial_sequence('"tournaments"', 'id_tournament'), COALESCE(MAX(id_tournament), 1)) FROM "tournaments";
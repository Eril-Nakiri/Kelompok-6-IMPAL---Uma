INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (1, 'Paper Rex', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (2, 'Rex Regum Qeon', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (3, 'Leviatán', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (4, 'Cloud9', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (5, 'Team Vitality', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (6, 'Bilibili Gaming', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (7, 'NRG', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (8, 'Trace Esports', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (9, 'XLG Esports', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (10, 'Team Liquid', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (11, 'T1', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (12, 'BBL Esports', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (13, 'Sentinels', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (14, 'Fnatic', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (15, 'Wolves Esports', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (16, 'EDward Gaming', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (17, 'FunPlus Phoenix', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (18, 'All Gamers', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (19, 'VARREL', null);
INSERT INTO teams (id_team, nama_tim, logo_url) VALUES (20, 'Gen.G Esports', null);

-- Menyelaraskan ulang urutan auto-increment ID untuk tabel teams
SELECT setval(pg_get_serial_sequence('teams', 'id_team'), COALESCE(MAX(id_team), 1)) FROM teams;
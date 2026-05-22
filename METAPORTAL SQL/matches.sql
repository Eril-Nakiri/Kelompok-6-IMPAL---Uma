INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (1, 1, 3, 8, 'BO3 Series', 1, 2, '2026-03-10 13:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (2, 1, 9, 1, 'BO3 Series', 0, 2, '2026-03-10 16:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (3, 1, 10, 7, 'BO3 Series', 2, 1, '2026-03-10 19:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (4, 1, 11, 12, 'BO3 Series', 2, 0, '2026-03-11 13:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (5, 1, 11, 1, 'BO3 Series', 1, 2, '2026-03-12 13:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (6, 1, 8, 10, 'BO3 Series', 0, 2, '2026-03-12 16:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (7, 1, 3, 7, 'BO3 Series', 1, 2, '2026-03-13 13:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (8, 1, 9, 12, 'BO3 Series', 0, 2, '2026-03-13 16:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (9, 1, 11, 8, 'BO3 Series', 2, 1, '2026-03-15 13:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (10, 1, 12, 7, 'BO3 Series', 0, 2, '2026-03-15 16:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (11, 1, 15, 16, 'BO3 Series', 0, 2, '2026-05-24 15:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (12, 1, 17, 18, 'BO3 Series', 2, 1, '2026-05-24 18:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (13, 1, 19, 20, 'BO3 Series', 0, 2, '2026-05-24 21:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (14, 1, 3, 8, 'BO3 Series', 0, 2, '2026-03-16 12:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (15, 1, 9, 1, 'BO3 Series', 0, 2, '2026-03-16 15:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (16, 1, 11, 12, 'BO3 Series', 2, 0, '2026-03-16 21:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (17, 1, 3, 7, 'BO3 Series', 0, 2, '2026-03-18 15:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (18, 1, 9, 12, 'BO3 Series', 0, 2, '2026-03-18 18:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (19, 1, 11, 8, 'BO3 Series', 2, 1, '2026-03-19 15:00:00');
INSERT INTO matches (id_match, id_tournament, id_team_a, id_team_b, match_format, skor_akhir_a, skor_akhir_b, jadwal) VALUES (20, 1, 12, 7, 'BO3 Series', 0, 2, '2026-03-19 18:00:00');

-- Menyelaraskan ulang urutan auto-increment ID untuk tabel matches
SELECT setval(pg_get_serial_sequence('matches', 'id_match'), COALESCE(MAX(id_match), 1)) FROM matches;
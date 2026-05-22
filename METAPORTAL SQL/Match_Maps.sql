INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (1, 1, 1, 'Lotus', 8, 13);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (2, 1, 2, 'Bind', 10, 13);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (3, 2, 1, 'Sunset', 6, 13);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (4, 2, 2, 'Split', 9, 13);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (5, 4, 1, 'Ascent', 13, 7);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (6, 4, 2, 'Breeze', 13, 11);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (7, 7, 1, 'Icebox', 5, 13);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (8, 7, 2, 'Haven', 9, 13);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (9, 8, 1, 'Split', 8, 13);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (10, 8, 2, 'Ascent', 11, 13);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (11, 9, 1, 'Lotus', 13, 9);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (12, 9, 2, 'Sunset', 10, 13);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (13, 9, 3, 'Bind', 13, 8);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (14, 10, 1, 'Haven', 7, 13);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (15, 10, 2, 'Icebox', 9, 13);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (16, 5, 1, 'Lotus', 9, 13);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (17, 5, 2, 'Sunset', 13, 8);
INSERT INTO match_maps (id_match_map, id_match, map_number, map_name, team_a_score, team_b_score) VALUES (18, 5, 3, 'Bind', 13, 11);

-- Menyelaraskan ulang urutan auto-increment ID untuk tabel match_maps
SELECT setval(pg_get_serial_sequence('match_maps', 'id_match_map'), COALESCE(MAX(id_match_map), 1)) FROM match_maps;
-- 1. BERSIHKAN TOTAL DATABASE LAMA (MENGHAPUS SEMUA TABEL LAMA YANG SUDAH ADA)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;

-- 2. BUAT STRUKTUR TABEL BARU SEBAGAI GANTINYA
CREATE TABLE Roles
(
    id_role       SERIAL PRIMARY KEY,
    role_name     VARCHAR(50) NOT NULL,
    CONSTRAINT role_name_unique UNIQUE (role_name),
    CONSTRAINT chk_role_name CHECK (role_name IN ('user', 'admin', 'tournament_management', 'player'))
);

CREATE TABLE Teams
(
    id_team       SERIAL PRIMARY KEY,
    nama_tim      VARCHAR(100) NOT NULL,
    logo_url      VARCHAR(255) NULL
);

CREATE TABLE Players
(
    Id_player     SERIAL PRIMARY KEY,
    Id_teams      INT          NULL,
    Nama          VARCHAR(100) NOT NULL,
    Country       VARCHAR(50)  NULL,
    role          VARCHAR(50)  NULL,
    photo_url     VARCHAR(255) NULL,
    CONSTRAINT Players_ibfk_1 FOREIGN KEY (Id_teams) REFERENCES Teams (id_team)
        ON DELETE CASCADE
);

CREATE INDEX idx_players_id_teams ON Players (Id_teams);

CREATE TABLE Tournaments
(
    id_tournament SERIAL PRIMARY KEY,
    nama_turnamen VARCHAR(100) NOT NULL,
    penyelenggara VARCHAR(100) NULL
);

CREATE TABLE Matches
(
    id_match      SERIAL PRIMARY KEY,
    id_tournament INT          NULL,
    id_team_a     INT          NULL,
    id_team_b     INT          NULL,
    match_format  VARCHAR(50)  NULL,
    skor_akhir_a  INT DEFAULT 0 NULL,
    skor_akhir_b  INT DEFAULT 0 NULL,
    jadwal        TIMESTAMP    NULL,
    CONSTRAINT Matches_ibfk_1 FOREIGN KEY (id_tournament) REFERENCES Tournaments (id_tournament)
        ON DELETE CASCADE,
    CONSTRAINT Matches_ibfk_2 FOREIGN KEY (id_team_a) REFERENCES Teams (id_team)
        ON DELETE SET NULL,
    CONSTRAINT Matches_ibfk_3 FOREIGN KEY (id_team_b) REFERENCES Teams (id_team)
        ON DELETE SET NULL
);

CREATE TABLE Match_Maps
(
    id_match_map  SERIAL PRIMARY KEY,
    id_match      INT         NULL,
    map_number    INT         NULL,
    map_name      VARCHAR(50) NULL,
    team_a_score  INT         NULL,
    team_b_score  INT         NULL,
    CONSTRAINT Match_Maps_ibfk_1 FOREIGN KEY (id_match) REFERENCES Matches (id_match)
        ON DELETE CASCADE
);

CREATE INDEX idx_match_maps_id_match ON Match_Maps (id_match);
CREATE INDEX idx_matches_id_team_a ON Matches (id_team_a);
CREATE INDEX idx_matches_id_team_b ON Matches (id_team_b);
CREATE INDEX idx_matches_id_tournament ON Matches (id_tournament);

CREATE TABLE Player_Map_Stats
(
    id_stat       SERIAL PRIMARY KEY,
    id_match      INT                        NULL,
    map_number    INT                        NULL,
    map_name      VARCHAR(50)                NULL,
    id_player     INT                        NULL,
    agent_used    VARCHAR(50)                NULL,
    kills         INT           DEFAULT 0    NULL,
    deaths        INT           DEFAULT 0    NULL,
    assists       INT           DEFAULT 0    NULL,
    acs           INT           DEFAULT 0    NULL,
    rating        DECIMAL(3, 2) DEFAULT 0.00 NULL,
    kast          INT           DEFAULT 0    NULL,
    adr           INT           DEFAULT 0    NULL,
    hs_percentage INT           DEFAULT 0    NULL,
    first_kills   INT           DEFAULT 0    NULL,
    first_deaths  INT           DEFAULT 0    NULL,
    CONSTRAINT Player_Map_Stats_ibfk_1 FOREIGN KEY (id_match) REFERENCES Matches (id_match)
        ON DELETE CASCADE,
    CONSTRAINT Player_Map_Stats_ibfk_2 FOREIGN KEY (id_player) REFERENCES Players (Id_player)
        ON DELETE CASCADE
);

CREATE INDEX idx_pms_id_match ON Player_Map_Stats (id_match);
CREATE INDEX idx_pms_id_player ON Player_Map_Stats (id_player);

CREATE TABLE Users
(
    id_user       SERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL,
    password      VARCHAR(255) NOT NULL,
    email         VARCHAR(100) NULL,
    id_role       INT          NULL,
    CONSTRAINT username_unique UNIQUE (username),
    CONSTRAINT Users_ibfk_1 FOREIGN KEY (id_role) REFERENCES Roles (id_role)
        ON DELETE SET NULL
);

CREATE TABLE Forum_Threads
(
    id_thread     SERIAL PRIMARY KEY,
    title         VARCHAR(255)               NOT NULL,
    content       TEXT                       NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    id_user       INT                        NULL,
    CONSTRAINT Forum_Threads_ibfk_1 FOREIGN KEY (id_user) REFERENCES Users (id_user)
        ON DELETE CASCADE
);

CREATE TABLE Forum_Replies
(
    id_reply      SERIAL PRIMARY KEY,
    id_thread     INT                        NULL,
    content       TEXT                       NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    id_user       INT                        NULL,
    CONSTRAINT Forum_Replies_ibfk_1 FOREIGN KEY (id_thread) REFERENCES Forum_Threads (id_thread)
        ON DELETE CASCADE,
    CONSTRAINT Forum_Replies_ibfk_2 FOREIGN KEY (id_user) REFERENCES Users (id_user)
        ON DELETE CASCADE
);

CREATE INDEX idx_replies_id_thread ON Forum_Replies (id_thread);
CREATE INDEX idx_replies_id_user ON Forum_Replies (id_user);
CREATE INDEX idx_threads_id_user ON Forum_Threads (id_user);

CREATE TABLE News
(
    id_news       SERIAL PRIMARY KEY,
    judul         VARCHAR(255)               NOT NULL,
    isi_konten    TEXT                       NULL,
    tanggal_post  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    id_author     INT                        NULL,
    thumbnail_url VARCHAR(255)               NULL,
    CONSTRAINT News_ibfk_1 FOREIGN KEY (id_author) REFERENCES Users (id_user)
        ON DELETE SET NULL
);

CREATE INDEX idx_news_id_author ON News (id_author);
CREATE INDEX idx_users_id_role ON Users (id_role);
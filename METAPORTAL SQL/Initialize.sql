-- 1. Manajemen Akses (D1)
CREATE TABLE Roles (
    id_role SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    CONSTRAINT chk_role_name CHECK (
        role_name IN ('user', 'admin', 'tournament_management', 'player')
    )
);

CREATE TABLE Users (
    id_user SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    id_role INT REFERENCES Roles(id_role) ON DELETE SET NULL
);

-- 2. Manajemen Berita (D2)
CREATE TABLE News (
    id_news SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    isi_konten TEXT,
    tanggal_post TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_author INT REFERENCES Users(id_user) ON DELETE SET NULL
);

-- 3. Struktur Turnamen & Tim (D3)
CREATE TABLE Teams (
    id_team SERIAL PRIMARY KEY,
    nama_tim VARCHAR(100) NOT NULL
);

CREATE TABLE Tournaments (
    id_tournament SERIAL PRIMARY KEY,
    nama_turnamen VARCHAR(100) NOT NULL,
    penyelenggara VARCHAR(100)
);

-- Tambahan: relasi player ke team
CREATE TABLE Team_Members (
    id_member SERIAL PRIMARY KEY,
    id_user INT REFERENCES Users(id_user) ON DELETE CASCADE,
    id_team INT REFERENCES Teams(id_team) ON DELETE CASCADE,
    UNIQUE (id_user) -- 1 player hanya di 1 tim
);

-- 4. Pertandingan & Ronde
CREATE TABLE Matches (
    id_match SERIAL PRIMARY KEY,
    id_tournament INT REFERENCES Tournaments(id_tournament) ON DELETE CASCADE,
    id_team_a INT REFERENCES Teams(id_team),
    id_team_b INT REFERENCES Teams(id_team),
    map_name VARCHAR(50),
    skor_akhir_a INT DEFAULT 0,
    skor_akhir_b INT DEFAULT 0,
    jadwal TIMESTAMP
);

CREATE TABLE Match_Rounds (
    id_round SERIAL PRIMARY KEY,
    id_match INT REFERENCES Matches(id_match) ON DELETE CASCADE,
    nomor_ronde INT NOT NULL,
    id_pemenang_ronde INT REFERENCES Teams(id_team),
    metode_menang VARCHAR(50)
);

CREATE TABLE Round_Player_Stats (
    id_stat SERIAL PRIMARY KEY,
    id_round INT REFERENCES Match_Rounds(id_round) ON DELETE CASCADE,
    id_user INT REFERENCES Users(id_user),
    kills INT DEFAULT 0,
    death BOOLEAN DEFAULT FALSE,
    assists INT DEFAULT 0,
    damage INT DEFAULT 0,
    is_clutch BOOLEAN DEFAULT FALSE,
    is_first_blood BOOLEAN DEFAULT FALSE
);

-- 5. Analisis Performa (D4)
CREATE TABLE Player_Match_Stats (
    id_stat SERIAL PRIMARY KEY,
    id_match INT REFERENCES Matches(id_match) ON DELETE CASCADE,
    id_user INT REFERENCES Users(id_user),
    agent_used VARCHAR(50),
    kills INT DEFAULT 0,
    deaths INT DEFAULT 0,
    assists INT DEFAULT 0,
    acs INT DEFAULT 0
);
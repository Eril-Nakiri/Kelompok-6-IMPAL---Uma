--
-- PostgreSQL database dump
--

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-17 02:21:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 234 (class 1259 OID 16884)
-- Name: match_rounds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.match_rounds (
    id_round integer NOT NULL,
    id_match integer,
    nomor_ronde integer NOT NULL,
    id_pemenang_ronde integer,
    metode_menang character varying(50)
);


ALTER TABLE public.match_rounds OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16883)
-- Name: match_rounds_id_round_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.match_rounds_id_round_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.match_rounds_id_round_seq OWNER TO postgres;

--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 233
-- Name: match_rounds_id_round_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.match_rounds_id_round_seq OWNED BY public.match_rounds.id_round;


--
-- TOC entry 232 (class 1259 OID 16859)
-- Name: matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matches (
    id_match integer NOT NULL,
    id_tournament integer,
    id_team_a integer,
    id_team_b integer,
    map_name character varying(50),
    skor_akhir_a integer DEFAULT 0,
    skor_akhir_b integer DEFAULT 0,
    jadwal timestamp without time zone
);


ALTER TABLE public.matches OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16858)
-- Name: matches_id_match_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.matches_id_match_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matches_id_match_seq OWNER TO postgres;

--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 231
-- Name: matches_id_match_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.matches_id_match_seq OWNED BY public.matches.id_match;


--
-- TOC entry 224 (class 1259 OID 16804)
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id_news integer NOT NULL,
    judul character varying(255) NOT NULL,
    isi_konten text,
    tanggal_post timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_author integer
);


ALTER TABLE public.news OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16803)
-- Name: news_id_news_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_id_news_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_news_seq OWNER TO postgres;

--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 223
-- Name: news_id_news_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_id_news_seq OWNED BY public.news.id_news;


--
-- TOC entry 238 (class 1259 OID 16927)
-- Name: player_match_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player_match_stats (
    id_stat integer NOT NULL,
    id_match integer,
    id_user integer,
    agent_used character varying(50),
    kills integer DEFAULT 0,
    deaths integer DEFAULT 0,
    assists integer DEFAULT 0,
    acs integer DEFAULT 0
);


ALTER TABLE public.player_match_stats OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16926)
-- Name: player_match_stats_id_stat_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.player_match_stats_id_stat_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.player_match_stats_id_stat_seq OWNER TO postgres;

--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 237
-- Name: player_match_stats_id_stat_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.player_match_stats_id_stat_seq OWNED BY public.player_match_stats.id_stat;


--
-- TOC entry 220 (class 1259 OID 16775)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id_role integer NOT NULL,
    role_name character varying(50) NOT NULL,
    CONSTRAINT chk_role_name CHECK (((role_name)::text = ANY ((ARRAY['user'::character varying, 'admin'::character varying, 'tournament_management'::character varying, 'player'::character varying])::text[])))
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16774)
-- Name: roles_id_role_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_role_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_role_seq OWNER TO postgres;

--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_id_role_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_role_seq OWNED BY public.roles.id_role;


--
-- TOC entry 236 (class 1259 OID 16903)
-- Name: round_player_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.round_player_stats (
    id_stat integer NOT NULL,
    id_round integer,
    id_user integer,
    kills integer DEFAULT 0,
    death boolean DEFAULT false,
    assists integer DEFAULT 0,
    damage integer DEFAULT 0,
    is_clutch boolean DEFAULT false,
    is_first_blood boolean DEFAULT false
);


ALTER TABLE public.round_player_stats OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16902)
-- Name: round_player_stats_id_stat_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.round_player_stats_id_stat_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.round_player_stats_id_stat_seq OWNER TO postgres;

--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 235
-- Name: round_player_stats_id_stat_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.round_player_stats_id_stat_seq OWNED BY public.round_player_stats.id_stat;


--
-- TOC entry 230 (class 1259 OID 16839)
-- Name: team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_members (
    id_member integer NOT NULL,
    id_user integer,
    id_team integer
);


ALTER TABLE public.team_members OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16838)
-- Name: team_members_id_member_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_members_id_member_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_members_id_member_seq OWNER TO postgres;

--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 229
-- Name: team_members_id_member_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_members_id_member_seq OWNED BY public.team_members.id_member;


--
-- TOC entry 226 (class 1259 OID 16821)
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id_team integer NOT NULL,
    nama_tim character varying(100) NOT NULL
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16820)
-- Name: teams_id_team_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teams_id_team_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teams_id_team_seq OWNER TO postgres;

--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 225
-- Name: teams_id_team_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_id_team_seq OWNED BY public.teams.id_team;


--
-- TOC entry 228 (class 1259 OID 16830)
-- Name: tournaments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tournaments (
    id_tournament integer NOT NULL,
    nama_turnamen character varying(100) NOT NULL,
    penyelenggara character varying(100)
);


ALTER TABLE public.tournaments OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16829)
-- Name: tournaments_id_tournament_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tournaments_id_tournament_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tournaments_id_tournament_seq OWNER TO postgres;

--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 227
-- Name: tournaments_id_tournament_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tournaments_id_tournament_seq OWNED BY public.tournaments.id_tournament;


--
-- TOC entry 222 (class 1259 OID 16787)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id_user integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100),
    id_role integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16786)
-- Name: users_id_user_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_user_seq OWNER TO postgres;

--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_user_seq OWNED BY public.users.id_user;


--
-- TOC entry 4911 (class 2604 OID 16887)
-- Name: match_rounds id_round; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_rounds ALTER COLUMN id_round SET DEFAULT nextval('public.match_rounds_id_round_seq'::regclass);


--
-- TOC entry 4908 (class 2604 OID 16862)
-- Name: matches id_match; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches ALTER COLUMN id_match SET DEFAULT nextval('public.matches_id_match_seq'::regclass);


--
-- TOC entry 4903 (class 2604 OID 16807)
-- Name: news id_news; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news ALTER COLUMN id_news SET DEFAULT nextval('public.news_id_news_seq'::regclass);


--
-- TOC entry 4919 (class 2604 OID 16930)
-- Name: player_match_stats id_stat; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_match_stats ALTER COLUMN id_stat SET DEFAULT nextval('public.player_match_stats_id_stat_seq'::regclass);


--
-- TOC entry 4901 (class 2604 OID 16778)
-- Name: roles id_role; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id_role SET DEFAULT nextval('public.roles_id_role_seq'::regclass);


--
-- TOC entry 4912 (class 2604 OID 16906)
-- Name: round_player_stats id_stat; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.round_player_stats ALTER COLUMN id_stat SET DEFAULT nextval('public.round_player_stats_id_stat_seq'::regclass);


--
-- TOC entry 4907 (class 2604 OID 16842)
-- Name: team_members id_member; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id_member SET DEFAULT nextval('public.team_members_id_member_seq'::regclass);


--
-- TOC entry 4905 (class 2604 OID 16824)
-- Name: teams id_team; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN id_team SET DEFAULT nextval('public.teams_id_team_seq'::regclass);


--
-- TOC entry 4906 (class 2604 OID 16833)
-- Name: tournaments id_tournament; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournaments ALTER COLUMN id_tournament SET DEFAULT nextval('public.tournaments_id_tournament_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 16790)
-- Name: users id_user; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_user_seq'::regclass);


--
-- TOC entry 5126 (class 0 OID 16884)
-- Dependencies: 234
-- Data for Name: match_rounds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.match_rounds (id_round, id_match, nomor_ronde, id_pemenang_ronde, metode_menang) FROM stdin;
1	1	1	1	elimination
2	1	2	2	spike
3	1	3	1	elimination
4	1	4	1	spike
5	1	5	2	elimination
6	1	6	1	spike
7	1	7	1	elimination
8	1	8	2	spike
9	1	9	1	elimination
10	1	10	1	spike
11	1	11	2	elimination
12	1	12	1	spike
13	1	13	1	elimination
\.


--
-- TOC entry 5124 (class 0 OID 16859)
-- Dependencies: 232
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.matches (id_match, id_tournament, id_team_a, id_team_b, map_name, skor_akhir_a, skor_akhir_b, jadwal) FROM stdin;
1	1	1	2	Ascent	13	9	2026-05-01 15:00:00
2	1	3	4	Bind	13	11	2026-05-02 16:00:00
3	1	1	3	Haven	13	10	2026-05-03 14:00:00
\.


--
-- TOC entry 5116 (class 0 OID 16804)
-- Dependencies: 224
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id_news, judul, isi_konten, tanggal_post, id_author) FROM stdin;
1	Turnamen Dimulai	Liga resmi dimulai minggu ini	2026-05-04 22:25:09.438111	1
2	Match Seru Hari Ini	Pertandingan berlangsung sengit	2026-05-04 22:25:09.438111	1
3	Grand Final Soon	Final akan digelar minggu depan	2026-05-04 22:25:09.438111	1
4	Patch Baru Dirilis	Update terbaru membawa perubahan meta	2026-05-04 22:25:09.438111	1
5	Team Garuda Menang	Garuda Esports tampil dominan	2026-05-04 22:25:09.438111	1
6	Nusantara Comeback	Kemenangan dramatis terjadi	2026-05-04 22:25:09.438111	1
7	Phoenix Tampil Solid	Strategi mereka sangat rapi	2026-05-04 22:25:09.438111	1
8	Rajawali Bangkit	Tim menunjukkan performa meningkat	2026-05-04 22:25:09.438111	1
9	Highlight Mingguan	Kumpulan momen terbaik minggu ini	2026-05-04 22:25:09.438111	1
10	Top Player Week 1	Player terbaik minggu pertama diumumkan	2026-05-04 22:25:09.438111	1
\.


--
-- TOC entry 5130 (class 0 OID 16927)
-- Dependencies: 238
-- Data for Name: player_match_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.player_match_stats (id_stat, id_match, id_user, agent_used, kills, deaths, assists, acs) FROM stdin;
1	1	3	Jett	20	10	5	250
2	1	4	Sova	15	12	7	210
3	1	5	Phoenix	18	11	3	230
4	1	8	Reyna	22	9	4	270
5	1	9	Omen	14	13	6	200
\.


--
-- TOC entry 5112 (class 0 OID 16775)
-- Dependencies: 220
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id_role, role_name) FROM stdin;
1	admin
2	user
3	tournament_management
4	player
\.


--
-- TOC entry 5128 (class 0 OID 16903)
-- Dependencies: 236
-- Data for Name: round_player_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.round_player_stats (id_stat, id_round, id_user, kills, death, assists, damage, is_clutch, is_first_blood) FROM stdin;
1	1	3	2	f	1	150	f	t
2	1	8	1	t	0	90	f	f
3	2	8	3	f	1	200	t	t
4	2	4	0	t	0	60	f	f
5	3	5	2	f	2	170	f	f
\.


--
-- TOC entry 5122 (class 0 OID 16839)
-- Dependencies: 230
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_members (id_member, id_user, id_team) FROM stdin;
21	3	1
22	4	1
23	5	1
24	6	1
25	7	1
26	8	2
27	9	2
28	10	2
29	11	2
30	12	2
31	13	3
32	14	3
33	15	3
34	16	3
35	17	3
36	18	4
37	19	4
38	20	4
39	21	4
40	22	4
\.


--
-- TOC entry 5118 (class 0 OID 16821)
-- Dependencies: 226
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id_team, nama_tim) FROM stdin;
1	Garuda Esports
2	Nusantara Squad
3	Phoenix ID
4	Rajawali Gaming
\.


--
-- TOC entry 5120 (class 0 OID 16830)
-- Dependencies: 228
-- Data for Name: tournaments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tournaments (id_tournament, nama_turnamen, penyelenggara) FROM stdin;
1	Indonesia Valorant League	Riot Indonesia
\.


--
-- TOC entry 5114 (class 0 OID 16787)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id_user, username, password, email, id_role) FROM stdin;
1	superadmin	pass	admin@mail.com	1
2	eo_jakarta	pass	eo@mail.com	3
3	rizkypras	pass	u1@mail.com	4
4	andika_putra	pass	u2@mail.com	4
5	fajarhidayat	pass	u3@mail.com	4
6	dimasarya	pass	u4@mail.com	4
7	yogapratama	pass	u5@mail.com	4
8	budi_santoso	pass	u6@mail.com	4
9	rahmatwahyu	pass	u7@mail.com	4
10	agungnugroho	pass	u8@mail.com	4
11	alvinwijaya	pass	u9@mail.com	4
12	kevinchrist	pass	u10@mail.com	4
13	jonathanlim	pass	u11@mail.com	4
14	stevenwijaya	pass	u12@mail.com	4
15	felixgunawan	pass	u13@mail.com	4
16	michaeltan	pass	u14@mail.com	4
17	adityarahman	pass	u15@mail.com	4
18	hendraputra	pass	u16@mail.com	4
19	davidkurnia	pass	u17@mail.com	4
20	ivanfernando	pass	u18@mail.com	4
21	reynaldyputra	pass	u19@mail.com	4
22	bagaspermana	pass	u20@mail.com	4
23	ninaaprilia	pass	u21@mail.com	2
24	putrihandayani	pass	u22@mail.com	2
25	dewisartika	pass	u23@mail.com	2
26	rahayuputri	pass	u24@mail.com	2
27	ameliasari	pass	u25@mail.com	2
28	yusufhadi	pass	u26@mail.com	2
29	ramadhani	pass	u27@mail.com	2
30	farhanakbar	pass	u28@mail.com	2
31	ilhammaulana	pass	u29@mail.com	2
32	fikriansyah	pass	u30@mail.com	2
33	taufikrahman	pass	u31@mail.com	2
34	galihpratama	pass	u32@mail.com	2
35	rendyaditya	pass	u33@mail.com	2
36	ferdianputra	pass	u34@mail.com	2
37	wahyusaputra	pass	u35@mail.com	2
38	dianlestari	pass	u36@mail.com	2
39	sitinurhaliza	pass	u37@mail.com	2
40	melatiindah	pass	u38@mail.com	2
41	linafitriani	pass	u39@mail.com	2
42	novianty	pass	u40@mail.com	2
43	arifsetiawan	pass	u41@mail.com	2
44	ranggasaputra	pass	u42@mail.com	2
45	yudhistira	pass	u43@mail.com	2
46	bayuaji	pass	u44@mail.com	2
47	adiprasetyo	pass	u45@mail.com	2
48	suryautama	pass	u46@mail.com	2
49	hermawansyah	pass	u47@mail.com	2
50	fikramadhan	pass	u48@mail.com	2
51	userbaru	123	user@mail.com	2
52	felix	123	user@mail.com	2
\.


--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 233
-- Name: match_rounds_id_round_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.match_rounds_id_round_seq', 13, true);


--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 231
-- Name: matches_id_match_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.matches_id_match_seq', 3, true);


--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 223
-- Name: news_id_news_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.news_id_news_seq', 10, true);


--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 237
-- Name: player_match_stats_id_stat_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.player_match_stats_id_stat_seq', 5, true);


--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_id_role_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_role_seq', 1, false);


--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 235
-- Name: round_player_stats_id_stat_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.round_player_stats_id_stat_seq', 5, true);


--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 229
-- Name: team_members_id_member_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_members_id_member_seq', 40, true);


--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 225
-- Name: teams_id_team_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_team_seq', 4, true);


--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 227
-- Name: tournaments_id_tournament_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tournaments_id_tournament_seq', 1, true);


--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_user_seq', 52, true);


--
-- TOC entry 4946 (class 2606 OID 16891)
-- Name: match_rounds match_rounds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_rounds
    ADD CONSTRAINT match_rounds_pkey PRIMARY KEY (id_round);


--
-- TOC entry 4944 (class 2606 OID 16867)
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id_match);


--
-- TOC entry 4934 (class 2606 OID 16814)
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id_news);


--
-- TOC entry 4950 (class 2606 OID 16937)
-- Name: player_match_stats player_match_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_match_stats
    ADD CONSTRAINT player_match_stats_pkey PRIMARY KEY (id_stat);


--
-- TOC entry 4926 (class 2606 OID 16783)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_role);


--
-- TOC entry 4928 (class 2606 OID 16785)
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- TOC entry 4948 (class 2606 OID 16915)
-- Name: round_player_stats round_player_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.round_player_stats
    ADD CONSTRAINT round_player_stats_pkey PRIMARY KEY (id_stat);


--
-- TOC entry 4940 (class 2606 OID 16847)
-- Name: team_members team_members_id_user_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_id_user_key UNIQUE (id_user);


--
-- TOC entry 4942 (class 2606 OID 16845)
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id_member);


--
-- TOC entry 4936 (class 2606 OID 16828)
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id_team);


--
-- TOC entry 4938 (class 2606 OID 16837)
-- Name: tournaments tournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id_tournament);


--
-- TOC entry 4930 (class 2606 OID 16795)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);


--
-- TOC entry 4932 (class 2606 OID 16797)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4958 (class 2606 OID 16892)
-- Name: match_rounds match_rounds_id_match_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_rounds
    ADD CONSTRAINT match_rounds_id_match_fkey FOREIGN KEY (id_match) REFERENCES public.matches(id_match) ON DELETE CASCADE;


--
-- TOC entry 4959 (class 2606 OID 16897)
-- Name: match_rounds match_rounds_id_pemenang_ronde_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_rounds
    ADD CONSTRAINT match_rounds_id_pemenang_ronde_fkey FOREIGN KEY (id_pemenang_ronde) REFERENCES public.teams(id_team);


--
-- TOC entry 4955 (class 2606 OID 16873)
-- Name: matches matches_id_team_a_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_id_team_a_fkey FOREIGN KEY (id_team_a) REFERENCES public.teams(id_team);


--
-- TOC entry 4956 (class 2606 OID 16878)
-- Name: matches matches_id_team_b_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_id_team_b_fkey FOREIGN KEY (id_team_b) REFERENCES public.teams(id_team);


--
-- TOC entry 4957 (class 2606 OID 16868)
-- Name: matches matches_id_tournament_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_id_tournament_fkey FOREIGN KEY (id_tournament) REFERENCES public.tournaments(id_tournament) ON DELETE CASCADE;


--
-- TOC entry 4952 (class 2606 OID 16815)
-- Name: news news_id_author_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_id_author_fkey FOREIGN KEY (id_author) REFERENCES public.users(id_user) ON DELETE SET NULL;


--
-- TOC entry 4962 (class 2606 OID 16938)
-- Name: player_match_stats player_match_stats_id_match_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_match_stats
    ADD CONSTRAINT player_match_stats_id_match_fkey FOREIGN KEY (id_match) REFERENCES public.matches(id_match) ON DELETE CASCADE;


--
-- TOC entry 4963 (class 2606 OID 16943)
-- Name: player_match_stats player_match_stats_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_match_stats
    ADD CONSTRAINT player_match_stats_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id_user);


--
-- TOC entry 4960 (class 2606 OID 16916)
-- Name: round_player_stats round_player_stats_id_round_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.round_player_stats
    ADD CONSTRAINT round_player_stats_id_round_fkey FOREIGN KEY (id_round) REFERENCES public.match_rounds(id_round) ON DELETE CASCADE;


--
-- TOC entry 4961 (class 2606 OID 16921)
-- Name: round_player_stats round_player_stats_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.round_player_stats
    ADD CONSTRAINT round_player_stats_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id_user);


--
-- TOC entry 4953 (class 2606 OID 16853)
-- Name: team_members team_members_id_team_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_id_team_fkey FOREIGN KEY (id_team) REFERENCES public.teams(id_team) ON DELETE CASCADE;


--
-- TOC entry 4954 (class 2606 OID 16848)
-- Name: team_members team_members_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE;


--
-- TOC entry 4951 (class 2606 OID 16798)
-- Name: users users_id_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_role_fkey FOREIGN KEY (id_role) REFERENCES public.roles(id_role) ON DELETE SET NULL;


-- Completed on 2026-05-17 02:21:12

--
-- PostgreSQL database dump complete
--

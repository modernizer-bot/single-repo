--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3 (Ubuntu 13.3-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: sp_sys_login(text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_sys_login(p_email text, p_username text, p_password text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN

	PERFORM * FROM t_sys_users tsu WHERE (tsu.email = p_email OR tsu.username = p_username) AND tsu."password" = crypt(p_password,tsu."password");
	RETURN FOUND;

	EXCEPTION WHEN OTHERS THEN
		RAISE EXCEPTION '% %', SQLERRM,SQLSTATE;

END
$$;


ALTER FUNCTION public.sp_sys_login(p_email text, p_username text, p_password text) OWNER TO postgres;

--
-- Name: sp_sys_register(text, text, text, text, text, text, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_sys_register(p_first_name text, p_middle_name text, p_last_name text, p_username text, p_email text, p_password text, p_birth_date timestamp without time zone) RETURNS TABLE(id integer, uuid uuid)
    LANGUAGE plpgsql
    AS $$
DECLARE
	v_password text;
BEGIN
	SELECT crypt(p_password, gen_salt('bf', 4)) INTO v_password;
	RETURN QUERY INSERT INTO t_sys_users(first_name, middle_name, last_name, username, email, "password", birth_date)
	VALUES (p_first_name, p_middle_name, p_last_name, p_username, p_email, v_password, p_birth_date)
	RETURNING t_sys_users.id, t_sys_users.uuid;
	
	EXCEPTION WHEN OTHERS THEN
		RAISE EXCEPTION '% %', SQLERRM,SQLSTATE;
END
$$;


ALTER FUNCTION public.sp_sys_register(p_first_name text, p_middle_name text, p_last_name text, p_username text, p_email text, p_password text, p_birth_date timestamp without time zone) OWNER TO postgres;

--
-- Name: sp_sys_user_has_permissions(integer, integer[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_sys_user_has_permissions(p_user_id integer, p_permissions integer[]) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
	v_result boolean;
BEGIN
	
	SELECT (SELECT id FROM t_sys_permissions tsp
		WHERE tsp.id = ANY(
			SELECT tsrpj.permission_id FROM t_sys_role_permission_join tsrpj WHERE tsrpj.role_id = ANY(
				SELECT tsurj.role_id FROM t_sys_user_role_join tsurj WHERE tsurj.user_id = p_user_id)
			)) = ANY(p_permissions) AS "result" INTO v_result;
	
	RETURN v_result;
	
	EXCEPTION WHEN OTHERS THEN
		RAISE EXCEPTION '% %', SQLERRM,SQLSTATE;

END
$$;


ALTER FUNCTION public.sp_sys_user_has_permissions(p_user_id integer, p_permissions integer[]) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: t_sys_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_sys_permissions (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    creation_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.t_sys_permissions OWNER TO postgres;

--
-- Name: t_sys_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.t_sys_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_sys_permissions_id_seq OWNER TO postgres;

--
-- Name: t_sys_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_sys_permissions_id_seq OWNED BY public.t_sys_permissions.id;


--
-- Name: t_sys_role_permission_join; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_sys_role_permission_join (
    id integer NOT NULL,
    role_id integer,
    permission_id integer,
    creation_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.t_sys_role_permission_join OWNER TO postgres;

--
-- Name: t_sys_role_permission_join_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.t_sys_role_permission_join_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_sys_role_permission_join_id_seq OWNER TO postgres;

--
-- Name: t_sys_role_permission_join_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_sys_role_permission_join_id_seq OWNED BY public.t_sys_role_permission_join.id;


--
-- Name: t_sys_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_sys_roles (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    creation_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.t_sys_roles OWNER TO postgres;

--
-- Name: t_sys_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.t_sys_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_sys_roles_id_seq OWNER TO postgres;

--
-- Name: t_sys_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_sys_roles_id_seq OWNED BY public.t_sys_roles.id;


--
-- Name: t_sys_user_role_join; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_sys_user_role_join (
    id integer NOT NULL,
    user_id integer,
    role_id integer,
    creation_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.t_sys_user_role_join OWNER TO postgres;

--
-- Name: t_sys_user_role_join_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.t_sys_user_role_join_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_sys_user_role_join_id_seq OWNER TO postgres;

--
-- Name: t_sys_user_role_join_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_sys_user_role_join_id_seq OWNED BY public.t_sys_user_role_join.id;


--
-- Name: t_sys_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_sys_users (
    id integer NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4(),
    first_name character varying(32) NOT NULL,
    middle_name character varying(32),
    last_name character varying(32) NOT NULL,
    username character varying(32) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    birth_date timestamp without time zone NOT NULL,
    creation_date timestamp without time zone DEFAULT now() NOT NULL,
    update_date timestamp without time zone,
    delete_date timestamp without time zone
);


ALTER TABLE public.t_sys_users OWNER TO postgres;

--
-- Name: t_sys_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.t_sys_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_sys_users_id_seq OWNER TO postgres;

--
-- Name: t_sys_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_sys_users_id_seq OWNED BY public.t_sys_users.id;


--
-- Name: v_sys_user_role_permissions; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_sys_user_role_permissions AS
 SELECT tsu.id AS user_id,
    tsu.uuid,
    tsu.first_name,
    tsu.middle_name,
    tsu.last_name,
    tsu.username,
    tsu.email,
    tsu.birth_date,
    tsu.creation_date AS user_creation_date,
    tsu.update_date AS user_update_date,
    tsu.delete_date AS user_delete_date,
    tsr.id AS role_id,
    tsr.name AS role_name,
    tsp.id AS permission_id,
    tsp.name AS permission_name
   FROM ((((public.t_sys_users tsu
     LEFT JOIN public.t_sys_user_role_join tsurj ON ((tsurj.user_id = tsu.id)))
     LEFT JOIN public.t_sys_roles tsr ON ((tsr.id = tsurj.role_id)))
     LEFT JOIN public.t_sys_role_permission_join tsrpj ON ((tsrpj.role_id = tsr.id)))
     LEFT JOIN public.t_sys_permissions tsp ON ((tsp.id = tsrpj.permission_id)));


ALTER TABLE public.v_sys_user_role_permissions OWNER TO postgres;

--
-- Name: t_sys_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_permissions ALTER COLUMN id SET DEFAULT nextval('public.t_sys_permissions_id_seq'::regclass);


--
-- Name: t_sys_role_permission_join id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_role_permission_join ALTER COLUMN id SET DEFAULT nextval('public.t_sys_role_permission_join_id_seq'::regclass);


--
-- Name: t_sys_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_roles ALTER COLUMN id SET DEFAULT nextval('public.t_sys_roles_id_seq'::regclass);


--
-- Name: t_sys_user_role_join id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_user_role_join ALTER COLUMN id SET DEFAULT nextval('public.t_sys_user_role_join_id_seq'::regclass);


--
-- Name: t_sys_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_users ALTER COLUMN id SET DEFAULT nextval('public.t_sys_users_id_seq'::regclass);


--
-- Data for Name: t_sys_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_sys_permissions (id, name, creation_date) FROM stdin;
1	ASSING_TASK	2021-06-13 22:17:48.586232
2	PERFORM_TASK	2021-06-13 22:17:48.586232
\.


--
-- Data for Name: t_sys_role_permission_join; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_sys_role_permission_join (id, role_id, permission_id, creation_date) FROM stdin;
1	1	2	2021-06-13 22:18:30.823732
2	2	1	2021-06-13 22:18:30.823732
\.


--
-- Data for Name: t_sys_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_sys_roles (id, name, creation_date) FROM stdin;
1	OPERATOR	2021-06-13 22:17:18.753014
2	ADMIN	2021-06-13 22:17:18.753014
\.


--
-- Data for Name: t_sys_user_role_join; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_sys_user_role_join (id, user_id, role_id, creation_date) FROM stdin;
1	3	2	2021-06-13 22:19:04.719255
\.


--
-- Data for Name: t_sys_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_sys_users (id, uuid, first_name, middle_name, last_name, username, email, password, birth_date, creation_date, update_date, delete_date) FROM stdin;
3	2a312ba4-8a4b-4da0-b21e-848c94a6a8b3	tarik	\N	carli	tarikcarli	pro.tarikcarli@gmail.com	$2a$04$YVDyg8niAajxIQlMUnWSRO5A0xyKomO6yLRt1TlHzb5EHXldOfVpK	1998-02-16 00:00:00	2021-06-13 21:58:54.528574	\N	\N
\.


--
-- Name: t_sys_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_sys_permissions_id_seq', 2, true);


--
-- Name: t_sys_role_permission_join_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_sys_role_permission_join_id_seq', 2, true);


--
-- Name: t_sys_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_sys_roles_id_seq', 2, true);


--
-- Name: t_sys_user_role_join_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_sys_user_role_join_id_seq', 1, true);


--
-- Name: t_sys_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_sys_users_id_seq', 3, true);


--
-- Name: t_sys_permissions t_sys_permissions_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_permissions
    ADD CONSTRAINT t_sys_permissions_name_key UNIQUE (name);


--
-- Name: t_sys_permissions t_sys_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_permissions
    ADD CONSTRAINT t_sys_permissions_pkey PRIMARY KEY (id);


--
-- Name: t_sys_role_permission_join t_sys_role_permission_join_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_role_permission_join
    ADD CONSTRAINT t_sys_role_permission_join_pkey PRIMARY KEY (id);


--
-- Name: t_sys_roles t_sys_roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_roles
    ADD CONSTRAINT t_sys_roles_name_key UNIQUE (name);


--
-- Name: t_sys_roles t_sys_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_roles
    ADD CONSTRAINT t_sys_roles_pkey PRIMARY KEY (id);


--
-- Name: t_sys_user_role_join t_sys_user_role_join_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_user_role_join
    ADD CONSTRAINT t_sys_user_role_join_pkey PRIMARY KEY (id);


--
-- Name: t_sys_users t_sys_users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_users
    ADD CONSTRAINT t_sys_users_email_key UNIQUE (email);


--
-- Name: t_sys_users t_sys_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_users
    ADD CONSTRAINT t_sys_users_pkey PRIMARY KEY (id);


--
-- Name: t_sys_users t_sys_users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_users
    ADD CONSTRAINT t_sys_users_username_key UNIQUE (username);


--
-- Name: t_sys_users t_sys_users_uuid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_users
    ADD CONSTRAINT t_sys_users_uuid_key UNIQUE (uuid);


--
-- Name: t_sys_role_permission_join t_sys_role_permission_join_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_role_permission_join
    ADD CONSTRAINT t_sys_role_permission_join_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.t_sys_permissions(id);


--
-- Name: t_sys_role_permission_join t_sys_role_permission_join_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_role_permission_join
    ADD CONSTRAINT t_sys_role_permission_join_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.t_sys_roles(id);


--
-- Name: t_sys_user_role_join t_sys_user_role_join_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_user_role_join
    ADD CONSTRAINT t_sys_user_role_join_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.t_sys_roles(id);


--
-- Name: t_sys_user_role_join t_sys_user_role_join_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_sys_user_role_join
    ADD CONSTRAINT t_sys_user_role_join_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.t_sys_users(id);


--
-- PostgreSQL database dump complete
--


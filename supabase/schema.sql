CREATE TABLE plant_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    scientific_name VARCHAR(150) NOT NULL UNIQUE,

    emoji VARCHAR(10) NOT NULL DEFAULT '🌱',

    default_interval_days INTEGER NOT NULL
        CHECK (default_interval_days > 0),

    difficulty VARCHAR(30),

    light_requirement VARCHAR(50),

    pet_safe BOOLEAN,

    default_image_url TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE plant_types
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read plant types"
ON plant_types
FOR SELECT
USING (true);

CREATE TABLE plant_type_translations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    plant_type_id BIGINT NOT NULL
        REFERENCES plant_types(id)
        ON DELETE CASCADE,

    language_code VARCHAR(5) NOT NULL
        CHECK (language_code IN ('ko', 'en', 'de')),

    name VARCHAR(100) NOT NULL,

    description TEXT,

    care_tips TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_plant_type_translation_language
        UNIQUE (plant_type_id, language_code)
);

ALTER TABLE plant_type_translations
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read plant type translations"
ON plant_type_translations
FOR SELECT
USING (true);

CREATE TABLE plants (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID,

    plant_type_id BIGINT NOT NULL
        REFERENCES plant_types(id)
        ON DELETE RESTRICT,

    display_name VARCHAR(100) NOT NULL,

    watering_mode VARCHAR(20) NOT NULL
        CHECK (watering_mode IN ('automatic', 'custom')),

    custom_interval_days INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE plants
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage plants during development"
ON plants
FOR ALL
USING (true)
WITH CHECK (true);

-- =========================================================
-- Watering history
-- =========================================================

CREATE TABLE watering_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    plant_id BIGINT NOT NULL
        REFERENCES plants(id)
        ON DELETE CASCADE,

    watered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    note TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_watering_history_plant_watered_at
ON watering_history (plant_id, watered_at DESC);

ALTER TABLE watering_history
ENABLE ROW LEVEL SECURITY;

-- 개발 중 임시 정책
CREATE POLICY "Development read watering history"
ON watering_history
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Development insert watering history"
ON watering_history
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Development delete watering history"
ON watering_history
FOR DELETE
TO anon, authenticated
USING (true);


-- =========================================================
-- Plant watering status view
-- =========================================================

CREATE VIEW v_plant_watering_status
WITH (security_invoker = true)
AS
WITH last_watering AS (
    SELECT
        plant_id,
        MAX(watered_at) AS last_watered_at
    FROM watering_history
    GROUP BY plant_id
),
plant_schedule AS (
    SELECT
        p.id AS plant_id,
        p.display_name,
        p.plant_type_id,
        tr.name AS plant_type_name,
        pt.emoji,
        p.watering_mode,

        CASE
            WHEN p.watering_mode = 'custom'
                THEN COALESCE(
                    p.custom_interval_days,
                    pt.default_interval_days
                )
            ELSE pt.default_interval_days
        END AS interval_days,

        lw.last_watered_at,

        COALESCE(
            lw.last_watered_at,
            p.created_at
        ) AS schedule_start_at

    FROM plants AS p

    JOIN plant_types AS pt
        ON pt.id = p.plant_type_id

    JOIN plant_type_translations AS tr
        ON tr.plant_type_id = pt.id
       AND tr.language_code = 'ko'

    LEFT JOIN last_watering AS lw
        ON lw.plant_id = p.id

    WHERE p.is_active = TRUE
)
SELECT
    plant_id,
    display_name,
    plant_type_id,
    plant_type_name,
    emoji,
    watering_mode,
    interval_days,
    last_watered_at,

    schedule_start_at
        + MAKE_INTERVAL(days => interval_days)
        AS next_watering_at,

    (
        schedule_start_at
            + MAKE_INTERVAL(days => interval_days)
    )::DATE - CURRENT_DATE
        AS days_until_watering,

    CASE
        WHEN (
            schedule_start_at
                + MAKE_INTERVAL(days => interval_days)
        )::DATE < CURRENT_DATE
            THEN 'overdue'

        WHEN (
            schedule_start_at
                + MAKE_INTERVAL(days => interval_days)
        )::DATE = CURRENT_DATE
            THEN 'due_today'

        ELSE 'not_due'
    END AS watering_status

FROM plant_schedule;

GRANT SELECT
ON v_plant_watering_status
TO anon, authenticated;
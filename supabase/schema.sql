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
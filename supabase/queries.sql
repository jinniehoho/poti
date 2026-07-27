SELECT *
FROM plant_types;

SELECT
    pt.id,
    pt.scientific_name,
    pt.default_interval_days,
    tr.language_code,
    tr.name
FROM plant_types AS pt
JOIN plant_type_translations AS tr
    ON tr.plant_type_id = pt.id
ORDER BY pt.id, tr.language_code;

-- 2026-07: plant_types에 emoji 컬럼 추가
ALTER TABLE plant_types
ADD COLUMN emoji VARCHAR(10) NOT NULL DEFAULT '🌱';

UPDATE plant_types
SET emoji = CASE scientific_name
    WHEN 'Monstera deliciosa' THEN '🌿'
    WHEN 'Sansevieria trifasciata' THEN '🪴'
    WHEN 'Epipremnum aureum' THEN '🌱'
    ELSE '🌱'
END;

SELECT *
FROM plants;

-- 물주기 기록 확인
SELECT *
FROM watering_history
ORDER BY watered_at DESC;


-- 식물별 물주기 상태 확인
SELECT
    plant_id,
    display_name,
    plant_type_name,
    interval_days,
    last_watered_at,
    next_watering_at,
    days_until_watering,
    watering_status
FROM v_plant_watering_status
ORDER BY next_watering_at;
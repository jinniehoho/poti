-- Build 8 initial catalog seed.
-- Data-only and additive: existing UUIDs, legacy IDs, mappings, and user
-- plants are not updated or deleted.

begin;

create temporary table initial_catalog_family_seed (
  scientific_name text primary key,
  name_ko text,
  name_en text,
  name_de text
) on commit drop;

insert into initial_catalog_family_seed (
  scientific_name,
  name_ko,
  name_en,
  name_de
)
values
  ('Araceae', '천남성과', 'Arum family', 'Aronstabgewächse'),
  ('Asparagaceae', '비짜루과', 'Asparagus family', 'Spargelgewächse'),
  ('Moraceae', '뽕나무과', 'Mulberry family', 'Maulbeergewächse'),
  ('Malvaceae', '아욱과', 'Mallow family', 'Malvengewächse'),
  ('Araliaceae', '두릅나무과', 'Aralia family', 'Araliengewächse'),
  ('Arecaceae', '야자과', 'Palm family', 'Palmengewächse'),
  ('Marantaceae', '마란타과', 'Prayer plant family', 'Pfeilwurzgewächse'),
  ('Piperaceae', '후추과', 'Pepper family', 'Pfeffergewächse'),
  ('Urticaceae', '쐐기풀과', 'Nettle family', 'Brennnesselgewächse'),
  ('Commelinaceae', '닭의장풀과', 'Dayflower family', 'Commelinagewächse'),
  ('Euphorbiaceae', '대극과', 'Spurge family', 'Wolfsmilchgewächse'),
  ('Asphodelaceae', '아스포델루스과', 'Asphodel family', 'Affodillgewächse'),
  ('Crassulaceae', '돌나물과', 'Stonecrop family', 'Dickblattgewächse'),
  ('Asteraceae', '국화과', 'Daisy family', 'Korbblütler'),
  ('Cactaceae', '선인장과', 'Cactus family', 'Kakteengewächse'),
  ('Lamiaceae', '꿀풀과', 'Mint family', 'Lippenblütler'),
  ('Apiaceae', '미나리과', 'Carrot family', 'Doldenblütler'),
  ('Orchidaceae', '난초과', 'Orchid family', 'Orchideen'),
  ('Gesneriaceae', '게스네리아과', 'Gesneriad family', 'Gesneriengewächse'),
  ('Begoniaceae', '베고니아과', 'Begonia family', 'Schiefblattgewächse'),
  ('Rubiaceae', '꼭두서니과', 'Coffee family', 'Rötegewächse'),
  ('Hydrangeaceae', '수국과', 'Hydrangea family', 'Hortensiengewächse'),
  ('Primulaceae', '앵초과', 'Primrose family', 'Primelgewächse'),
  ('Geraniaceae', '쥐손이풀과', 'Geranium family', 'Storchschnabelgewächse'),
  ('Apocynaceae', '협죽도과', 'Dogbane family', 'Hundsgiftgewächse');

insert into public.plant_families (
  scientific_name,
  name_ko,
  name_en,
  name_de,
  review_status,
  is_active
)
select
  scientific_name,
  name_ko,
  name_en,
  name_de,
  'published',
  true
from initial_catalog_family_seed
on conflict (scientific_name) do nothing;

create temporary table initial_catalog_genus_seed (
  family_scientific_name text not null,
  scientific_name text primary key
) on commit drop;

insert into initial_catalog_genus_seed (
  family_scientific_name,
  scientific_name
)
values
  ('Araceae', 'Monstera'),
  ('Araceae', 'Epipremnum'),
  ('Asparagaceae', 'Dracaena'),
  ('Moraceae', 'Ficus'),
  ('Araceae', 'Zamioculcas'),
  ('Araceae', 'Spathiphyllum'),
  ('Araceae', 'Philodendron'),
  ('Araceae', 'Syngonium'),
  ('Araceae', 'Scindapsus'),
  ('Araceae', 'Aglaonema'),
  ('Araceae', 'Dieffenbachia'),
  ('Malvaceae', 'Pachira'),
  ('Araliaceae', 'Heptapleurum'),
  ('Arecaceae', 'Chamaedorea'),
  ('Arecaceae', 'Chrysalidocarpus'),
  ('Asparagaceae', 'Beaucarnea'),
  ('Asparagaceae', 'Yucca'),
  ('Asparagaceae', 'Chlorophytum'),
  ('Marantaceae', 'Goeppertia'),
  ('Marantaceae', 'Maranta'),
  ('Marantaceae', 'Stromanthe'),
  ('Araceae', 'Alocasia'),
  ('Araceae', 'Colocasia'),
  ('Araceae', 'Anthurium'),
  ('Piperaceae', 'Peperomia'),
  ('Urticaceae', 'Pilea'),
  ('Commelinaceae', 'Tradescantia'),
  ('Marantaceae', 'Ctenanthe'),
  ('Asparagaceae', 'Aspidistra'),
  ('Euphorbiaceae', 'Codiaeum'),
  ('Asphodelaceae', 'Aloe'),
  ('Crassulaceae', 'Crassula'),
  ('Crassulaceae', 'Echeveria'),
  ('Asphodelaceae', 'Haworthia'),
  ('Asphodelaceae', 'Haworthiopsis'),
  ('Crassulaceae', 'Kalanchoe'),
  ('Crassulaceae', 'Sedum'),
  ('Asteraceae', 'Curio'),
  ('Cactaceae', 'Opuntia'),
  ('Cactaceae', 'Mammillaria'),
  ('Cactaceae', 'Gymnocalycium'),
  ('Cactaceae', 'Schlumbergera'),
  ('Lamiaceae', 'Ocimum'),
  ('Lamiaceae', 'Salvia'),
  ('Lamiaceae', 'Mentha'),
  ('Lamiaceae', 'Thymus'),
  ('Lamiaceae', 'Origanum'),
  ('Apiaceae', 'Petroselinum'),
  ('Apiaceae', 'Coriandrum'),
  ('Orchidaceae', 'Phalaenopsis'),
  ('Orchidaceae', 'Dendrobium'),
  ('Orchidaceae', 'Cymbidium'),
  ('Orchidaceae', 'Paphiopedilum'),
  ('Gesneriaceae', 'Streptocarpus'),
  ('Begoniaceae', 'Begonia'),
  ('Malvaceae', 'Hibiscus'),
  ('Rubiaceae', 'Gardenia'),
  ('Hydrangeaceae', 'Hydrangea'),
  ('Primulaceae', 'Cyclamen'),
  ('Asteraceae', 'Gerbera'),
  ('Geraniaceae', 'Pelargonium'),
  ('Apocynaceae', 'Hoya'),
  ('Apocynaceae', 'Ceropegia'),
  ('Cactaceae', 'Rhipsalis'),
  ('Apocynaceae', 'Dischidia'),
  ('Araceae', 'Rhaphidophora'),
  ('Gesneriaceae', 'Aeschynanthus');

insert into public.plant_genera (
  family_id,
  scientific_name,
  review_status,
  is_active
)
select
  family.id,
  seed.scientific_name,
  'published',
  true
from initial_catalog_genus_seed seed
join public.plant_families family
  on family.scientific_name = seed.family_scientific_name
on conflict (scientific_name) do nothing;

create temporary table initial_catalog_species_seed (
  category text not null,
  genus_scientific_name text not null,
  scientific_name text primary key,
  specific_epithet text not null,
  accepted_scientific_name text not null,
  synonyms text[] not null default '{}',
  default_name_ko text not null,
  default_name_en text not null,
  default_name_de text not null,
  care_group text not null,
  light_level text not null,
  light_min integer not null,
  light_max integer not null,
  watering_min_days integer not null,
  watering_max_days integer not null,
  humidity_min integer not null,
  humidity_max integer not null,
  temperature_min_c numeric not null,
  temperature_max_c numeric not null,
  difficulty text not null,
  toxicity text not null,
  pet_toxic boolean,
  human_toxic boolean,
  popularity_rank integer not null
) on commit drop;

insert into initial_catalog_species_seed (
  category,
  genus_scientific_name,
  scientific_name,
  specific_epithet,
  accepted_scientific_name,
  synonyms,
  default_name_ko,
  default_name_en,
  default_name_de,
  care_group,
  light_level,
  light_min,
  light_max,
  watering_min_days,
  watering_max_days,
  humidity_min,
  humidity_max,
  temperature_min_c,
  temperature_max_c,
  difficulty,
  toxicity,
  pet_toxic,
  human_toxic,
  popularity_rank
)
values
  ('foliage', 'Zamioculcas', 'Zamioculcas zamiifolia', 'zamiifolia', 'Zamioculcas zamiifolia', array[]::text[], '금전수', 'ZZ plant', 'Glücksfeder', 'drought_foliage', 'low_to_medium', 20, 60, 14, 21, 30, 60, 16, 30, 'easy', 'calcium_oxalate', true, true, 99),
  ('foliage', 'Spathiphyllum', 'Spathiphyllum wallisii', 'wallisii', 'Spathiphyllum wallisii', array[]::text[], '스파티필름', 'Peace lily', 'Einblatt', 'tropical_foliage', 'low_to_medium', 20, 60, 5, 8, 50, 80, 18, 29, 'easy', 'calcium_oxalate', true, true, 98),
  ('foliage', 'Ficus', 'Ficus lyrata', 'lyrata', 'Ficus lyrata', array[]::text[], '떡갈고무나무', 'Fiddle-leaf fig', 'Geigenfeige', 'tropical_foliage', 'bright_indirect', 60, 90, 7, 12, 40, 60, 16, 29, 'moderate', 'irritant_sap', true, true, 97),
  ('foliage', 'Philodendron', 'Philodendron hederaceum', 'hederaceum', 'Philodendron hederaceum', array['Philodendron scandens']::text[], '하트리프 필로덴드론', 'Heartleaf philodendron', 'Herzblatt-Philodendron', 'tropical_foliage', 'medium', 40, 70, 7, 12, 45, 75, 18, 29, 'easy', 'calcium_oxalate', true, true, 96),
  ('foliage', 'Philodendron', 'Philodendron gloriosum', 'gloriosum', 'Philodendron gloriosum', array[]::text[], '필로덴드론 글로리오섬', 'Gloriosum philodendron', 'Philodendron gloriosum', 'tropical_foliage', 'medium_to_bright', 50, 80, 7, 12, 60, 80, 18, 29, 'moderate', 'calcium_oxalate', true, true, 78),
  ('foliage', 'Philodendron', 'Philodendron melanochrysum', 'melanochrysum', 'Philodendron melanochrysum', array[]::text[], '필로덴드론 멜라노크리섬', 'Black-gold philodendron', 'Philodendron melanochrysum', 'tropical_foliage', 'medium_to_bright', 50, 80, 7, 12, 60, 85, 18, 29, 'difficult', 'calcium_oxalate', true, true, 74),
  ('foliage', 'Philodendron', 'Philodendron erubescens', 'erubescens', 'Philodendron erubescens', array[]::text[], '레드 에메랄드 필로덴드론', 'Blushing philodendron', 'Kletter-Philodendron', 'tropical_foliage', 'medium_to_bright', 50, 80, 7, 12, 50, 80, 18, 29, 'moderate', 'calcium_oxalate', true, true, 88),
  ('foliage', 'Syngonium', 'Syngonium podophyllum', 'podophyllum', 'Syngonium podophyllum', array[]::text[], '싱고니움', 'Arrowhead plant', 'Purpurtute', 'tropical_foliage', 'medium', 40, 70, 7, 12, 45, 75, 18, 29, 'easy', 'calcium_oxalate', true, true, 94),
  ('foliage', 'Scindapsus', 'Scindapsus pictus', 'pictus', 'Scindapsus pictus', array[]::text[], '스킨답서스 픽투스', 'Satin pothos', 'Gefleckte Efeutute', 'tropical_foliage', 'medium', 40, 70, 7, 14, 40, 70, 18, 29, 'easy', 'calcium_oxalate', true, true, 91),
  ('foliage', 'Aglaonema', 'Aglaonema commutatum', 'commutatum', 'Aglaonema commutatum', array[]::text[], '아글라오네마', 'Chinese evergreen', 'Kolbenfaden', 'tropical_foliage', 'low_to_medium', 20, 60, 7, 12, 45, 75, 18, 30, 'easy', 'calcium_oxalate', true, true, 89),
  ('foliage', 'Dieffenbachia', 'Dieffenbachia seguine', 'seguine', 'Dieffenbachia seguine', array[]::text[], '디펜바키아', 'Dumb cane', 'Dieffenbachie', 'tropical_foliage', 'medium', 40, 70, 7, 12, 45, 75, 18, 30, 'easy', 'calcium_oxalate', true, true, 84),
  ('foliage', 'Dracaena', 'Dracaena fragrans', 'fragrans', 'Dracaena fragrans', array[]::text[], '행운목', 'Corn plant', 'Duftender Drachenbaum', 'drought_foliage', 'low_to_medium', 20, 60, 10, 18, 35, 65, 16, 30, 'easy', 'saponins', true, false, 92),
  ('foliage', 'Dracaena', 'Dracaena reflexa var. angustifolia', 'reflexa', 'Dracaena reflexa var. angustifolia', array['Dracaena marginata']::text[], '드라세나 마지나타', 'Madagascar dragon tree', 'Gerandeter Drachenbaum', 'drought_foliage', 'medium_to_bright', 40, 80, 10, 18, 35, 65, 16, 30, 'easy', 'saponins', true, false, 93),
  ('foliage', 'Pachira', 'Pachira aquatica', 'aquatica', 'Pachira aquatica', array[]::text[], '파키라', 'Money tree', 'Glückskastanie', 'tropical_foliage', 'medium_to_bright', 40, 80, 7, 12, 40, 70, 16, 30, 'easy', 'not_known_toxic', false, false, 90),
  ('foliage', 'Heptapleurum', 'Heptapleurum arboricola', 'arboricola', 'Heptapleurum arboricola', array['Schefflera arboricola']::text[], '홍콩야자', 'Dwarf umbrella tree', 'Strahlenaralie', 'tropical_foliage', 'medium_to_bright', 40, 80, 7, 12, 40, 70, 16, 30, 'easy', 'calcium_oxalate', true, true, 87),
  ('foliage', 'Chamaedorea', 'Chamaedorea elegans', 'elegans', 'Chamaedorea elegans', array[]::text[], '테이블야자', 'Parlor palm', 'Bergpalme', 'tropical_foliage', 'low_to_medium', 20, 60, 7, 12, 40, 70, 16, 29, 'easy', 'not_known_toxic', false, false, 86),
  ('foliage', 'Chrysalidocarpus', 'Chrysalidocarpus lutescens', 'lutescens', 'Chrysalidocarpus lutescens', array['Dypsis lutescens']::text[], '아레카야자', 'Areca palm', 'Goldfruchtpalme', 'tropical_foliage', 'medium_to_bright', 40, 80, 5, 10, 45, 75, 18, 30, 'moderate', 'not_known_toxic', false, false, 85),
  ('foliage', 'Beaucarnea', 'Beaucarnea recurvata', 'recurvata', 'Beaucarnea recurvata', array[]::text[], '덕구리란', 'Ponytail palm', 'Elefantenfuß', 'drought_foliage', 'bright_indirect', 60, 90, 14, 24, 30, 60, 12, 30, 'easy', 'not_known_toxic', false, false, 83),
  ('foliage', 'Yucca', 'Yucca gigantea', 'gigantea', 'Yucca gigantea', array['Yucca elephantipes']::text[], '유카', 'Spineless yucca', 'Riesen-Palmlilie', 'drought_foliage', 'medium_to_bright', 50, 90, 10, 21, 30, 60, 10, 30, 'easy', 'steroidal_saponins', true, null, 82),
  ('foliage', 'Chlorophytum', 'Chlorophytum comosum', 'comosum', 'Chlorophytum comosum', array[]::text[], '접란', 'Spider plant', 'Grünlilie', 'tropical_foliage', 'medium', 40, 70, 5, 10, 40, 70, 12, 29, 'easy', 'not_known_toxic', false, false, 95),
  ('foliage', 'Goeppertia', 'Goeppertia orbifolia', 'orbifolia', 'Goeppertia orbifolia', array['Calathea orbifolia']::text[], '칼라데아 오르비폴리아', 'Round-leaf calathea', 'Korbmarante Orbifolia', 'humidity_foliage', 'medium', 40, 70, 5, 9, 60, 85, 18, 28, 'moderate', 'not_known_toxic', false, false, 81),
  ('foliage', 'Goeppertia', 'Goeppertia makoyana', 'makoyana', 'Goeppertia makoyana', array['Calathea makoyana']::text[], '칼라데아 마코야나', 'Peacock plant', 'Pfauen-Korbmarante', 'humidity_foliage', 'medium', 40, 70, 5, 9, 60, 85, 18, 28, 'moderate', 'not_known_toxic', false, false, 76),
  ('foliage', 'Maranta', 'Maranta leuconeura', 'leuconeura', 'Maranta leuconeura', array[]::text[], '마란타', 'Prayer plant', 'Gebetspflanze', 'humidity_foliage', 'medium', 40, 70, 5, 9, 60, 85, 18, 28, 'moderate', 'not_known_toxic', false, false, 80),
  ('foliage', 'Stromanthe', 'Stromanthe thalia', 'thalia', 'Stromanthe thalia', array['Stromanthe sanguinea']::text[], '스트로만테', 'Stromanthe', 'Stromanthe', 'humidity_foliage', 'medium_to_bright', 50, 80, 5, 9, 60, 85, 18, 28, 'difficult', 'not_known_toxic', false, false, 72),
  ('foliage', 'Alocasia', 'Alocasia reginula', 'reginula', 'Alocasia reginula', array[]::text[], '알로카시아 블랙벨벳', 'Black velvet alocasia', 'Schwarze Samt-Alokasie', 'humidity_foliage', 'medium_to_bright', 50, 80, 6, 10, 60, 85, 18, 29, 'moderate', 'calcium_oxalate', true, true, 79),
  ('foliage', 'Alocasia', 'Alocasia zebrina', 'zebrina', 'Alocasia zebrina', array[]::text[], '알로카시아 제브리나', 'Zebra alocasia', 'Zebra-Alokasie', 'humidity_foliage', 'medium_to_bright', 50, 80, 5, 9, 60, 85, 18, 29, 'moderate', 'calcium_oxalate', true, true, 73),
  ('foliage', 'Colocasia', 'Colocasia esculenta', 'esculenta', 'Colocasia esculenta', array[]::text[], '토란', 'Taro', 'Taro', 'humidity_foliage', 'medium_to_bright', 50, 90, 3, 7, 60, 90, 18, 32, 'moderate', 'calcium_oxalate_when_raw', true, true, 68),
  ('foliage', 'Anthurium', 'Anthurium andraeanum', 'andraeanum', 'Anthurium andraeanum', array[]::text[], '안스리움', 'Flamingo flower', 'Flamingoblume', 'humidity_foliage', 'medium_to_bright', 50, 80, 5, 9, 60, 85, 18, 29, 'moderate', 'calcium_oxalate', true, true, 77),
  ('foliage', 'Anthurium', 'Anthurium clarinervium', 'clarinervium', 'Anthurium clarinervium', array[]::text[], '안스리움 클라리네르비움', 'Velvet cardboard anthurium', 'Samt-Anthurie', 'humidity_foliage', 'medium_to_bright', 50, 80, 7, 12, 60, 85, 18, 29, 'moderate', 'calcium_oxalate', true, true, 69),
  ('foliage', 'Peperomia', 'Peperomia obtusifolia', 'obtusifolia', 'Peperomia obtusifolia', array[]::text[], '페페로미아 옵투시폴리아', 'Baby rubber plant', 'Zwergpfeffer', 'semi_succulent', 'medium_to_bright', 40, 80, 8, 14, 40, 70, 16, 29, 'easy', 'not_known_toxic', false, false, 75),
  ('foliage', 'Peperomia', 'Peperomia caperata', 'caperata', 'Peperomia caperata', array[]::text[], '주름 페페로미아', 'Ripple peperomia', 'Zwergpfeffer Caperata', 'semi_succulent', 'medium', 40, 70, 8, 14, 45, 75, 16, 29, 'easy', 'not_known_toxic', false, false, 65),
  ('foliage', 'Pilea', 'Pilea peperomioides', 'peperomioides', 'Pilea peperomioides', array[]::text[], '필레아 페페로미오이데스', 'Chinese money plant', 'Ufopflanze', 'tropical_foliage', 'medium_to_bright', 40, 80, 6, 10, 40, 70, 15, 28, 'easy', 'not_known_toxic', false, false, 71),
  ('foliage', 'Tradescantia', 'Tradescantia zebrina', 'zebrina', 'Tradescantia zebrina', array[]::text[], '자주달개비 제브리나', 'Inch plant', 'Zebrakraut', 'tropical_foliage', 'medium_to_bright', 40, 90, 5, 9, 40, 70, 12, 30, 'easy', 'contact_irritant', true, true, 67),
  ('foliage', 'Ctenanthe', 'Ctenanthe burle-marxii', 'burle-marxii', 'Ctenanthe burle-marxii', array[]::text[], '크테난테 부를레 막시', 'Fishbone prayer plant', 'Fischgräten-Korbmarante', 'humidity_foliage', 'medium', 40, 70, 5, 9, 60, 85, 18, 28, 'moderate', 'not_known_toxic', false, false, 63),
  ('foliage', 'Aspidistra', 'Aspidistra elatior', 'elatior', 'Aspidistra elatior', array[]::text[], '엽란', 'Cast-iron plant', 'Schusterpalme', 'drought_foliage', 'low_to_medium', 15, 60, 10, 18, 30, 65, 10, 28, 'easy', 'not_known_toxic', false, false, 62),
  ('foliage', 'Codiaeum', 'Codiaeum variegatum', 'variegatum', 'Codiaeum variegatum', array[]::text[], '크로톤', 'Croton', 'Wunderstrauch', 'tropical_foliage', 'bright_indirect', 60, 90, 5, 9, 50, 80, 18, 30, 'moderate', 'irritant_sap', true, true, 70),
  ('succulent', 'Aloe', 'Aloe vera', 'vera', 'Aloe vera', array['Aloe barbadensis']::text[], '알로에', 'Aloe vera', 'Echte Aloe', 'succulent', 'direct_sun', 70, 100, 14, 28, 20, 50, 10, 30, 'easy', 'anthraquinones_and_saponins', true, true, 94),
  ('succulent', 'Crassula', 'Crassula ovata', 'ovata', 'Crassula ovata', array[]::text[], '염자', 'Jade plant', 'Geldbaum', 'succulent', 'direct_sun', 70, 100, 14, 28, 20, 50, 10, 30, 'easy', 'toxic_to_pets', true, null, 88),
  ('succulent', 'Echeveria', 'Echeveria elegans', 'elegans', 'Echeveria elegans', array[]::text[], '에케베리아 엘레간스', 'Mexican snowball', 'Mexikanische Schneeball-Echeverie', 'succulent', 'direct_sun', 70, 100, 14, 28, 20, 50, 8, 30, 'easy', 'not_known_toxic', false, false, 66),
  ('succulent', 'Haworthia', 'Haworthia cooperi', 'cooperi', 'Haworthia cooperi', array[]::text[], '하월시아 쿠페리', 'Cooper''s haworthia', 'Cooper-Haworthie', 'succulent', 'bright_indirect', 60, 90, 14, 28, 20, 50, 8, 30, 'easy', 'not_known_toxic', false, false, 54),
  ('succulent', 'Haworthiopsis', 'Haworthiopsis attenuata', 'attenuata', 'Haworthiopsis attenuata', array['Haworthia attenuata']::text[], '십이지권', 'Zebra haworthia', 'Zebra-Haworthie', 'succulent', 'bright_indirect', 60, 90, 14, 28, 20, 50, 8, 30, 'easy', 'not_known_toxic', false, false, 60),
  ('succulent', 'Kalanchoe', 'Kalanchoe blossfeldiana', 'blossfeldiana', 'Kalanchoe blossfeldiana', array[]::text[], '칼랑코에', 'Flaming Katy', 'Flammendes Käthchen', 'succulent', 'direct_sun', 70, 100, 10, 21, 20, 50, 12, 30, 'easy', 'bufadienolides', true, true, 64),
  ('succulent', 'Sedum', 'Sedum rubrotinctum', 'rubrotinctum', 'Sedum rubrotinctum', array[]::text[], '홍옥', 'Jelly bean plant', 'Bohnen-Fetthenne', 'succulent', 'direct_sun', 70, 100, 14, 28, 20, 50, 8, 30, 'easy', 'review_required', null, null, 52),
  ('succulent', 'Curio', 'Curio rowleyanus', 'rowleyanus', 'Curio rowleyanus', array['Senecio rowleyanus']::text[], '녹영', 'String of pearls', 'Erbsenpflanze', 'succulent', 'bright_indirect', 60, 90, 14, 24, 25, 55, 10, 28, 'moderate', 'toxic_if_ingested', true, true, 61),
  ('succulent', 'Opuntia', 'Opuntia microdasys', 'microdasys', 'Opuntia microdasys', array[]::text[], '백도선', 'Bunny ears cactus', 'Hasenohrkaktus', 'cactus', 'direct_sun', 80, 100, 21, 35, 15, 45, 5, 35, 'easy', 'physical_glochid_hazard', false, false, 58),
  ('succulent', 'Mammillaria', 'Mammillaria elongata', 'elongata', 'Mammillaria elongata', array[]::text[], '맘밀라리아 엘롱가타', 'Ladyfinger cactus', 'Fingerkaktus', 'cactus', 'direct_sun', 80, 100, 21, 35, 15, 45, 5, 35, 'easy', 'physical_spine_hazard', false, false, 46),
  ('succulent', 'Gymnocalycium', 'Gymnocalycium mihanovichii', 'mihanovichii', 'Gymnocalycium mihanovichii', array[]::text[], '비모란', 'Moon cactus', 'Erdbeerkaktus', 'cactus', 'bright_indirect', 60, 90, 18, 30, 15, 45, 10, 32, 'moderate', 'physical_spine_hazard', false, false, 59),
  ('succulent', 'Schlumbergera', 'Schlumbergera truncata', 'truncata', 'Schlumbergera truncata', array[]::text[], '게발선인장', 'Thanksgiving cactus', 'Gliederkaktus', 'forest_cactus', 'bright_indirect', 60, 90, 7, 14, 40, 70, 12, 28, 'easy', 'not_known_toxic', false, false, 57),
  ('herb', 'Ocimum', 'Ocimum basilicum', 'basilicum', 'Ocimum basilicum', array[]::text[], '바질', 'Basil', 'Basilikum', 'herb_moist', 'direct_sun', 70, 100, 2, 4, 35, 65, 15, 30, 'easy', 'culinary_herb', false, false, 93),
  ('herb', 'Salvia', 'Salvia rosmarinus', 'rosmarinus', 'Salvia rosmarinus', array['Rosmarinus officinalis']::text[], '로즈마리', 'Rosemary', 'Rosmarin', 'herb_dry', 'direct_sun', 80, 100, 4, 7, 30, 60, 8, 30, 'moderate', 'culinary_herb', false, false, 92),
  ('herb', 'Mentha', 'Mentha spicata', 'spicata', 'Mentha spicata', array[]::text[], '스피어민트', 'Spearmint', 'Grüne Minze', 'herb_moist', 'medium_to_bright', 50, 90, 2, 4, 40, 70, 10, 28, 'easy', 'review_required_for_pets', null, false, 81),
  ('herb', 'Mentha', 'Mentha suaveolens', 'suaveolens', 'Mentha suaveolens', array[]::text[], '애플민트', 'Apple mint', 'Apfelminze', 'herb_moist', 'medium_to_bright', 50, 90, 2, 4, 40, 70, 10, 28, 'easy', 'review_required_for_pets', null, false, 76),
  ('herb', 'Thymus', 'Thymus vulgaris', 'vulgaris', 'Thymus vulgaris', array[]::text[], '타임', 'Thyme', 'Echter Thymian', 'herb_dry', 'direct_sun', 80, 100, 4, 7, 30, 60, 8, 30, 'easy', 'culinary_herb', false, false, 72),
  ('herb', 'Origanum', 'Origanum vulgare', 'vulgare', 'Origanum vulgare', array[]::text[], '오레가노', 'Oregano', 'Oregano', 'herb_dry', 'direct_sun', 80, 100, 4, 7, 30, 60, 8, 30, 'easy', 'culinary_herb', false, false, 74),
  ('herb', 'Petroselinum', 'Petroselinum crispum', 'crispum', 'Petroselinum crispum', array[]::text[], '파슬리', 'Parsley', 'Petersilie', 'herb_moist', 'medium_to_bright', 50, 90, 2, 5, 40, 70, 8, 26, 'easy', 'furanocoumarins', true, false, 70),
  ('herb', 'Coriandrum', 'Coriandrum sativum', 'sativum', 'Coriandrum sativum', array[]::text[], '고수', 'Coriander', 'Koriander', 'herb_moist', 'medium_to_bright', 50, 90, 2, 5, 40, 70, 8, 26, 'easy', 'culinary_herb', false, false, 69),
  ('orchid', 'Phalaenopsis', 'Phalaenopsis aphrodite', 'aphrodite', 'Phalaenopsis aphrodite', array[]::text[], '호접란 아프로디테', 'Aphrodite''s phalaenopsis', 'Phalaenopsis aphrodite', 'orchid', 'bright_indirect', 60, 90, 7, 12, 50, 80, 18, 29, 'moderate', 'review_required', null, null, 55),
  ('orchid', 'Phalaenopsis', 'Phalaenopsis amabilis', 'amabilis', 'Phalaenopsis amabilis', array[]::text[], '호접란', 'Moon orchid', 'Weiße Schmetterlingsorchidee', 'orchid', 'bright_indirect', 60, 90, 7, 12, 50, 80, 18, 29, 'moderate', 'review_required', null, null, 68),
  ('orchid', 'Dendrobium', 'Dendrobium nobile', 'nobile', 'Dendrobium nobile', array[]::text[], '노빌레 덴드로비움', 'Noble dendrobium', 'Dendrobium nobile', 'orchid_cool_rest', 'bright_indirect', 60, 90, 7, 14, 45, 75, 10, 28, 'moderate', 'review_required', null, null, 53),
  ('orchid', 'Cymbidium', 'Cymbidium goeringii', 'goeringii', 'Cymbidium goeringii', array[]::text[], '춘란', 'Noble orchid', 'Japanisches Cymbidium', 'orchid_cool_rest', 'bright_indirect', 60, 90, 7, 14, 45, 75, 8, 26, 'difficult', 'review_required', null, null, 48),
  ('orchid', 'Paphiopedilum', 'Paphiopedilum insigne', 'insigne', 'Paphiopedilum insigne', array[]::text[], '파피오페딜룸 인시그네', 'Splendid slipper orchid', 'Frauenschuh-Orchidee', 'orchid', 'medium', 40, 70, 5, 10, 50, 80, 15, 27, 'moderate', 'review_required', null, null, 44),
  ('flowering', 'Streptocarpus', 'Streptocarpus ionanthus', 'ionanthus', 'Streptocarpus ionanthus', array['Saintpaulia ionantha']::text[], '아프리칸 바이올렛', 'African violet', 'Usambaraveilchen', 'flowering_indoor', 'bright_indirect', 60, 90, 5, 9, 45, 75, 18, 27, 'easy', 'not_known_toxic', false, false, 82),
  ('flowering', 'Begonia', 'Begonia rex', 'rex', 'Begonia rex', array[]::text[], '렉스 베고니아', 'Rex begonia', 'Königsbegonie', 'flowering_indoor', 'bright_indirect', 60, 90, 5, 9, 50, 80, 18, 28, 'moderate', 'soluble_oxalates', true, true, 71),
  ('flowering', 'Hibiscus', 'Hibiscus rosa-sinensis', 'rosa-sinensis', 'Hibiscus rosa-sinensis', array[]::text[], '하와이무궁화', 'Chinese hibiscus', 'Chinesischer Roseneibisch', 'flowering_sun', 'direct_sun', 80, 100, 3, 7, 45, 75, 16, 32, 'moderate', 'review_required', null, null, 66),
  ('flowering', 'Gardenia', 'Gardenia jasminoides', 'jasminoides', 'Gardenia jasminoides', array[]::text[], '치자나무', 'Cape jasmine', 'Gardenie', 'flowering_indoor', 'bright_indirect', 60, 90, 3, 7, 50, 80, 16, 27, 'difficult', 'mild_gastrointestinal_irritant', true, null, 62),
  ('flowering', 'Hydrangea', 'Hydrangea macrophylla', 'macrophylla', 'Hydrangea macrophylla', array[]::text[], '수국', 'Bigleaf hydrangea', 'Bauernhortensie', 'flowering_moist', 'medium_to_bright', 50, 90, 2, 5, 45, 75, 5, 28, 'moderate', 'cyanogenic_glycosides', true, true, 64),
  ('flowering', 'Cyclamen', 'Cyclamen persicum', 'persicum', 'Cyclamen persicum', array[]::text[], '시클라멘', 'Persian cyclamen', 'Zimmer-Alpenveilchen', 'flowering_cool', 'bright_indirect', 60, 90, 4, 7, 40, 70, 8, 22, 'moderate', 'terpenoid_saponins', true, true, 61),
  ('flowering', 'Gerbera', 'Gerbera jamesonii', 'jamesonii', 'Gerbera jamesonii', array[]::text[], '거베라', 'Gerbera daisy', 'Gerbera', 'flowering_sun', 'direct_sun', 80, 100, 3, 6, 40, 70, 10, 28, 'moderate', 'not_known_toxic', false, false, 60),
  ('flowering', 'Pelargonium', 'Pelargonium zonale', 'zonale', 'Pelargonium zonale', array[]::text[], '제라늄', 'Zonal geranium', 'Zonale Pelargonie', 'flowering_sun', 'direct_sun', 80, 100, 4, 7, 35, 65, 8, 30, 'easy', 'geraniol_and_linalool', true, true, 59),
  ('trailing', 'Hoya', 'Hoya carnosa', 'carnosa', 'Hoya carnosa', array[]::text[], '호야', 'Wax plant', 'Wachsblume', 'epiphytic_vine', 'bright_indirect', 60, 90, 10, 18, 40, 70, 15, 29, 'easy', 'not_known_toxic', false, false, 78),
  ('trailing', 'Ceropegia', 'Ceropegia woodii', 'woodii', 'Ceropegia woodii', array[]::text[], '러브체인', 'String of hearts', 'Leuchterblume', 'semi_succulent', 'bright_indirect', 60, 90, 10, 18, 30, 60, 12, 30, 'easy', 'not_known_toxic', false, false, 77),
  ('trailing', 'Rhipsalis', 'Rhipsalis baccifera', 'baccifera', 'Rhipsalis baccifera', array[]::text[], '립살리스', 'Mistletoe cactus', 'Korallenkaktus', 'forest_cactus', 'bright_indirect', 60, 90, 7, 14, 45, 75, 15, 29, 'easy', 'review_required', null, null, 56),
  ('trailing', 'Dischidia', 'Dischidia nummularia', 'nummularia', 'Dischidia nummularia', array[]::text[], '디시디아 넘물라리아', 'String of nickels', 'Münz-Dischidia', 'epiphytic_vine', 'bright_indirect', 60, 90, 7, 14, 50, 80, 18, 29, 'moderate', 'review_required', null, null, 50),
  ('trailing', 'Monstera', 'Monstera adansonii', 'adansonii', 'Monstera adansonii', array[]::text[], '아단소니 몬스테라', 'Swiss cheese vine', 'Affenmaske', 'tropical_foliage', 'medium_to_bright', 50, 80, 7, 12, 50, 80, 18, 29, 'easy', 'calcium_oxalate', true, true, 89),
  ('trailing', 'Rhaphidophora', 'Rhaphidophora tetrasperma', 'tetrasperma', 'Rhaphidophora tetrasperma', array[]::text[], '라피도포라 테트라스페르마', 'Mini monstera', 'Mini-Monstera', 'tropical_foliage', 'medium_to_bright', 50, 80, 7, 12, 45, 75, 18, 29, 'easy', 'calcium_oxalate', true, true, 86),
  ('trailing', 'Aeschynanthus', 'Aeschynanthus radicans', 'radicans', 'Aeschynanthus radicans', array[]::text[], '에스키난투스', 'Lipstick plant', 'Schamblume', 'epiphytic_vine', 'bright_indirect', 60, 90, 5, 10, 50, 80, 18, 29, 'moderate', 'not_known_toxic', false, false, 58);

insert into public.plant_species (
  genus_id,
  scientific_name,
  specific_epithet,
  accepted_scientific_name,
  taxonomic_status,
  synonyms,
  default_name_ko,
  default_name_en,
  default_name_de,
  description_ko,
  description_en,
  description_de,
  light_level,
  light_min,
  light_max,
  watering_min_days,
  watering_max_days,
  humidity_min,
  humidity_max,
  temperature_min_c,
  temperature_max_c,
  difficulty,
  toxicity,
  pet_toxic,
  human_toxic,
  popularity_rank,
  review_status,
  is_active
)
select
  genus.id,
  seed.scientific_name,
  seed.specific_epithet,
  seed.accepted_scientific_name,
  'accepted',
  seed.synonyms,
  seed.default_name_ko,
  seed.default_name_en,
  seed.default_name_de,
  case seed.care_group
    when 'succulent' then '다육질 잎이나 줄기에 수분을 저장합니다. 정해진 날짜보다 흙 상태를 먼저 확인하고, 흙이 충분히 마른 뒤 물을 주세요.'
    when 'cactus' then '건조에 강한 선인장입니다. 정해진 날짜보다 흙 상태를 먼저 확인하고, 배수가 잘되는 흙이 완전히 마른 뒤 물을 주세요.'
    when 'forest_cactus' then '숲에서 자라는 착생 선인장으로 일반 사막 선인장보다 수분을 더 필요로 합니다. 정해진 날짜보다 흙 상태를 먼저 확인하세요.'
    when 'herb_moist' then '잎을 수확해 이용하는 허브입니다. 정해진 날짜보다 흙 상태를 먼저 확인하고, 생육 중에는 흙이 지나치게 마르지 않게 관리하세요.'
    when 'herb_dry' then '햇빛과 통풍을 좋아하는 향기로운 허브입니다. 정해진 날짜보다 흙 상태를 먼저 확인하고 과습을 피하세요.'
    when 'orchid' then '통기성 좋은 난초용 배지에서 기르는 난초입니다. 정해진 날짜보다 뿌리와 배지 상태를 먼저 확인하세요.'
    when 'orchid_cool_rest' then '계절에 따른 온도와 휴면기 관리가 중요한 난초입니다. 정해진 날짜보다 뿌리와 배지 상태를 먼저 확인하세요.'
    when 'humidity_foliage' then '습도와 안정적인 온도를 좋아하는 관엽식물입니다. 정해진 날짜보다 흙 상태를 먼저 확인하고 찬바람을 피하세요.'
    when 'drought_foliage' then '실내 건조에 비교적 강한 관엽식물입니다. 정해진 날짜보다 흙 상태를 먼저 확인하고 흙이 마른 뒤 물을 주세요.'
    when 'semi_succulent' then '잎이나 줄기에 수분을 저장해 과습에 민감합니다. 정해진 날짜보다 흙 상태를 먼저 확인하세요.'
    when 'epiphytic_vine' then '밝은 간접광과 통풍을 좋아하는 덩굴성 또는 착생 식물입니다. 정해진 날짜보다 흙 상태를 먼저 확인하세요.'
    when 'flowering_sun' then '충분한 빛에서 꽃이 잘 피는 식물입니다. 정해진 날짜보다 흙 상태를 먼저 확인하고 생육기에는 물 마름을 자주 살펴보세요.'
    when 'flowering_moist' then '꽃이 피는 동안 비교적 고른 수분을 필요로 합니다. 정해진 날짜보다 흙 상태를 먼저 확인하세요.'
    when 'flowering_cool' then '서늘하고 밝은 환경에서 꽃을 오래 유지합니다. 정해진 날짜보다 흙 상태를 먼저 확인하세요.'
    when 'flowering_indoor' then '밝은 간접광에서 꽃과 잎을 감상하는 실내식물입니다. 정해진 날짜보다 흙 상태를 먼저 확인하세요.'
    else '실내에서 잎을 감상하는 관엽식물입니다. 정해진 날짜보다 흙 상태를 먼저 확인하고 배수와 통풍을 유지하세요.'
  end,
  case seed.care_group
    when 'succulent' then 'This plant stores water in succulent leaves or stems. Check the soil before following a fixed schedule, and water only after it has dried well.'
    when 'cactus' then 'This drought-tolerant cactus needs fast drainage. Check the soil before following a fixed schedule and water only after it is fully dry.'
    when 'forest_cactus' then 'This epiphytic forest cactus needs more moisture than a desert cactus. Check the potting mix before following a fixed schedule.'
    when 'herb_moist' then 'This leafy culinary herb grows best without prolonged drought. Check the soil before following a fixed schedule.'
    when 'herb_dry' then 'This aromatic herb prefers sun, airflow, and good drainage. Check the soil before following a fixed schedule and avoid waterlogging.'
    when 'orchid' then 'This orchid grows best in an airy orchid mix. Check the roots and potting medium before following a fixed watering schedule.'
    when 'orchid_cool_rest' then 'Seasonal temperature and rest-period care are important for this orchid. Check the roots and medium before following a fixed schedule.'
    when 'humidity_foliage' then 'This foliage plant prefers humidity and stable warmth. Check the soil before following a fixed schedule and protect it from cold drafts.'
    when 'drought_foliage' then 'This foliage plant tolerates some indoor dryness. Check the soil before following a fixed schedule and water after the upper mix dries.'
    when 'semi_succulent' then 'Water-storing leaves or stems make this plant sensitive to overwatering. Check the soil before following a fixed schedule.'
    when 'epiphytic_vine' then 'This trailing or epiphytic plant prefers bright indirect light and airflow. Check the potting mix before following a fixed schedule.'
    when 'flowering_sun' then 'Strong light supports flowering. Check the soil before following a fixed schedule and monitor moisture more often during active growth.'
    when 'flowering_moist' then 'Even moisture supports growth and flowering. Check the soil before following a fixed watering schedule.'
    when 'flowering_cool' then 'A bright, cool position helps the flowers last. Check the soil before following a fixed watering schedule.'
    when 'flowering_indoor' then 'This indoor plant is grown for flowers and foliage in bright indirect light. Check the soil before following a fixed schedule.'
    else 'This indoor foliage plant needs drainage and airflow. Check the soil before following a fixed watering schedule.'
  end,
  case seed.care_group
    when 'succulent' then 'Diese Pflanze speichert Wasser in sukkulenten Blättern oder Trieben. Prüfe die Erde vor einem festen Gießplan und gieße erst nach gutem Abtrocknen.'
    when 'cactus' then 'Dieser trockenheitsverträgliche Kaktus braucht sehr gute Drainage. Prüfe die Erde vor einem festen Gießplan und gieße erst nach vollständigem Abtrocknen.'
    when 'forest_cactus' then 'Dieser epiphytische Waldkaktus benötigt mehr Feuchtigkeit als ein Wüstenkaktus. Prüfe das Substrat vor einem festen Gießplan.'
    when 'herb_moist' then 'Dieses Blattkraut wächst am besten ohne längere Trockenheit. Prüfe die Erde vor einem festen Gießplan.'
    when 'herb_dry' then 'Dieses aromatische Kraut bevorzugt Sonne, Luftbewegung und gute Drainage. Prüfe die Erde vor einem festen Gießplan und vermeide Staunässe.'
    when 'orchid' then 'Diese Orchidee wächst am besten in luftigem Orchideensubstrat. Prüfe Wurzeln und Substrat vor einem festen Gießplan.'
    when 'orchid_cool_rest' then 'Jahreszeitliche Temperatur und Ruhephase sind für diese Orchidee wichtig. Prüfe Wurzeln und Substrat vor einem festen Gießplan.'
    when 'humidity_foliage' then 'Diese Blattschmuckpflanze bevorzugt hohe Luftfeuchte und gleichmäßige Wärme. Prüfe die Erde vor einem festen Gießplan und vermeide kalte Zugluft.'
    when 'drought_foliage' then 'Diese Blattschmuckpflanze verträgt zeitweise trockene Raumluft. Prüfe die Erde vor einem festen Gießplan und gieße nach dem Antrocknen.'
    when 'semi_succulent' then 'Wasserspeichernde Blätter oder Triebe machen diese Pflanze empfindlich gegen Staunässe. Prüfe die Erde vor einem festen Gießplan.'
    when 'epiphytic_vine' then 'Diese rankende oder epiphytische Pflanze bevorzugt helles indirektes Licht und Luftbewegung. Prüfe das Substrat vor einem festen Gießplan.'
    when 'flowering_sun' then 'Viel Licht unterstützt die Blüte. Prüfe die Erde vor einem festen Gießplan und kontrolliere sie während des Wachstums häufiger.'
    when 'flowering_moist' then 'Gleichmäßige Feuchtigkeit unterstützt Wachstum und Blüte. Prüfe die Erde vor einem festen Gießplan.'
    when 'flowering_cool' then 'Ein heller, kühler Standort verlängert die Blüte. Prüfe die Erde vor einem festen Gießplan.'
    when 'flowering_indoor' then 'Diese Zimmerpflanze wird bei hellem indirektem Licht wegen ihrer Blüten und Blätter kultiviert. Prüfe die Erde vor einem festen Gießplan.'
    else 'Diese Blattschmuckpflanze braucht Drainage und Luftbewegung. Prüfe die Erde vor einem festen Gießplan.'
  end,
  seed.light_level,
  seed.light_min,
  seed.light_max,
  seed.watering_min_days,
  seed.watering_max_days,
  seed.humidity_min,
  seed.humidity_max,
  seed.temperature_min_c,
  seed.temperature_max_c,
  seed.difficulty,
  seed.toxicity,
  seed.pet_toxic,
  seed.human_toxic,
  seed.popularity_rank,
  'published',
  true
from initial_catalog_species_seed seed
join public.plant_genera genus
  on genus.scientific_name = seed.genus_scientific_name
on conflict (scientific_name) do nothing;

-- Generate canonical names, accepted names, synonyms, localized names, and
-- genus terms through the existing normalization trigger.
insert into public.plant_search_terms (
  species_id,
  locale,
  term,
  normalized_term,
  term_type,
  priority
)
select
  species.id,
  term_seed.locale,
  term_seed.term,
  term_seed.term,
  term_seed.term_type,
  term_seed.priority
from initial_catalog_species_seed seed
join public.plant_species species
  on species.scientific_name = seed.scientific_name
cross join lateral (
  values
    ('la'::text, seed.scientific_name, 'scientific_name'::text, 120),
    ('ko'::text, seed.default_name_ko, 'primary'::text, 110),
    ('en'::text, seed.default_name_en, 'primary'::text, 110),
    ('de'::text, seed.default_name_de, 'primary'::text, 110),
    ('la'::text, seed.genus_scientific_name, 'alias'::text, 50)
) as term_seed(locale, term, term_type, priority)
where btrim(term_seed.term) <> ''
on conflict do nothing;

insert into public.plant_search_terms (
  species_id,
  locale,
  term,
  normalized_term,
  term_type,
  priority
)
select
  species.id,
  'la',
  synonym.term,
  synonym.term,
  'synonym',
  115
from initial_catalog_species_seed seed
join public.plant_species species
  on species.scientific_name = seed.scientific_name
cross join lateral unnest(seed.synonyms) as synonym(term)
where btrim(synonym.term) <> ''
on conflict do nothing;

create temporary table initial_catalog_alias_seed (
  species_scientific_name text not null,
  locale text not null,
  term text not null,
  term_type text not null default 'alias',
  priority integer not null default 80,
  primary key (
    species_scientific_name,
    locale,
    term,
    term_type
  )
) on commit drop;

insert into initial_catalog_alias_seed (
  species_scientific_name,
  locale,
  term,
  term_type,
  priority
)
values
  ('Zamioculcas zamiifolia', 'en', 'Zanzibar gem', 'alias', 80),
  ('Spathiphyllum wallisii', 'ko', '피스릴리', 'alias', 80),
  ('Philodendron hederaceum', 'ko', '필로덴드론', 'alias', 85),
  ('Philodendron hederaceum', 'en', 'Philodendron', 'alias', 85),
  ('Philodendron erubescens', 'en', 'Red emerald philodendron', 'common_name', 85),
  ('Syngonium podophyllum', 'ko', '화살촉 식물', 'alias', 75),
  ('Scindapsus pictus', 'en', 'Silver vine', 'alias', 75),
  ('Dracaena fragrans', 'en', 'Mass cane', 'alias', 75),
  ('Dracaena reflexa var. angustifolia', 'en', 'Dragon tree', 'alias', 75),
  ('Heptapleurum arboricola', 'en', 'Umbrella plant', 'alias', 80),
  ('Chamaedorea elegans', 'en', 'Neanthe bella palm', 'alias', 70),
  ('Chrysalidocarpus lutescens', 'en', 'Golden cane palm', 'alias', 80),
  ('Beaucarnea recurvata', 'en', 'Elephant foot tree', 'alias', 70),
  ('Chlorophytum comosum', 'en', 'Airplane plant', 'alias', 70),
  ('Maranta leuconeura', 'ko', '기도 식물', 'alias', 70),
  ('Alocasia reginula', 'en', 'Black velvet', 'alias', 80),
  ('Pilea peperomioides', 'en', 'Pancake plant', 'alias', 75),
  ('Pilea peperomioides', 'en', 'UFO plant', 'alias', 75),
  ('Aloe vera', 'ko', '알로에 베라', 'alias', 90),
  ('Crassula ovata', 'en', 'Money plant', 'alias', 75),
  ('Kalanchoe blossfeldiana', 'en', 'Christmas kalanchoe', 'alias', 70),
  ('Curio rowleyanus', 'ko', '진주목걸이', 'alias', 75),
  ('Gymnocalycium mihanovichii', 'en', 'Chin cactus', 'alias', 65),
  ('Ocimum basilicum', 'ko', '스위트 바질', 'alias', 85),
  ('Ocimum basilicum', 'en', 'Sweet basil', 'common_name', 90),
  ('Salvia rosmarinus', 'ko', '로즈메리', 'alias', 80),
  ('Mentha spicata', 'ko', '민트', 'alias', 70),
  ('Thymus vulgaris', 'en', 'Common thyme', 'common_name', 80),
  ('Petroselinum crispum', 'en', 'Garden parsley', 'alias', 75),
  ('Coriandrum sativum', 'en', 'Cilantro', 'alias', 85),
  ('Phalaenopsis amabilis', 'en', 'Moth orchid', 'alias', 85),
  ('Dendrobium nobile', 'ko', '덴드로비움', 'alias', 75),
  ('Streptocarpus ionanthus', 'en', 'Saintpaulia', 'alias', 85),
  ('Hibiscus rosa-sinensis', 'en', 'Tropical hibiscus', 'alias', 80),
  ('Hydrangea macrophylla', 'en', 'Mophead hydrangea', 'alias', 75),
  ('Pelargonium zonale', 'en', 'Garden geranium', 'alias', 75),
  ('Ceropegia woodii', 'ko', '하트줄기', 'alias', 60),
  ('Monstera adansonii', 'en', 'Monkey mask', 'alias', 80),
  ('Rhaphidophora tetrasperma', 'en', 'Mini split-leaf', 'alias', 70),
  ('Aeschynanthus radicans', 'en', 'Basket vine', 'alias', 65);

insert into public.plant_search_terms (
  species_id,
  locale,
  term,
  normalized_term,
  term_type,
  priority
)
select
  species.id,
  alias.locale,
  alias.term,
  alias.term,
  alias.term_type,
  alias.priority
from initial_catalog_alias_seed alias
join public.plant_species species
  on species.scientific_name = alias.species_scientific_name
on conflict do nothing;

-- Limited, high-confidence cultivar additions only.
create temporary table initial_catalog_cultivar_seed (
  species_scientific_name text not null,
  cultivar_name text not null,
  display_name_ko text,
  display_name_en text,
  display_name_de text,
  popularity_rank integer,
  primary key (species_scientific_name, cultivar_name)
) on commit drop;

insert into initial_catalog_cultivar_seed (
  species_scientific_name,
  cultivar_name,
  display_name_ko,
  display_name_en,
  display_name_de,
  popularity_rank
)
values
  ('Philodendron hederaceum', 'Brasil', '브라질', 'Brasil', 'Brasil', 82),
  ('Philodendron hederaceum', 'Lemon Lime', '레몬 라임', 'Lemon Lime', 'Lemon Lime', 78),
  ('Philodendron hederaceum', 'Micans', '미칸스', 'Micans', 'Micans', 80),
  ('Philodendron erubescens', 'Pink Princess', '핑크 프린세스', 'Pink Princess', 'Pink Princess', 88),
  ('Syngonium podophyllum', 'White Butterfly', '화이트 버터플라이', 'White Butterfly', 'White Butterfly', 74),
  ('Syngonium podophyllum', 'Neon Robusta', '네온 로부스타', 'Neon Robusta', 'Neon Robusta', 76),
  ('Syngonium podophyllum', 'Mojito', '모히토', 'Mojito', 'Mojito', 73),
  ('Stromanthe thalia', 'Triostar', '트리오스타', 'Triostar', 'Triostar', 84);

insert into public.plant_cultivars (
  species_id,
  cultivar_name,
  display_name_ko,
  display_name_en,
  display_name_de,
  popularity_rank,
  review_status,
  is_active,
  care_override
)
select
  species.id,
  seed.cultivar_name,
  seed.display_name_ko,
  seed.display_name_en,
  seed.display_name_de,
  seed.popularity_rank,
  'published',
  true,
  null
from initial_catalog_cultivar_seed seed
join public.plant_species species
  on species.scientific_name = seed.species_scientific_name
on conflict (species_id, cultivar_name) do nothing;

insert into public.plant_search_terms (
  cultivar_id,
  locale,
  term,
  normalized_term,
  term_type,
  priority
)
select
  cultivar.id,
  term_seed.locale,
  term_seed.term,
  term_seed.term,
  'cultivar_name',
  term_seed.priority
from initial_catalog_cultivar_seed seed
join public.plant_species species
  on species.scientific_name = seed.species_scientific_name
join public.plant_cultivars cultivar
  on cultivar.species_id = species.id
 and cultivar.cultivar_name = seed.cultivar_name
cross join lateral (
  values
    ('en'::text, seed.cultivar_name, 100),
    ('ko'::text, seed.display_name_ko, 110),
    ('en'::text, seed.display_name_en, 110),
    ('de'::text, seed.display_name_de, 100)
) as term_seed(locale, term, priority)
where btrim(coalesce(term_seed.term, '')) <> ''
on conflict do nothing;

commit;

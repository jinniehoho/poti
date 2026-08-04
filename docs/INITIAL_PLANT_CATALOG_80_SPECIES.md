# Poti 초기 식물 카탈로그 80종 데이터 품질 보고서

작성일: 2026-07-28  
대상: Supabase 프로젝트 `syuervgombjogywbfkdf`

## 1. 작업 결과

기존 계층형 구조와 사용자 데이터를 유지한 채 초기 카탈로그를 4종에서 정확히 80종으로 확장했다. 새 마이그레이션은 데이터만 추가하며, 기존 행을 수정하거나 삭제하지 않는다. 모든 삽입은 기존 자연키를 조회하고 `ON CONFLICT DO NOTHING`을 사용하므로 같은 SQL을 다시 실행해도 중복 행이 생기지 않는다.

| 항목 | 적용 전 | 적용 후 | 신규 |
|---|---:|---:|---:|
| Family | 3 | 25 | 22 |
| Genus | 4 | 67 | 63 |
| Species | 4 | 80 | 76 |
| Cultivar | 13 | 21 | 8 |
| 검색어 | 39 | 496 | 457 |
| 기존 `plant_types` | 3 | 3 | 0 |
| 사용자 식물 | 7 | 7 | 0 |

공개·활성 Species는 80종이다. 새로 추가한 76종은 한·영·독 대표명과 설명을 모두 갖는다.

## 2. 최종 Species 목록

Family별 최종 Species 수와 목록은 다음과 같다.

- **Apiaceae (2):** Coriandrum sativum, Petroselinum crispum
- **Apocynaceae (3):** Ceropegia woodii, Dischidia nummularia, Hoya carnosa
- **Araceae (19):** Aglaonema commutatum, Alocasia reginula, Alocasia zebrina, Anthurium andraeanum, Anthurium clarinervium, Colocasia esculenta, Dieffenbachia seguine, Epipremnum aureum, Monstera adansonii, Monstera deliciosa, Philodendron erubescens, Philodendron gloriosum, Philodendron hederaceum, Philodendron melanochrysum, Rhaphidophora tetrasperma, Scindapsus pictus, Spathiphyllum wallisii, Syngonium podophyllum, Zamioculcas zamiifolia
- **Araliaceae (1):** Heptapleurum arboricola
- **Arecaceae (2):** Chamaedorea elegans, Chrysalidocarpus lutescens
- **Asparagaceae (7):** Aspidistra elatior, Beaucarnea recurvata, Chlorophytum comosum, Dracaena fragrans, Dracaena reflexa var. angustifolia, Dracaena trifasciata, Yucca gigantea
- **Asphodelaceae (3):** Aloe vera, Haworthia cooperi, Haworthiopsis attenuata
- **Asteraceae (2):** Curio rowleyanus, Gerbera jamesonii
- **Begoniaceae (1):** Begonia rex
- **Cactaceae (5):** Gymnocalycium mihanovichii, Mammillaria elongata, Opuntia microdasys, Rhipsalis baccifera, Schlumbergera truncata
- **Commelinaceae (1):** Tradescantia zebrina
- **Crassulaceae (4):** Crassula ovata, Echeveria elegans, Kalanchoe blossfeldiana, Sedum rubrotinctum
- **Euphorbiaceae (1):** Codiaeum variegatum
- **Geraniaceae (1):** Pelargonium zonale
- **Gesneriaceae (2):** Aeschynanthus radicans, Streptocarpus ionanthus
- **Hydrangeaceae (1):** Hydrangea macrophylla
- **Lamiaceae (6):** Mentha spicata, Mentha suaveolens, Ocimum basilicum, Origanum vulgare, Salvia rosmarinus, Thymus vulgaris
- **Malvaceae (2):** Hibiscus rosa-sinensis, Pachira aquatica
- **Marantaceae (5):** Ctenanthe burle-marxii, Goeppertia makoyana, Goeppertia orbifolia, Maranta leuconeura, Stromanthe thalia
- **Moraceae (2):** Ficus elastica, Ficus lyrata
- **Orchidaceae (5):** Cymbidium goeringii, Dendrobium nobile, Paphiopedilum insigne, Phalaenopsis amabilis, Phalaenopsis aphrodite
- **Piperaceae (2):** Peperomia caperata, Peperomia obtusifolia
- **Primulaceae (1):** Cyclamen persicum
- **Rubiaceae (1):** Gardenia jasminoides
- **Urticaceae (1):** Pilea peperomioides

## 3. 새 Family와 Genus

기존 Family `Araceae`, `Asparagaceae`, `Moraceae`를 재사용했다. 새 Family는 다음 22개다.

`Apiaceae`, `Apocynaceae`, `Araliaceae`, `Arecaceae`, `Asphodelaceae`, `Asteraceae`, `Begoniaceae`, `Cactaceae`, `Commelinaceae`, `Crassulaceae`, `Euphorbiaceae`, `Geraniaceae`, `Gesneriaceae`, `Hydrangeaceae`, `Lamiaceae`, `Malvaceae`, `Marantaceae`, `Orchidaceae`, `Piperaceae`, `Primulaceae`, `Rubiaceae`, `Urticaceae`

기존 Genus `Monstera`, `Epipremnum`, `Dracaena`, `Ficus`를 재사용했다. 새 Genus는 다음 63개다.

`Coriandrum`, `Petroselinum`, `Ceropegia`, `Dischidia`, `Hoya`, `Aglaonema`, `Alocasia`, `Anthurium`, `Colocasia`, `Dieffenbachia`, `Philodendron`, `Rhaphidophora`, `Scindapsus`, `Spathiphyllum`, `Syngonium`, `Zamioculcas`, `Heptapleurum`, `Chamaedorea`, `Chrysalidocarpus`, `Aspidistra`, `Beaucarnea`, `Chlorophytum`, `Yucca`, `Aloe`, `Haworthia`, `Haworthiopsis`, `Curio`, `Gerbera`, `Begonia`, `Gymnocalycium`, `Mammillaria`, `Opuntia`, `Rhipsalis`, `Schlumbergera`, `Tradescantia`, `Crassula`, `Echeveria`, `Kalanchoe`, `Sedum`, `Codiaeum`, `Pelargonium`, `Aeschynanthus`, `Streptocarpus`, `Hydrangea`, `Mentha`, `Ocimum`, `Origanum`, `Salvia`, `Thymus`, `Hibiscus`, `Pachira`, `Ctenanthe`, `Goeppertia`, `Maranta`, `Stromanthe`, `Cymbidium`, `Dendrobium`, `Paphiopedilum`, `Phalaenopsis`, `Peperomia`, `Cyclamen`, `Gardenia`, `Pilea`

## 4. Species와 Cultivar 처리

기존 Species 4종은 UUID를 포함해 그대로 재사용했다.

- Monstera deliciosa
- Epipremnum aureum
- Dracaena trifasciata
- Ficus elastica

기존 Cultivar 13개도 수정 없이 재사용했다. 분류 근거가 비교적 명확하고 상속 동작 검증에 유용한 다음 8개만 추가했다.

| Species | 추가 Cultivar |
|---|---|
| Philodendron hederaceum | Brasil, Lemon Lime, Micans |
| Philodendron erubescens | Pink Princess |
| Syngonium podophyllum | White Butterfly, Neon Robusta, Mojito |
| Stromanthe thalia | Triostar |

새 Cultivar의 `care_override`는 모두 `null`이며 Species 관리정보를 정상 상속한다. `plant_catalog`에서 21개 Cultivar 모두 유효한 물주기 범위를 제공한다.

분류 귀속을 충분히 확정하기 어려운 상업명은 자동 입력하지 않았다.

- Philodendron: White Princess, White Knight
- Aglaonema: Silver Queen, Maria
- Dieffenbachia: Camille, Tropic Snow

## 5. 학명과 동의어

accepted name 정책에 맞춰 다음 이름을 대표 학명으로 저장하고, 익숙한 이전 학명은 synonym 및 검색어로 유지했다.

| 대표 학명 | synonym |
|---|---|
| Aloe vera | Aloe barbadensis |
| Chrysalidocarpus lutescens | Dypsis lutescens |
| Curio rowleyanus | Senecio rowleyanus |
| Dracaena reflexa var. angustifolia | Dracaena marginata |
| Dracaena trifasciata | Sansevieria trifasciata |
| Goeppertia makoyana | Calathea makoyana |
| Goeppertia orbifolia | Calathea orbifolia |
| Haworthiopsis attenuata | Haworthia attenuata |
| Heptapleurum arboricola | Schefflera arboricola |
| Philodendron hederaceum | Philodendron scandens |
| Salvia rosmarinus | Rosmarinus officinalis |
| Streptocarpus ionanthus | Saintpaulia ionantha |
| Stromanthe thalia | Stromanthe sanguinea |
| Yucca gigantea | Yucca elephantipes |

요청 목록의 `Alocasia amazonica`는 유효한 Species가 아닌 교잡명과 연결되므로 자동 입력하지 않고 유효한 Species `Alocasia reginula`로 대체했다. `Mentha × piperita`는 교잡종 표기가 현재 Species 제약조건과 맞지 않아 추측성 제약 변경 대신 유효한 Species `Mentha suaveolens`를 넣었다. 두 제외 이름은 별칭으로 잘못 연결하지 않았다.

## 6. 관리정보 작성 기준

- 일반 가정의 실내 화분 환경을 기준으로 빛, 물주기 점검 범위, 습도, 온도, 난이도를 입력했다.
- 모든 새 설명은 “고정 날짜보다 흙·뿌리·배지 상태를 먼저 확인”하는 원칙을 한·영·독으로 안내한다.
- `watering_min_days`와 `watering_max_days`는 확정 주기가 아니라 초기 점검 범위다.
- 반려동물 독성과 사람 독성을 별도 boolean으로 저장했다.
- 근거가 충분하지 않은 독성은 `review_required`와 `null` boolean으로 남겼다.
- 선인장 가시와 glochid는 독성으로 오인하지 않고 물리적 위험 코드로만 기록했다.
- 관리 범위 역전, 습도 0~100 이탈, 2일 미만 또는 45일 초과 물주기 범위는 없다.

## 7. 검색어 작성 기준과 결과

기존 normalization/중복 방지 트리거를 사용해 학명, accepted name, synonym, 한·영·독 대표명과 별칭, 속명을 검색어로 생성했다. 총 검색어는 39개에서 496개로 늘었다.

요구된 검색어와 대표 이전 학명을 포함한 23개 묶음 시험은 23개 모두 통과했다. 별도 공개 Data API 시험에서도 독일어 `Basilikum` 검색이 1건을 반환했고, `plant_catalog`에서 `Ocimum basilicum`을 조회할 수 있었다.

검증한 예:

- 몬스테라 / Monstera / Monstera deliciosa
- 스킨답서스 / 포토스 / Pothos / Efeutute / Epipremnum aureum
- 산세베리아 / Snake plant / Bogenhanf / Sansevieria trifasciata / Dracaena trifasciata
- 고무나무 / Rubber plant / Gummibaum / Ficus elastica
- 필로덴드론 / Philodendron / Philodendron hederaceum
- 알로에 / Aloe vera
- 바질 / Basil / Basilikum / Ocimum basilicum
- 로즈마리 / Rosemary / Rosmarin / Salvia rosmarinus
- Schefflera arboricola / Dypsis lutescens / Dracaena marginata / Stromanthe sanguinea

## 8. 검증 및 회귀 결과

| 검사 | 결과 |
|---|---|
| 롤백 dry-run | 통과; 시험 후 4 Species/13 Cultivar/39 검색어로 복귀 확인 |
| Species 학명 중복 | 0 |
| Genus 학명 중복 | 0 |
| Species 내 Cultivar 중복 | 0 |
| entity/locale별 normalized 검색어 중복 | 0 |
| accepted name과 다른 Species synonym 충돌 | 0 |
| 고아 Species | 0 |
| 관리 범위 오류 | 0 |
| 독성 코드/boolean 충돌 | 0 |
| `plant_catalog` 결과 | Species 80, Cultivar 21 |
| Cultivar 관리정보 상속 | 신규 8개 모두 통과 |
| 기존 `plant_types` | 3개 및 숫자 ID 1, 2, 3 유지 |
| 사용자 식물 | 7개 유지 |
| 기존 사용자 식물의 깨진 외래키 | 0 |
| 공개 Data API | 기존 `plant_types`, 검색 RPC, `plant_catalog` 조회 통과 |
| TypeScript | `npx tsc --noEmit` 통과 |
| Expo 의존성 | `expo install --check` 통과, 최신 호환 상태 |

기존 4 Species의 한·영·독 대표명은 존재하지만 설명 3개 언어가 비어 있다. 이번 76종 seed의 누락은 0건이다. 기존 행을 수정하지 않는 원칙 때문에 이번 작업에서는 보완하지 않았으며, 다음 번 별도 데이터 보정 마이그레이션에서 검토한다.

Supabase Advisor의 신규 오류는 없다. 기존 익명 로그인 정책 관련 경고와 아직 사용량이 쌓이지 않은 인덱스의 `unused_index` 정보가 남아 있다. 공개 카탈로그 읽기와 사용자 본인 행 RLS라는 현재 설계상 예상되는 항목이며, 이번 데이터 seed에서는 정책이나 인덱스를 변경하지 않았다.

## 9. 후속 검수 권장 항목

- 기존 4 Species의 한·영·독 설명 보완
- `review_required` 독성 항목의 수의학·독성학 자료 기반 검수
- 지역·계절·배지별 물주기 추천값의 원예 전문가 검수
- 한·영·독 상점명과 일반명의 현지 사용자 검수
- 제외한 상업 Cultivar의 정확한 Species 귀속 확인

이번 단계에서는 등록 UI, 이미지 생성·연결, Build 8 생성, APK/IPA 생성, TestFlight 제출을 수행하지 않았다.

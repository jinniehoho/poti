# Poti 식물 데이터베이스·한영독 데이터 인수인계

> 기준 시점: 2026-08-03 (Europe/Berlin)  
> 기준 저장소: `C:\Users\dunun\Documents\Codex\2026-07-28\s\work\Poti-Work`  
> 우선순위: 연결된 Supabase 실데이터/실스키마 → 현재 앱 코드 → 로컬 마이그레이션·검증 SQL → 과거 문서  
> 보안: 비밀번호, API 키, Supabase 키 값은 이 문서에 포함하지 않는다.

## 1. 기술 환경

| 항목 | 확인된 현재 상태 |
|---|---|
| 앱 이름 | Poti. `package.json` 패키지명은 `plant-app` |
| 활성 프로젝트 경로 | `C:\Users\dunun\Documents\Codex\2026-07-28\s\work\Poti-Work` |
| 보존 원본 | `C:\dev\plant-app`. 명시적 요청 없이는 수정 금지 |
| 앱 기술 스택 | Expo SDK `~57.0.8`, Expo Router `~57.0.8`, React Native `0.86.0`, React `19.2.3`, TypeScript `~6.0.3`, `@supabase/supabase-js ^2.110.8` |
| Supabase 프로젝트 | 이름 `poti-dev`, project ref `syuervgombjogywbfkdf`, region `eu-north-1`, 현재 상태 `ACTIVE_HEALTHY` |
| 인증 | 세션이 없으면 `supabase.auth.signInAnonymously()`로 익명 사용자 생성. iOS에서는 Apple ID token으로 익명 identity 연결 또는 기존 계정 로그인. 익명 사용자도 DB에서는 `authenticated` role을 사용하며 `auth.uid()`가 사용자 데이터 소유권 기준 |
| 환경변수 | `.env`에 `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` 두 이름이 확인됨. 실제 값은 출력·문서화·커밋 금지. 프런트 앱에는 `service_role`을 넣지 않음 |
| Supabase 클라이언트 | `src/lib/supabase.ts`: 네이티브 세션은 AsyncStorage에 유지하고 token 자동 갱신. 웹은 Supabase 기본 저장 방식 사용 |
| DB 접근 | 이번 확인에는 연결된 Supabase MCP의 읽기 전용 SQL과 메타데이터 조회를 사용. Supabase Dashboard의 Auth 설정 사용 이력은 확인되지만 Dashboard SQL Editor를 실제 DB 입력 도구로 사용했는지는 `확인 필요`. DBeaver 연결 정보·사용 흔적은 저장소에서 확인되지 않아 `확인 필요`. 로컬 `supabase/config.toml`과 CLI link 정보도 없음 |
| 마이그레이션 방식 | `supabase/migrations/*.sql`에 추가형 마이그레이션을 보관. 원격 DB 적용 이력이 존재함. 단, 원격의 2026-07-29 관리자/품질 뷰 마이그레이션 2개는 로컬 파일이 없어 드리프트 해소 필요(§8, §9 참조) |

### DB 데이터 변경과 앱 재빌드

- **재빌드 불필요:** 기존 컬럼과 RPC 계약을 유지하면서 Family/Genus/Species/Cultivar, 한·영·독 이름·설명, 검색어, 관리값, `review_status`, `is_active`, RLS 정책 또는 SQL 함수 내부 구현만 변경하는 경우. 앱은 실행 시 `plant_catalog`/`search_plant_catalog()`를 조회한다.
- **재빌드 필요:** 앱 코드·타입 변경, 테이블/뷰/RPC의 컬럼명이나 반환 구조 변경, 환경변수 변경, 하드코딩된 추천 목록 변경, `plantEmojiMap.ts`의 아이콘 매핑 변경.
- **주의:** 신규 Species를 검색에 노출하려면 데이터만 넣는 것으로 끝나지 않는다. 활성·published 상위 계층, 검색어, RLS/GRANT가 모두 맞아야 한다. 이 조건이 맞으면 앱 재빌드 없이 검색에 나타난다.

### 데이터베이스 관련 주요 경로

- 클라이언트: `src/lib/supabase.ts`
- 카탈로그 조회/검색: `src/services/plantCatalogService.ts`
- 사용자 식물 저장/조회: `src/services/plantService.ts`
- 레거시 3종 조회: `src/services/plantTypeService.ts`
- 타입: `src/types/plantCatalog.ts`, `src/types/plant.ts`
- 마이그레이션: `supabase/migrations/`
- 검증 SQL: `supabase/verify_hierarchical_plant_catalog.sql`, `supabase/verify_initial_plant_catalog_80_species.sql`, `supabase/verify_catalog_translations_and_registration.sql`
- 과거 스키마 초안: `supabase/schema.sql` (현재 실스키마가 더 최신이므로 그대로 재적용 금지)
- placeholder seed: `supabase/seed.sql` (실행 가능한 seed가 아님)

## 2. 현재 데이터베이스 구조

### 2.1 테이블

아래 `필수`는 `NOT NULL`, `선택`은 nullable을 뜻한다. 모든 public 테이블은 현재 RLS가 활성화되어 있다.

| 테이블 | 목적 | 주요 컬럼과 타입·nullable | PK / FK / UNIQUE | RLS 및 실제 권한 |
|---|---|---|---|---|
| `plant_families` | 식물 과(Family) 마스터 | 필수: `id uuid`, `scientific_name text`, `review_status text`, `is_active boolean`, `created_at/updated_at timestamptz`; 선택: `name_ko/en/de text`, `description text` | PK `id`; UNIQUE `scientific_name` | anon/authenticated는 `is_active=true AND review_status='published'`만 SELECT. 쓰기 정책 없음. 관리자는 DB owner/service role로 작성 |
| `plant_genera` | 속(Genus) 마스터 | 필수: `id uuid`, `family_id uuid`, `scientific_name text`, 상태/활성/timestamps; 선택: `name_ko/en/de`, `description` | PK `id`; FK `family_id → plant_families.id ON DELETE RESTRICT`; UNIQUE `scientific_name` | 공개·활성 Family에 속한 공개·활성 행만 anon/authenticated SELECT. 쓰기 정책 없음 |
| `plant_species` | Species 마스터, 다국어 이름·설명 및 기본 관리값의 기준 | 필수: `id uuid`, `genus_id uuid`, `scientific_name text`, `specific_epithet text`, `synonyms text[]`, 상태/활성/timestamps; 선택: `accepted_scientific_name`, `taxonomic_status`, `default_name_ko/en/de`, `description_ko/en/de`, `light_level`, `light_min/max int`, `watering_min/max_days int`, `humidity_min/max int`, `temperature_min/max_c numeric`, `difficulty`, `toxicity`, `pet_toxic/human_toxic boolean`, `image_key`, `popularity_rank int` | PK `id`; FK `genus_id → plant_genera.id RESTRICT`; UNIQUE `scientific_name`; 범위·학명 형식 CHECK | 공개·활성 Family/Genus에 속한 공개·활성 Species만 anon/authenticated SELECT. 쓰기 정책 없음 |
| `plant_cultivars` | Species 아래 재배품종(Cultivar), 선택적 관리값 override | 필수: `id uuid`, `species_id uuid`, `cultivar_name text`, 상태/활성/timestamps; 선택: `display_name_ko/en/de`, `description_ko/en/de`, `image_key`, `popularity_rank`, `care_override jsonb` | PK `id`; FK `species_id → plant_species.id RESTRICT`; UNIQUE `(species_id, cultivar_name)`; `care_override` 검증 CHECK | 부모 Species까지 공개·활성인 공개·활성 Cultivar만 anon/authenticated SELECT. 쓰기 정책 없음 |
| `plant_search_terms` | 검색용 학명·대표명·일반명·별칭·동의어·Cultivar명 | 필수: `id uuid`, `locale text`, `term text`, `normalized_term text`, `term_type text`, `priority int`, `created_at`; 선택: `species_id uuid`, `cultivar_id uuid` 중 정확히 하나 | PK `id`; FK 각각 Species/Cultivar RESTRICT; 부분 UNIQUE는 `(대상 ID, locale, normalized_term, term_type)` | 대상 마스터가 공개·활성일 때만 anon/authenticated SELECT. 쓰기 정책 없음 |
| `plant_types` | 기존 앱 호환용 레거시 3종 | 필수: `id bigint identity`, `scientific_name varchar`, `default_interval_days int`, `emoji varchar`, `created_at`; 선택: `difficulty`, `light_requirement`, `pet_safe`, `default_image_url`, `species_id uuid`, `cultivar_id uuid` | PK `id`; UNIQUE `scientific_name`; FK `species_id`, `cultivar_id`; 둘을 동시에 채우지 못하는 CHECK | RLS에 public SELECT 정책만 있음. 테이블 GRANT가 넓게 남아 있어도 anon/authenticated 쓰기는 RLS 정책 부재로 차단. 관리자만 실질 쓰기 |
| `plant_type_translations` | 레거시 `plant_types` 3종의 언어별 이름·설명·care tips | 필수: `id bigint identity`, `plant_type_id`, `language_code`, `name`, `translation_status`, `translation_source`, `created_at`; 선택: `description`, `care_tips` | PK `id`; FK `plant_type_id → plant_types.id CASCADE`, `language_code → supported_languages.code`; UNIQUE `(plant_type_id, language_code)` | public SELECT 정책. anon/authenticated 쓰기는 RLS 정책 부재로 차단 |
| `supported_languages` | 지원 언어 레지스트리 | 필수: `code varchar PK`, `english_name`, `native_name`, `is_active`, `created_at` | PK `code` | anon/authenticated SELECT. 쓰기 정책 없음 |
| `plants` | 사용자별 등록 식물. 개인 별명과 마스터 참조를 분리 | 필수: `id bigint identity`, `display_name varchar`, `watering_mode varchar`, `created_at`, `is_active`; 선택: `user_id uuid`, `plant_type_id bigint`, `plant_species_id uuid`, `plant_cultivar_id uuid`, `custom_interval_days int` | PK `id`; FK `user_id → auth.users.id CASCADE NOT VALID`, `plant_type_id/species_id/cultivar_id`는 각 마스터로 RESTRICT; `plant_type_id` 또는 `plant_species_id` 중 하나는 필수 CHECK | authenticated가 `auth.uid()=user_id`인 자기 행만 SELECT/INSERT/UPDATE/DELETE. 익명 로그인 사용자도 authenticated role이므로 동일. 관리자/service role은 전체 접근 |
| `watering_history` | 사용자 식물별 물주기 이력 | 필수: `id bigint identity`, `plant_id bigint`, `watered_at timestamptz`, `created_at`; 선택: `note text` | PK `id`; FK `plant_id → plants.id ON DELETE CASCADE` | 부모 `plants.user_id=auth.uid()`인 경우만 authenticated CRUD. anon role 직접 접근 없음 |

#### 스키마상 확인된 주의점

- `plants.user_id`는 nullable이고 FK가 `NOT VALID` 상태다. 앱은 insert 시 `auth.uid()` 기본값/명시값을 사용하지만, 관리자 SQL 입력 시 null 소유자 행을 만들지 않도록 주의한다.
- `plants`에는 `plant_cultivar_id`가 실제 `plant_species_id`의 자식인지 강제하는 복합 FK/CHECK가 없다. 앱은 동일 `PlantCatalogItem`에서 두 ID를 함께 저장하고 검증 SQL이 불일치를 점검하지만 DB 자체의 완전한 강제는 아직 없다.
- `plant_types`, `plant_type_translations`, `supported_languages`는 넓은 객체 GRANT가 남아 있으나 쓰기 RLS 정책은 없다. 앱 클라이언트에 마스터 쓰기 권한을 추가하지 않는다.

### 2.2 뷰

모든 확인된 뷰는 `security_invoker=true`다.

| 뷰 | 목적·핵심 반환 | 접근 |
|---|---|---|
| `plant_catalog` | 공개·활성 Species/Cultivar를 하나의 결과로 합침. `catalog_id`는 `species:<uuid>` 또는 `cultivar:<uuid>`. Family/Genus/Species/Cultivar ID·명칭, locale별 표시명, 상속 적용 관리값(`effective_*`), 이미지/인기도 반환 | anon/authenticated SELECT 가능. 기반 테이블 RLS 적용. 앱의 핵심 카탈로그 소스 |
| `plant_type_catalog_compatibility` | 레거시 `plant_types` 숫자 ID와 새 taxonomy/`plant_catalog` 매핑 확인 | anon/authenticated 조회 가능 |
| `v_plant_watering_status` | 사용자 식물과 마지막 물주기, 계산 주기, 다음 물주기, locale별 카탈로그 이름을 결합 | authenticated만 조회. 기반 `plants`/`watering_history` RLS 적용 |
| `plant_catalog_admin` | Species별 계층, 다국어 이름, 관리값, Cultivar/검색어 수, 번역 완성 여부를 한 행으로 제공 | service role 전용 |
| `plant_translation_status` | Species의 KO/EN/DE 이름·설명 누락 행과 누락 개수 | service role 전용 |
| `plant_quality_dashboard` | 이미지·설명·관리값·검색어 누락과 품질 이슈 개수 | service role 전용 |

원격 Supabase에는 마지막 세 관리자/품질 뷰가 존재하지만 해당 2026-07-29 마이그레이션 파일은 현재 로컬 `supabase/migrations`에 없다. 새 작업 전 원격 스키마를 로컬 마이그레이션으로 동기화해야 한다.

### 2.3 인덱스

| 테이블 | 확인된 인덱스 |
|---|---|
| `plant_families` | `plant_families_pkey(id)`, UNIQUE `plant_families_scientific_name_key(scientific_name)` |
| `plant_genera` | PK, UNIQUE scientific name, `idx_plant_genera_family_id(family_id)` |
| `plant_species` | PK, UNIQUE scientific name, `idx_plant_species_genus_id(genus_id)`, 부분 인덱스 `idx_plant_species_published_popularity(popularity_rank DESC)` for published+active |
| `plant_cultivars` | PK, UNIQUE `(species_id,cultivar_name)`, `idx_plant_cultivars_species_id`, published+active popularity 부분 인덱스 |
| `plant_search_terms` | PK, 부분 btree `species_id`/`cultivar_id`, 부분 UNIQUE `uq_plant_search_terms_species`/`uq_plant_search_terms_cultivar`, GIN trigram `idx_plant_search_terms_normalized_trgm(normalized_term gin_trgm_ops)` |
| `plant_types` | PK, UNIQUE scientific name, 부분 인덱스 `species_id`, `cultivar_id` |
| `plant_type_translations` | PK, UNIQUE `(plant_type_id,language_code)`, `idx_plant_type_translations_language_code` |
| `supported_languages` | PK `(code)` |
| `plants` | PK, `idx_plants_user_active(user_id,is_active)`, `idx_plants_plant_type_id`, 부분 인덱스 `plant_species_id`, `plant_cultivar_id` |
| `watering_history` | PK, `idx_watering_history_plant_watered_at(plant_id, watered_at DESC)` |

## 3. 현재 데이터 현황

### 3.1 2026-08-03 실DB 수량

| 항목 | 전체 | 공개·활성 또는 세부 상태 |
|---|---:|---|
| `plant_families` | 25 | 25 published+active |
| `plant_genera` | 67 | 67 published+active |
| `plant_species` | 80 | 80 published+active |
| `plant_cultivars` | 21 | 21 published+active |
| `plant_catalog` | 101 | Species 80 + Cultivar 21 |
| `plant_search_terms` | 496 | 아래 언어/유형 분포 참조 |
| `plant_types` | 3 | 레거시 호환용, 숫자 ID 1·2·3 유지 |
| `plant_type_translations` | 9 | 레거시 3종 × KO/EN/DE |
| `plants` | 37 | 활성 29, 비활성 8 |

사용자 식물 37개의 참조 형태는 서로 겹치지 않게 분류하면 다음과 같다.

- 레거시 `plant_type_id`만 사용: 21
- 새 `plant_species_id`만 사용: 11
- 레거시와 Species UUID를 함께 사용: 5
- Cultivar를 실제 사용자 식물에 저장한 행: 0
- 카탈로그 참조가 전혀 없거나 Cultivar만 있고 Species가 없는 잘못된 행: 0

**충돌 기록:** 2026-07-28 문서는 사용자 식물 7개라고 기록한다. 현재 실DB는 37개이므로 과거 검증 시점 수치이며 최신 현황으로 사용하면 안 된다.

### 3.2 다국어·검색 품질

- Species 80종: KO/EN/DE 대표명 누락 0, KO/EN/DE 설명 누락 0.
- Family 25개: KO/EN/DE 이름 누락 0.
- Genus 67개: `name_ko`, `name_en`, `name_de`가 모두 비어 있음. 앱 핵심 표시에는 현재 Genus 번역을 사용하지 않는다.
- Cultivar 21개: KO/EN/DE 표시명 누락 0. KO/EN/DE 설명은 21개 모두 비어 있음.
- Species 관리 핵심값(빛, 물주기 범위, 습도, 온도, 난이도, toxicity code)은 80종 모두 존재. `pet_toxic`은 69/80, `human_toxic`은 68/80만 확정값이며 나머지는 null.
- `image_key`가 있는 Species는 4/80. `plant_quality_dashboard`의 이슈 Species 76개는 현재 이미지 누락 76개와 일치한다. 검색어 3개 미만 Species는 0.
- 검색어 496개 분포:
  - KO: primary 80, alias 12, cultivar_name 15
  - EN: primary 76, common_name 8, alias 26, cultivar_name 21
  - DE: primary 76, common_name 4, cultivar_name 8
  - LA: scientific_name 80, synonym 14, alias(주로 Genus명) 76

### 3.3 레거시·샘플·중복

- `plant_types`는 삭제 대상이 아니라 기존 앱/사용자 행 호환을 위해 유지하는 레거시 테이블이다.
- 레거시 ID 1 `Monstera deliciosa`, ID 2 `Sansevieria trifasciata`, ID 3 `Epipremnum aureum`가 각각 새 Species에 연결되어 있다. ID 2의 연결 대상은 accepted name `Dracaena trifasciata`다.
- `plant_type_translations`도 레거시 UI fallback 때문에 유지한다.
- 앱 코드 `ensureStarterPlant()`는 새 사용자에게 활성 식물이 하나도 없을 때 `plant_type_id=1`인 시작 식물을 만들 수 있다. DB에는 `is_sample` 컬럼이 없어 현재 37개 중 어느 행이 자동 시작 식물인지 데이터만으로 확정할 수 없다.
- 대소문자·공백을 정규화한 Family/Genus/Species 학명 중복 그룹 0, Species 내 Cultivar 이름 중복 0, 검색어 unique 기준 중복 0.
- 고아 Genus/Species/Cultivar/검색어와 깨진 사용자 식물 FK 0.

## 4. 분류 및 다국어 구조

### 4.1 관계와 역할

```text
plant_families
  └─ plant_genera.family_id
      └─ plant_species.genus_id
          ├─ plant_cultivars.species_id
          └─ plant_search_terms.species_id
               또는 plant_search_terms.cultivar_id
```

- **Family:** 가장 상위 과. `scientific_name`이 자연키 역할을 한다.
- **Genus:** 한 Family에 속하는 속. 현재 스키마는 Genus 학명을 전체 테이블에서 unique로 강제한다.
- **Species:** 앱 카탈로그의 기본 식물 단위. accepted 학명, 동의어, 한·영·독 대표명/설명, 기본 관리값을 보유한다.
- **Cultivar:** 특정 Species 아래의 재배품종/상업 품종. 이름·이미지·인기도와 필요한 관리값만 override하고 나머지는 Species 값을 상속한다.

Species와 Cultivar 구분 기준은 **식물학적 Species인지, 특정 Species 안의 재배품종인지**다. 단순 상업명만으로 Cultivar를 자동 생성하지 않는다. 실제 Species 귀속이 불명확했던 White Princess/White Knight, Silver Queen/Maria, Camille/Tropic Snow 등은 seed에서 제외했다.

### 4.2 사용자 식물 저장

- Species 선택: `plants.plant_species_id=<Species UUID>`, `plant_cultivar_id=null`.
- Cultivar 선택: 부모 `plant_species_id`와 해당 `plant_cultivar_id`를 모두 저장.
- Cultivar가 없으면 `plant_cultivar_id`는 null.
- 레거시 3종 선택 시 `resolveLegacyPlantTypeId()`가 taxonomy ID에서 대응 `plant_types.id`를 찾을 수 있어 숫자 ID와 Species UUID를 함께 저장할 수 있다.
- 개인이 붙인 이름은 `plants.display_name`에만 저장하며 번역하지 않는다.

### 4.3 학명 변경·동의어·Sansevieria 사례

- `plant_species.scientific_name`은 현재 카탈로그의 대표/accepted identity로 사용한다.
- `accepted_scientific_name`과 `taxonomic_status`로 분류 상태를 보조 기록하고, 이전 학명은 `synonyms text[]`와 `plant_search_terms(term_type='synonym', locale='la')`에 유지한다.
- 예: 대표 학명 `Dracaena trifasciata`, synonym `Sansevieria trifasciata`.
- 레거시 `plant_types.id=2`의 `scientific_name='Sansevieria trifasciata'`는 기존 ID와 사용자 데이터 보호를 위해 바꾸지 않고, `species_id`만 `Dracaena trifasciata`로 연결한다.
- 동일 정책의 확인된 예: `Dypsis lutescens → Chrysalidocarpus lutescens`, `Calathea makoyana → Goeppertia makoyana`, `Rosmarinus officinalis → Salvia rosmarinus` 등은 구 학명을 검색 synonym으로 유지한다.
- 학명 정정 시 기존 Species UUID를 유지하고 대표 학명·accepted/synonym/search term을 마이그레이션으로 갱신하는 방식이 원칙이다. 새 UUID로 교체하지 않는다.

### 4.4 중복 방지

- Species: `scientific_name UNIQUE`.
- Cultivar: `(species_id, cultivar_name) UNIQUE`.
- 검색어: Species 또는 Cultivar 중 정확히 하나를 대상으로 하고, `(대상 ID, locale, normalized_term, term_type)` partial UNIQUE.
- 앱/UI의 동일 항목 판단은 표시 이름이 아니라 `cultivar_id`가 있으면 cultivar ID, 없으면 `species_id`를 사용한다.
- 이름만 같다고 같은 Species/Cultivar로 간주하면 안 된다. accepted name, 부모 Species, 기존 UUID, synonym을 함께 확인한다.

### 4.5 한·영·독 저장과 fallback

- Species: `default_name_ko/en/de`, `description_ko/en/de`.
- Cultivar: `display_name_ko/en/de`, `description_ko/en/de`.
- Family/Genus: `name_ko/en/de`가 있으나 Genus는 현재 모두 null.
- 레거시: `plant_type_translations`에 KO/EN/DE 행을 별도로 저장.
- 학명은 locale 번역과 분리해 `scientific_name`으로 저장.
- 대표 일반명은 Species/Cultivar의 locale별 name 컬럼, 추가 일반명·별칭·구 명칭은 `plant_search_terms.term_type`으로 구분한다.

`plant_catalog` 및 앱의 현재 fallback:

- KO Species: KO → EN → 학명.
- DE Species: DE → EN → 학명.
- EN Species: EN → 학명.
- Cultivar: 해당 언어 Cultivar 표시명 → EN Cultivar명/원본 `cultivar_name` → 해당 언어 Species명 → EN Species명 → 학명 순서로 보완(세부 순서는 locale별 view 정의 참조).
- 앱 `getLocalizedDisplayName()`도 KO/DE에서 EN, 마지막에 학명으로 fallback한다.
- 레거시 `getTranslationMap()`은 요청 언어가 없으면 EN을 사용한다. 반면 `getPlantTypes()` 자체는 요청 언어 translation을 inner join하므로 해당 locale 행이 없으면 그 레거시 항목이 조회되지 않을 수 있다.

### 4.6 미구현·결정 필요

- French는 `supported_languages`에 `fr`, `is_active=false`로 예약만 되어 있다. 현재 Species/Cultivar에는 `_fr` 컬럼이 없고 검색 locale CHECK/RPC도 `fr`을 받지 않는다.
- 자동 번역 Edge Function/배치, 번역 검수 UI, 출처/검수자/검수일 필드는 구현되지 않았다.
- `docs/PLANT_CATALOG_STRATEGY.md`는 카탈로그 번역을 `plant_type_translations`에 저장한다고 적지만, 최신 계층형 카탈로그는 Species/Cultivar의 locale별 컬럼을 사용한다. 이는 **과거 설계 문서와 현재 구현의 충돌**이며 현재 실스키마를 우선한다.
- Cultivar 설명, Genus 번역, 지역별 일반명 규칙, 학명 출처·버전 관리 모델은 결정/구현이 필요하다.

## 5. 식물 관리 데이터

| 필드 | 의미 | 저장 위치 | 형식 | 상태 |
|---|---|---|---|---|
| `watering_min_days`, `watering_max_days` | 고정 주기가 아니라 초기 물주기 점검 범위 | `plant_species`; Cultivar는 `care_override` 가능 | 양의 integer, min≤max | DB 구현, 80/80 값 있음 |
| `default_interval_days` | 레거시 3종 자동 물주기 기본 일수 | `plant_types` | 양의 integer | DB 구현, 레거시 사용 중 |
| `watering_mode` | 사용자별 automatic/custom | `plants` | varchar enum 성격 | DB 구현, 코드 사용 중 |
| `custom_interval_days` | custom 선택 시 사용자 지정 간격 | `plants` | nullable integer | DB 구현, 코드 사용 중. DB 범위 CHECK는 확인되지 않음 |
| `watered_at`, `note` | 실제 물주기 시각과 선택 메모 | `watering_history` | timestamptz, nullable text | DB 구현, 코드 사용 중 |
| `light_level` | 밝기 범주 코드 | `plant_species`, Cultivar override 가능 | nullable text | DB 구현, 80/80 |
| `light_min`, `light_max` | 빛 상대 범위 | `plant_species`, override 가능 | nullable int 0..100, min≤max | DB 구현, 80/80 |
| `humidity_min`, `humidity_max` | 권장 습도 범위 | `plant_species`, override 가능 | nullable int 0..100, min≤max | DB 구현, 80/80 |
| `temperature_min_c`, `temperature_max_c` | 권장 섭씨 온도 범위 | `plant_species`, override 가능 | nullable numeric, min≤max | DB 구현, 80/80 |
| `difficulty` | 관리 난이도 코드 | `plant_species`, override 가능; 레거시 `plant_types`에도 별도 컬럼 | nullable text | DB 구현, 80/80. 코드값 정규화(`medium`/`moderate`)는 남은 작업 |
| `toxicity` | 독성/물리 위험 분류 코드 | `plant_species`, override 가능 | nullable text | DB 구현, 80/80. 다수 자유 텍스트 코드이며 검수 필요 |
| `pet_toxic` | 반려동물 독성 여부 | `plant_species`, override 가능 | nullable boolean | DB 구현, 69/80 확정. null은 미확정으로 취급 |
| `human_toxic` | 사람 독성 여부 | `plant_species`, override 가능 | nullable boolean | DB 구현, 68/80 확정. null은 미확정으로 취급 |
| `care_override` | Cultivar가 Species 기본 관리값 중 일부만 덮어씀 | `plant_cultivars` | nullable jsonb, 허용 key/type/range 검증 | DB 구현. 21개 중 non-null 1개 |
| `description_ko/en/de` | 식물별 설명 및 관리 주의 문구 | Species/Cultivar | nullable text | Species 80종 DB 구현·완성, Cultivar 21개 설명 미구축 |
| `care_tips` | 레거시 식물 유형의 관리 팁 | `plant_type_translations` | nullable text | DB 구현(레거시). 현재 hierarchical catalog의 주 저장소는 아님 |
| `image_key` | 이미지 연결 키 | Species/Cultivar | nullable text | DB 구현. Species 4/80만 값 있음; 앱은 현재 학명 기반 로컬 이모지 매핑을 주로 사용 |

Cultivar 유효 관리값은 `plant_catalog.effective_*`에서 `care_override` 값이 있으면 그것을, 없으면 Species 값을 반환한다. `v_plant_watering_status`는 automatic일 때 레거시 interval 또는 effective 물주기 min/max 중간값을 사용하고, 최종 fallback은 7일이다.

## 6. 검색 및 추천 구조

### 검색

- 앱 함수: `searchPlantCatalog()` in `src/services/plantCatalogService.ts`.
- DB 함수: `public.search_plant_catalog(search_query text, search_locale text='ko', result_limit int=30)` → `SETOF plant_catalog`.
- 검색 원본: `plant_search_terms`. 검색 가능한 유형은 `primary`, `common_name`, `alias`, `scientific_name`, `synonym`, `cultivar_name`.
- locale: `ko`, `en`, `de`, `la`. 유효하지 않은 요청 locale은 RPC에서 `en` 처리.
- 정규화: `normalize_plant_search_term()`이 `lower(unaccent())` 후 공백, 아포스트로피 계열, 하이픈/대시 계열을 제거한다. insert/update trigger가 `normalized_term`을 자동 재계산한다.
- 매칭: normalized substring 검색. 정확한 현재 locale primary → 정확한 주요명/Cultivar명 → 정확한 학명 → locale prefix → alias/synonym prefix → Cultivar prefix → 일반 substring 순으로 랭크하고, `priority DESC`, `popularity_rank DESC`를 이어 적용한다.
- 앱 요청 제한: 기본/최대 사용값 30, 250ms debounce. 서비스는 전달 limit를 1..100으로 제한하고 RPC도 1..100으로 제한한다.
- 결과 타입: `PlantCatalogRow`/`PlantCatalogItem`. `catalog_id`, `entity_type`, 계층 ID/학명, `species_id`, nullable `cultivar_id`, KO/EN/DE 표시명, effective 관리값, 이미지, 인기도, 상태를 포함한다.

### 추천

- 최신 코드의 등록 화면 추천은 `getFeaturedPlantCatalog()`가 하드코딩한 Species 4개를 `plant_catalog`에서 조회하고 지정 순서를 복원한다:
  1. `Monstera deliciosa`
  2. `Epipremnum aureum`
  3. `Dracaena trifasciata`
  4. `Zamioculcas zamiifolia`
- 따라서 **현재 최대 추천 개수는 4개**다.
- 과거 `docs/CATALOG_TRANSLATION_AND_REGISTRATION_UI.md`는 인기 Species 5개와 다른 목록을 기록한다. 현재 코드와 충돌하므로 최신 코드의 4개를 우선한다.
- 정보 수정 화면은 최신 요구에 따라 기본 상태에서 추천 목록을 표시하지 않는다. 종류 변경을 열어 검색할 때만 결과를 표시한다.

### 현재 선택 중복 제거

- `EditPlantBasicInfoCard.isSameCatalogItem()`은 둘 중 하나라도 Cultivar이면 같은 non-null `cultivar_id`로 비교하고, Species끼리는 `species_id`로 비교한다.
- 수정 검색 결과에서 현재 선택 항목을 `filter()`로 제외한다. 새 항목을 선택하면 상단 기본 정보가 즉시 갱신되고 검색 UI를 닫는다.
- 등록 화면은 `catalog_id`로 선택 상태를 비교한다.

관련 인덱스와 함수는 §2.3 및 `normalize_plant_search_term`, `search_plant_catalog`을 참조한다.

## 7. 데이터 추가 및 검수 절차

### 7.1 선행 정리

1. 원격에는 있고 로컬에는 없는 2026-07-29 관리자/품질 뷰 마이그레이션을 먼저 pull/동기화한다.
2. 실DB 백업 또는 복구 가능한 마이그레이션/transaction 계획을 만든다.
3. 신규 자료의 식물학·관리·번역 출처를 준비한다. 현재 스키마에는 출처 저장 컬럼이 없으므로 별도 설계 전까지 seed 문서/검수 기록에 보존한다.

### 7.2 단건 Species 추가

1. accepted 학명, Family, Genus, specific epithet, 구 학명/synonym을 출처로 확인한다.
2. `plant_families.scientific_name`과 `plant_genera.scientific_name`으로 기존 행을 찾고 없으면 새 UUID 행을 만든다. 앱 공개 전까지 `review_status='draft'` 권장.
3. `plant_species.scientific_name`과 synonym 충돌을 검사한다. 이름만으로 새 Species를 만들지 않는다.
4. Species에 KO/EN/DE 대표명·설명과 검수된 관리값을 입력한다. 미확정 독성 boolean은 null로 둔다.
5. `plant_search_terms`에 학명(`la/scientific_name`), 대표명(`ko|en|de/primary`), Genus/별칭/구 학명을 적절한 `term_type`과 priority로 추가한다. `normalized_term`은 trigger가 계산한다.
6. 검수 후 Family/Genus/Species를 `review_status='published'`, `is_active=true`로 전환한다.
7. `plant_catalog`, 각 언어 `search_plant_catalog()`, `plant_translation_status`, `plant_quality_dashboard`를 확인한다.
8. anon/authenticated 읽기와 authenticated 마스터 쓰기 거부를 확인한다.

Species 생성용 전용 helper는 현재 없다. SQL transaction 또는 새 데이터 마이그레이션으로 수행한다.

### 7.3 Cultivar 추가

1. 부모 Species를 UUID로 확정한다.
2. `(species_id, cultivar_name)` 중복을 확인한다.
3. KO/EN/DE 표시명, 필요 시 이미지·인기도·검수된 `care_override`만 입력한다. 관리 차이가 없으면 `care_override=null`로 Species 값을 상속한다.
4. service role 전용 `private.create_plant_cultivar(...)` helper를 사용할 수 있다. 이 함수는 Cultivar와 기본/추가 검색어를 함께 생성하고 published로 만든다. 일반 앱/anon/authenticated에서 호출하지 않는다.
5. `plant_catalog`의 effective 관리값과 Cultivar 검색 결과를 검증한다.

### 7.4 대량 추가

1. 검수된 staging CSV 또는 seed 자료를 만든다. **CSV import 파이프라인 자체는 아직 구현되지 않았다.**
2. 현재 검증된 예시는 `20260728193746_seed_initial_plant_catalog_80_species.sql`처럼 임시 seed 테이블을 만들고 Family → Genus → Species → 검색어 → Cultivar → Cultivar 검색어 순으로 insert한다.
3. 기존 자연키를 join하고 `ON CONFLICT DO NOTHING`을 사용해 재실행 시 중복 생성을 막는다. 기존 값을 갱신해야 한다면 `DO NOTHING` 대신 명시적 보정 마이그레이션을 별도로 만들고 변경 범위를 리뷰한다.
4. 먼저 rollback 가능한 transaction/dry-run으로 수량, 중복, orphan, 관리 범위, synonym 충돌, 번역 누락을 검증한다.
5. 적용 후 `verify_initial_plant_catalog_80_species.sql`과 `verify_catalog_translations_and_registration.sql`을 실행한다.

### 7.5 도구별 상태

- **새 마이그레이션 SQL:** 정식·재현 가능한 방식. 우선 사용.
- **Supabase Dashboard SQL Editor:** 실행 가능 도구이나 이 프로젝트에서 데이터 입력에 사용했다는 증거는 `확인 필요`. 사용 시 동일 SQL을 로컬 마이그레이션으로 반드시 보존.
- **Supabase MCP:** 현재 연결 및 읽기 조회 확인. DDL/데이터 쓰기는 사용자 승인과 마이그레이션 파일 준비 후 수행.
- **DBeaver:** 구성/사용 여부 `확인 필요`; 연결 자격증명은 문서나 저장소에 남기지 않는다.
- **`supabase/seed.sql`:** placeholder (`INSERT ...`)라 사용 금지.
- **CSV/import:** 전략 문서에서 권장만 됐고 구현되지 않음.

### 7.6 현재 품질 규칙

- 학명은 Species의 stable identity로 사용하고 `scientific_name` unique를 지킨다. 기존 UUID를 임의 교체하지 않는다.
- Cultivar는 부모 Species가 확정된 경우에만 만들고 `(species_id,cultivar_name)`으로 중복을 판단한다. 표시는 통상 Cultivar명으로 하되 DB에는 따옴표가 없는 `cultivar_name` 원문이 저장되어 있다. 정확한 따옴표 표기 정책은 `확인 필요`.
- KO/EN/DE 대표 일반명은 지역 사용성을 검수하며, 다른 일반명은 덮어쓰지 말고 alias/common_name으로 추가한다.
- Species 공개 전 KO/EN/DE 대표명과 설명을 모두 채우는 것이 현재 품질 기준이다. Cultivar 설명은 아직 필수 공개 조건이 아니며 현재 모두 비어 있다.
- 빈 문자열 대신 null을 사용한다. 이름·검색어는 trim 후 빈 값 금지.
- 구 학명은 accepted Species를 새로 중복 생성하지 말고 `synonyms`와 `plant_search_terms(term_type='synonym')`에 둔다.
- 불확실한 번역·독성·관리값은 추정 입력하지 않는다. 독성 미확정 boolean은 null, 코드에는 `review_required`를 사용할 수 있으나 출처 검수 필요.
- 제거가 필요해도 사용자 참조가 가능한 마스터는 DELETE보다 `is_active=false`/적절한 `review_status`를 사용한다. FK가 RESTRICT인 이유를 우회하지 않는다.
- 기계번역을 바로 published 값으로 쓰는 파이프라인은 없다. 전략상 machine/draft → 인간 검수 → reviewed 흐름이 논의됐지만 계층형 locale 컬럼용 상태 모델은 미구현이다.
- 현재 76개 신규 Species 설명은 관리 유형별 템플릿을 공유해 언어별 14개 중복 그룹이 있다는 과거 검수 기록이 있다. 누락은 아니지만 개별 식물별 설명 고도화가 필요하다.

## 8. 관련 코드와 파일

| 경로 | 역할 | 주요 함수·타입·상수 | 현재 사용 |
|---|---|---|---|
| `src/lib/supabase.ts` | Supabase 클라이언트·세션 저장 | `supabase` | 사용 중 |
| `src/auth/AuthContext.tsx` | 익명 로그인, Apple identity 연결 | `signInAnonymously`, `linkIdentity`, `signInWithIdToken` | 사용 중 |
| `src/services/plantCatalogService.ts` | 계층형 카탈로그 검색·추천 | `searchPlantCatalog`, `getFeaturedPlantCatalog`, `FEATURED_SPECIES` | 사용 중 |
| `src/services/plantService.ts` | 사용자 식물 생성/조회/수정, legacy bridge | `CreatePlantInput`, `createPlant`, `resolveLegacyPlantTypeId`, `getPlants`, `getPlantById`, `getEditablePlantById`, `updatePlant` | 사용 중 |
| `src/services/plantTypeService.ts` | 레거시 3종 locale 조회 | `getPlantTypes` | 카탈로그 실패 fallback/레거시 편집에 사용 |
| `src/types/plantCatalog.ts` | `plant_catalog` RPC 반환 타입 | `PlantCatalogRow`, `PlantCatalogItem`, `PlantCatalogEntityType` | 사용 중 |
| `src/types/plant.ts` | 앱 사용자 식물 요약 타입 | `Plant`, `WateringStatus` | 사용 중 |
| `src/components/PlantCatalogPicker.tsx` | 등록용 추천+검색 선택 UI | `catalog_id` 선택 비교 | 사용 중 |
| `src/components/EditPlantBasicInfoCard.tsx` | 수정용 현재 선택+검색 UI | `isSameCatalogItem` | 사용 중 |
| `src/app/add-plant.tsx` | 선택한 species/cultivar ID를 저장 입력으로 연결 | 검색 debounce, `createPlant` | 사용 중 |
| `src/app/plant/edit/[id].tsx` | taxonomy 변경 검색 및 ID 보존/갱신 | `searchPlantCatalog`, `updatePlant` | 사용 중 |
| `supabase/migrations/20260728180754_hierarchical_plant_catalog.sql` | 계층형 테이블, RLS, 뷰, 검색 함수/trigger, 초기 4종/13 Cultivar | `plant_catalog`, `search_plant_catalog`, normalization, private validator | 원격 적용됨 |
| `supabase/migrations/20260728181545_grant_catalog_helper_dependencies.sql` | private helper 의존 권한 | service role grants | 원격 적용됨 |
| `supabase/migrations/20260728181701_complete_catalog_cultivar_helper.sql` | Cultivar 단건 생성 helper 완성 | `private.create_plant_cultivar` | 원격 적용됨 |
| `supabase/migrations/20260728193746_seed_initial_plant_catalog_80_species.sql` | 80 Species/21 Cultivar/496 검색어 seed | temp seed tables, idempotent inserts | 원격 적용됨 |
| `supabase/migrations/20260728203500_complete_catalog_translations.sql` | 기존 4 Species의 누락 설명 12개 보완 | conditional UPDATE | 원격 적용됨 |
| `supabase/migrations/20260728203501_enable_catalog_plant_registration.sql` | `plants`에 nullable taxonomy FK와 watering view bridge 추가 | `plant_species_id`, `plant_cultivar_id`, `v_plant_watering_status` | 원격 적용됨 |
| 원격 migration `create_plant_catalog_admin_view` | `plant_catalog_admin` 생성 | service role 전용 관리자 뷰 | 원격 적용, **로컬 파일 없음** |
| 원격 migration `create_plant_translation_and_quality_views` | 번역/품질 뷰 생성 | `plant_translation_status`, `plant_quality_dashboard` | 원격 적용, **로컬 파일 없음** |
| `supabase/verify_hierarchical_plant_catalog.sql` | 계층/RLS/검색/helper 회귀 검증 | read-only + rollback tests | 사용 가능 |
| `supabase/verify_initial_plant_catalog_80_species.sql` | 수량·중복·orphan·관리값·검색 검증 | read-only SQL | 사용 가능 |
| `supabase/verify_catalog_translations_and_registration.sql` | 번역 누락·taxonomy 저장 bridge 검증 | read-only SQL | 사용 가능 |
| `supabase/schema.sql` | 초기 레거시 초안 | 초기 tables/views/policies | **현재 상태 아님, 재적용 금지** |
| `supabase/seed.sql` | placeholder | 없음 | 사용 불가 |
| `docs/INITIAL_PLANT_CATALOG_80_SPECIES.md` | 80종 seed 당시 품질 보고 | 당시 수량/정책/검수 | 참고용; 사용자 식물 수 등 일부 오래됨 |
| `docs/CATALOG_TRANSLATION_AND_REGISTRATION_UI.md` | 등록 연결 당시 보고 | 당시 추천 5종 기록 | 참고용; 현재 추천 코드와 충돌 |

별도 번역 데이터 파일/CSV/Edge Function은 현재 저장소에서 확인되지 않았다. 번역과 seed 데이터는 SQL 마이그레이션에 직접 들어 있다.

## 9. 완료된 작업과 남은 작업

### 완료된 작업

- **계층형 마스터 DB 구축:** `family → genus → species → cultivar` 구조를 추가형 마이그레이션으로 구현하고 기존 `plant_types`와 사용자 데이터를 보존했다.
- **80 Species 초기 확장:** 25 Family, 67 Genus, 80 Species, 21 Cultivar, 496 검색어까지 구축했다.
- **KO/EN/DE Species 데이터:** 공개 Species 80종의 대표명과 설명 누락 0. 누락됐던 기존 4종 설명은 별도 보정 마이그레이션으로 채웠다.
- **검색:** 학명, KO/EN/DE 대표명, 일반명, alias, synonym, Cultivar를 normalization+trigram 인덱스 기반 RPC로 검색한다.
- **하드코딩 3종 목록의 Supabase 카탈로그 연동:** 등록/수정 화면이 `plant_catalog`와 `search_plant_catalog()`를 사용하고 카탈로그 실패 시 레거시 3종 fallback을 유지한다.
- **Species/Cultivar 저장:** `plants.plant_species_id`, `plant_cultivar_id` nullable FK와 create/update 코드가 연결됐다.
- **중복 방지:** Species 학명, Species 내 Cultivar명, entity+locale+normalized term에 UNIQUE 규칙을 적용했다. 최신 점검 중복 0.
- **현재 선택 중복 제거:** 수정 검색 결과에서 `species_id`/`cultivar_id`로 현재 항목을 제외한다.
- **Sansevieria 처리:** 레거시 이름과 ID를 유지하면서 accepted `Dracaena trifasciata` UUID에 연결하고 구 학명을 synonym 검색으로 유지한다.
- **anon 읽기/마스터 보호:** anon/authenticated는 published+active 카탈로그만 읽고 마스터 쓰기 정책은 없다. private Cultivar helper는 service role 전용이다.
- **사용자 격리:** `plants`와 `watering_history`는 `auth.uid()` 소유권 RLS가 적용됐다.
- **관리/품질 조회:** 원격 DB에 service role 전용 관리자, 번역 누락, 품질 뷰가 있다.

### 남은 작업

| 우선순위 | 작업 | 목적 / 현재 상태 | 선행 조건 | 관련 테이블·파일 | 위험 요소 | 완료 기준 |
|---:|---|---|---|---|---|---|
| 1 | 원격-로컬 마이그레이션 동기화 | 원격 관리자/품질 뷰 2개가 로컬 파일에 없음 | 실DB schema pull/검토, 백업 | 3개 admin/quality view, `supabase/migrations` | 다음 마이그레이션이 드리프트를 덮어쓸 수 있음 | 원격 migration list와 로컬 파일이 재현 가능하게 일치 |
| 2 | 데이터 출처·검수 모델 설계 | 현재 학명·번역·관리값·독성의 source/reviewer/date 컬럼 없음 | 출처 정책, 관리자 역할 결정 | 새 private/admin tables 또는 기존 master 확장 | 안전 정보의 근거 추적 불가 | 출처, 버전, 검수 상태를 행 단위로 추적하고 공개 조건에 반영 |
| 3 | 80종 번역·관리정보 전문 검수 | 누락은 0이나 76종 설명에 언어별 14개 템플릿 중복 그룹, 독성 boolean null 존재 | 식물학/원예/수의독성 자료와 KO/EN/DE 검수자 | `plant_species`, quality views, seed migration | 템플릿 문장이 개별 종에 부정확할 수 있음 | 각 Species 번역·관리·독성에 검수 상태/출처가 있고 `review_required` 해소 |
| 4 | Species 확대 | 현재 80종; 장기 목표 규모는 미확정(과거 전략 150→500+) | 수요 기준, 출처, import QA | taxonomy tables, search terms, seed migrations | 중복 Species, 잘못된 accepted name, 대량 published 오류 | 합의한 배치 수량이 중복/orphan/번역 누락 0으로 추가되고 검색·RLS 검증 통과 |
| 5 | 다국어 확대 및 French 모델 | KO/EN/DE는 inline 컬럼, French는 언어 레지스트리에 비활성 예약만 | inline 컬럼 확장 vs translation table 재설계 결정 | `supported_languages`, Species/Cultivar, RPC/types | 현재 구조와 과거 전략 문서 충돌, schema/API 변경 가능 | fallback·검색·검수 상태를 포함한 확장 가능한 locale 구조 결정 및 migration |
| 6 | Cultivar 데이터 확대·설명 보완 | 21개 이름은 완성, 설명 63필드(KO/EN/DE ×21) 모두 비어 있고 사용자 Cultivar 등록 행 0 | 정확한 부모 Species와 상업명 검수 | `plant_cultivars`, `plant_search_terms`, private helper | 상업명 오귀속, 중복 | 부모 ID 검증, locale 이름/설명/검색어/상속 QA 통과 |
| 7 | 검색 데이터 확대·분석 | 496개, 모든 Species 검색어 3개 이상이나 지역별 별칭 분포는 불균형 | 검색 로그/사용자 수요, 개인정보 보호 | `plant_search_terms`, RPC, trigram index | alias가 잘못된 Species로 연결될 수 있음 | 언어별 대표 검색 테스트와 중복·충돌 검증 통과 |
| 8 | 관리자 입력 방식 | 현재 정식 관리자 UI/CSV importer 없음; service role helper는 Cultivar만 지원 | 관리자 인증/권한, source/validation 모델 | private schema, admin views, migrations | service role 노출, RLS 우회, 비재현 수동 수정 | service role 비노출, draft→review→publish, audit/source, dry-run import 지원 |
| 9 | 분류 변경/동의어 이력 | 현재 accepted+synonyms는 있으나 변경 이력/출처/유효기간 없음 | taxonomy source 정책 | `plant_species`, `plant_search_terms` | UUID 교체나 synonym 충돌로 사용자 참조 손상 | 기존 UUID 유지, 과거명 검색 유지, 변경 이력과 source 추적 |
| 10 | 관리값 스키마 품질 강화 | 값은 있으나 difficulty 코드가 `medium`/`moderate`로 혼재, custom interval DB range CHECK 없음 | 코드 사전과 도메인 합의 | Species, Cultivar override validator, `plants` | 앱/DB 해석 불일치 | enum/코드 사전, 범위 CHECK, 회귀 테스트 일치 |
| 11 | 이미지·라이선스 메타데이터 | Species image_key 4/80, 출처/라이선스 컬럼 없음 | 이미지 제작/라이선스 정책 | Species/Cultivar, 앱 asset mapping | 저작권·키 불일치 | 80종 이미지 및 license/source/attribution 추적, 앱 동적 표시 검증 |

## 10. 작업 시 주의사항

1. 기존 사용자 `plants`와 `watering_history`를 삭제·초기화하지 않는다.
2. 기존 마스터 UUID, `plant_types` 숫자 ID 1·2·3을 임의 변경하지 않는다.
3. 앱이 참조하는 컬럼, `plant_catalog`/`search_plant_catalog()` 반환 구조를 무단 변경하지 않는다.
4. public 테이블의 RLS를 비활성화하지 않는다.
5. anon/authenticated에게 Family/Genus/Species/Cultivar/검색어 마스터 쓰기 정책을 부여하지 않는다.
6. 프런트 앱·환경변수·문서에 `service_role`이나 비밀 키를 넣지 않는다.
7. 이름만으로 Species/Cultivar 중복을 판단하지 않는다. accepted name, 부모 ID, UUID, synonym을 함께 확인한다.
8. 스키마·대량 데이터 변경 전 백업 또는 rollback 가능한 마이그레이션을 준비한다.
9. 확인되지 않은 번역, 독성, 반려동물 안전성, 관리 범위를 사실처럼 입력하지 않는다. 미확정은 null/draft/review_required로 남긴다.
10. 마스터 삭제 대신 `is_active=false`와 review status를 우선 사용하고 RESTRICT FK를 우회하지 않는다.
11. `supabase/schema.sql`과 `supabase/seed.sql`은 현재 DB 재구축 소스가 아니다. 그대로 실행하지 않는다.
12. Dashboard/DBeaver/MCP에서 수동 변경했다면 같은 변경을 로컬 migration으로 남기고 원격 migration history와 대조한다.
13. Cultivar 저장 시 부모 `plant_species_id`와 `plant_cultivar_id`의 실제 관계를 검증한다. DB가 이 조합을 완전히 강제하지 않는다.
14. 원격 관리자/품질 뷰 마이그레이션의 로컬 누락을 해결하기 전 새 스키마 변경을 겹쳐 적용하지 않는다.

## 11. 새 Work 시작용 요약

```text
Poti의 활성 저장소는 C:\Users\dunun\Documents\Codex\2026-07-28\s\work\Poti-Work이고, Supabase는 poti-dev(syuervgombjogywbfkdf)다. 2026-08-03 실DB 기준 마스터는 25 Family → 67 Genus → 80 Species → 21 Cultivar, plant_catalog 101행, 검색어 496개다. Species 80종은 KO/EN/DE 대표명·설명이 모두 채워져 있지만 Genus 번역은 전부 없고 Cultivar 설명도 전부 없다. 검색은 plant_search_terms + normalize_plant_search_term() + search_plant_catalog()를 사용하며 KO/EN/DE/학명/별칭/synonym/Cultivar를 지원한다.

사용자 데이터는 plants 37개(활성 29개)이며 auth.uid() 소유권 RLS로 격리된다. 익명 로그인도 authenticated role을 사용한다. 마스터는 anon/authenticated가 published+active만 읽고 쓰지 못하며, 관리 작업은 DB owner/service role과 migration으로만 한다. 기존 plant_types 3개 및 숫자 ID 1·2·3은 레거시 호환용이라 삭제·변경 금지이고, Sansevieria trifasciata 레거시 행은 accepted Dracaena trifasciata Species에 연결돼 있다.

가장 먼저 할 일은 원격에만 있는 create_plant_catalog_admin_view / create_plant_translation_and_quality_views 마이그레이션을 로컬에 동기화하는 것이다. 그 다음 출처·검수 모델을 설계하고, 80종 번역/독성/관리값 전문 검수 후 Species와 검색어를 배치 확장한다. 기존 사용자 식물/물주기 기록 삭제, 마스터 ID 교체, API 컬럼 무단 변경, RLS 비활성화, anon 마스터 쓰기 허용, 미확인 번역·관리값 입력은 절대 금지다.
```

# 카탈로그 번역 및 등록 UI 연결

## 완료 범위

- 기존 4 Species의 비어 있던 KO/EN/DE 설명 12개를 조건부로 보완했다.
- published Species 80종의 KO/EN/DE 대표 이름 및 설명 누락은 모두 0건이다.
- 등록 화면을 `plant_catalog`의 인기 Species 5개와 다국어 검색 RPC에 연결했다.
- Species와 Cultivar를 사용자 식물에 저장할 수 있도록 nullable taxonomy FK를 추가했다.
- 80개 Species 학명 기반 이모지 매핑과 `🪴` fallback을 추가했다.
- 홈과 상세 화면에 카탈로그 표시명·학명·이모지가 표시된다.
- 상세 화면에 44×44 이상 터치 영역, 다국어 접근성 라벨, 홈 fallback이 있는 뒤로가기 버튼을 추가했다.

## 등록과 기존 호환

- 기존 3종은 기존 `plant_type_id`와 Species UUID를 함께 저장할 수 있다.
- 신규 Species는 `plant_species_id`, Cultivar는 부모 `plant_species_id`와 `plant_cultivar_id`를 저장한다.
- 기존 3종과 사용자 식물 7개는 수정하지 않았다.
- 물주기 View는 기존 식물의 주기를 그대로 사용하고, 신규 카탈로그 식물은 유효 물주기 최소·최대 범위의 중간값을 초기 자동 추천값으로 사용한다.
- 카탈로그 조회 실패 시 기존 3종 등록 UI를 표시한다.
- 신규 카탈로그 식물을 편집할 때 기존 taxonomy 선택을 보존한다.

## 추천과 검색

현재 `popularity_rank`는 낮을수록 높은 순위가 아니라 높은 값이 높은 인기도를 뜻하는 점수로 저장되어 있다. 따라서 추천은 내림차순으로 조회한다.

1. Monstera deliciosa
2. Zamioculcas zamiifolia
3. Spathiphyllum wallisii
4. Ficus lyrata
5. Philodendron hederaceum

검색은 250ms debounce, 최대 30건, 요청 순번 확인으로 race condition을 방지한다. KO/EN/DE 이름, 학명, synonym, 별칭, Cultivar를 기존 RPC로 검색한다.

## 검증 결과

- 번역 누락: KO/EN/DE 이름 각각 0, 설명 각각 0
- 검색: 요구 예시 10/10 통과
- 공개 Data API: 추천 목록과 KO/EN/DE·synonym·Cultivar 검색 통과
- 롤백 등록 시험:
  - `Ocimum basilicum` Species 저장 및 3일 추천 주기 확인
  - `Pink Princess` 부모 Species/Cultivar 저장 및 10일 추천 주기 확인
- 사용자 식물: 7개 유지
- `plant_types`: 3개, 숫자 ID 1·2·3 유지
- 깨진 legacy/Species FK 및 카탈로그 참조 누락: 0
- TypeScript: 통과
- Expo 의존성: 호환 상태
- ESLint: 프로젝트에 ESLint 패키지가 없어 새 의존성을 설치하지 않고 생략

기존 76종 설명은 이전 seed에서 관리 유형별 템플릿을 공유해 언어별로 14개 중복 그룹이 있다. 기존 값을 함부로 덮어쓰지 않는 원칙에 따라 이번에는 누락된 4종만 각 식물에 맞는 문장으로 보완했다. 개별 설명 고도화는 별도 식물학·현지화 검수 작업으로 남긴다.

로컬 웹 서버는 정상 응답했지만 자동화 시점에 앱 브라우저의 열린 탭이 없어 실제 화면 클릭 검증은 수행하지 못했다. Build, APK, IPA, TestFlight 제출 및 이미지 파일 작업은 하지 않았다.

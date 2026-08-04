-- Fill only missing descriptions on the four pre-existing Species.
-- The 76 Build 8 seed Species already have complete KO/EN/DE names and descriptions.
begin;

update public.plant_species
set
  description_ko = case scientific_name
    when 'Monstera deliciosa' then '밝은 간접광에서 잎이 건강하게 자랍니다. 흙 윗부분이 마른 뒤 물을 주고 과습을 피하세요. 섭취하면 자극을 줄 수 있어 반려동물과 어린이의 손이 닿지 않게 두는 것이 좋습니다.'
    when 'Epipremnum aureum' then '중간 밝기부터 밝은 간접광까지 잘 적응합니다. 흙 윗부분이 마르면 물을 주고, 줄기와 잎을 섭취하지 않도록 주의하세요.'
    when 'Dracaena trifasciata' then '낮은 빛에도 견디지만 밝은 간접광에서 더 안정적으로 자랍니다. 흙이 충분히 마른 뒤 물을 주며, 잦은 물주기는 뿌리썩음의 원인이 됩니다.'
    when 'Ficus elastica' then '밝은 간접광과 일정한 환경을 좋아합니다. 흙 윗부분이 마른 뒤 충분히 물을 주고, 잎과 줄기의 수액이 피부에 닿지 않게 주의하세요.'
    else description_ko
  end
where scientific_name in (
  'Monstera deliciosa',
  'Epipremnum aureum',
  'Dracaena trifasciata',
  'Ficus elastica'
)
and (description_ko is null or btrim(description_ko) = '');

update public.plant_species
set
  description_en = case scientific_name
    when 'Monstera deliciosa' then 'It grows best in bright, indirect light. Let the top layer of soil dry before watering and avoid waterlogging. Keep it away from pets and children because ingestion can cause irritation.'
    when 'Epipremnum aureum' then 'It adapts well to medium or bright, indirect light. Water after the top layer of soil dries, and keep the leaves and stems away from pets and children.'
    when 'Dracaena trifasciata' then 'It tolerates low light but grows more steadily in bright, indirect light. Let the soil dry well before watering because frequent watering can cause root rot.'
    when 'Ficus elastica' then 'It prefers bright, indirect light and a stable environment. Water thoroughly after the top layer of soil dries, and avoid contact with its irritating sap.'
    else description_en
  end
where scientific_name in (
  'Monstera deliciosa',
  'Epipremnum aureum',
  'Dracaena trifasciata',
  'Ficus elastica'
)
and (description_en is null or btrim(description_en) = '');

update public.plant_species
set
  description_de = case scientific_name
    when 'Monstera deliciosa' then 'Sie wächst am besten bei hellem, indirektem Licht. Die obere Erdschicht sollte vor dem Gießen antrocknen; Staunässe ist zu vermeiden. Bei Verzehr kann sie Reizungen verursachen und sollte außer Reichweite von Haustieren und Kindern stehen.'
    when 'Epipremnum aureum' then 'Sie kommt mit mittlerem bis hellem, indirektem Licht gut zurecht. Gieße erst, wenn die obere Erdschicht angetrocknet ist, und halte Blätter und Triebe von Haustieren und Kindern fern.'
    when 'Dracaena trifasciata' then 'Sie verträgt wenig Licht, wächst aber bei hellem, indirektem Licht gleichmäßiger. Die Erde sollte vor dem Gießen gut abtrocknen, da häufiges Gießen Wurzelfäule verursachen kann.'
    when 'Ficus elastica' then 'Er bevorzugt helles, indirektes Licht und einen gleichmäßigen Standort. Gieße gründlich, sobald die obere Erdschicht angetrocknet ist, und vermeide Hautkontakt mit dem reizenden Milchsaft.'
    else description_de
  end
where scientific_name in (
  'Monstera deliciosa',
  'Epipremnum aureum',
  'Dracaena trifasciata',
  'Ficus elastica'
)
and (description_de is null or btrim(description_de) = '');

commit;

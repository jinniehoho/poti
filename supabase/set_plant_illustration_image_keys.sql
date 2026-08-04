-- Connect local plant illustration slugs to exact species matches.
-- Existing non-null image_key values are intentionally left unchanged.
-- zamioculcas.png is excluded because its filename does not uniquely identify a species.

begin;

with requested(image_key) as (
  select jsonb_array_elements_text('["aeschynanthus-radicans","aglaonema-commutatum","allium-cepa","allium-fistulosum","allium-sativum","allium-tuberosum","alocasia-reginula","alocasia-zebrina","aloe-vera","anthurium-andraeanum","anthurium-clarinervium","aspidistra-elatior","beaucarnea-recurvata","begonia-rex","beta-vulgaris","brassica-oleracea","brassica-rapa","capsicum-annuum","ceropegia-woodii","chamaedorea-elegans","chlorophytum-comosum","chrysalidocarpus-lutescens","codiaeum-variegatum","colocasia-esculenta","coriandrum-sativum","crassula-ovata","ctenanthe-burle-marxii","cucumis-sativus","cucurbita-moschata","cucurbita-pepo","curio-rowleyanus","cymbidium-goeringii","daucus-carota","dendrobium-nobile","dieffenbachia-seguine","dischidia-nummularia","dracaena-fragrans","dracaena-trifasciata","echeveria-elegans","epipremnum-aureum","eruca-vesicaria","ficus-elastica","ficus-lyrata","gardenia-jasminoides","gerbera-jamesonii","goeppertia-makoyana","goeppertia-orbifolia","gymnocalycium-mihanovichii","haworthia-cooperi","haworthiopsis-attenuata","heptapleurum-arboricola","hibiscus-rosa-sinensis","hoya-carnosa","hydrangea-macrophylla","kalanchoe-blossfeldiana","lactuca-sativa","mammillaria-elongata","maranta-leuconeura","mentha-spicata","mentha-suaveolens","monstera-adansonii","monstera-deliciosa","ocimum-basilicum","origanum-vulgare","pachira-aquatica","paphiopedilum-insigne","pelargonium-zonale","peperomia-caperata","peperomia-obtusifolia","perilla-frutescens","petroselinum-crispum","phalaenopsis-amabilis","phalaenopsis-aphrodite","philodendron-erubescens","philodendron-gloriosum","philodendron-hederaceum","philodendron-melanochrysum","raphanus-sativus","rhaphidophora-tetrasperma","rhipsalis-baccifera","salvia-rosmarinus","schlumbergera-truncata","scindapsus-pictus","sedum-rubrotinctum","solanum-lycopersicum","solanum-melongena","spathiphyllum-wallisii","spinacia-oleracea","streptocarpus-ionanthus","stromanthe-thalia","syngonium-podophyllum","tradescantia-zebrina","yucca-gigantea"]'::jsonb)
),
matched as (
  select
    species.id,
    requested.image_key
  from requested
  join public.plant_species as species
    on lower(
      regexp_replace(
        species.scientific_name,
        '[^[:alnum:]]+',
        '-',
        'g'
      )
    ) = requested.image_key
)
update public.plant_species as species
set image_key = matched.image_key
from matched
where species.id = matched.id
  and species.image_key is null;

with requested(image_key) as (
  select jsonb_array_elements_text('["aeschynanthus-radicans","aglaonema-commutatum","allium-cepa","allium-fistulosum","allium-sativum","allium-tuberosum","alocasia-reginula","alocasia-zebrina","aloe-vera","anthurium-andraeanum","anthurium-clarinervium","aspidistra-elatior","beaucarnea-recurvata","begonia-rex","beta-vulgaris","brassica-oleracea","brassica-rapa","capsicum-annuum","ceropegia-woodii","chamaedorea-elegans","chlorophytum-comosum","chrysalidocarpus-lutescens","codiaeum-variegatum","colocasia-esculenta","coriandrum-sativum","crassula-ovata","ctenanthe-burle-marxii","cucumis-sativus","cucurbita-moschata","cucurbita-pepo","curio-rowleyanus","cymbidium-goeringii","daucus-carota","dendrobium-nobile","dieffenbachia-seguine","dischidia-nummularia","dracaena-fragrans","dracaena-trifasciata","echeveria-elegans","epipremnum-aureum","eruca-vesicaria","ficus-elastica","ficus-lyrata","gardenia-jasminoides","gerbera-jamesonii","goeppertia-makoyana","goeppertia-orbifolia","gymnocalycium-mihanovichii","haworthia-cooperi","haworthiopsis-attenuata","heptapleurum-arboricola","hibiscus-rosa-sinensis","hoya-carnosa","hydrangea-macrophylla","kalanchoe-blossfeldiana","lactuca-sativa","mammillaria-elongata","maranta-leuconeura","mentha-spicata","mentha-suaveolens","monstera-adansonii","monstera-deliciosa","ocimum-basilicum","origanum-vulgare","pachira-aquatica","paphiopedilum-insigne","pelargonium-zonale","peperomia-caperata","peperomia-obtusifolia","perilla-frutescens","petroselinum-crispum","phalaenopsis-amabilis","phalaenopsis-aphrodite","philodendron-erubescens","philodendron-gloriosum","philodendron-hederaceum","philodendron-melanochrysum","raphanus-sativus","rhaphidophora-tetrasperma","rhipsalis-baccifera","salvia-rosmarinus","schlumbergera-truncata","scindapsus-pictus","sedum-rubrotinctum","solanum-lycopersicum","solanum-melongena","spathiphyllum-wallisii","spinacia-oleracea","streptocarpus-ionanthus","stromanthe-thalia","syngonium-podophyllum","tradescantia-zebrina","yucca-gigantea"]'::jsonb)
)
select
  requested.image_key,
  species.id as species_id,
  species.scientific_name,
  species.image_key as stored_image_key
from requested
left join public.plant_species as species
  on lower(
    regexp_replace(
      species.scientific_name,
      '[^[:alnum:]]+',
      '-',
      'g'
    )
  ) = requested.image_key
order by requested.image_key;

commit;

import type { ImageSourcePropType } from 'react-native';

const plantIllustrations: Record<
  string,
  ImageSourcePropType
> = {
  'aeschynanthus-radicans': require('./illustrations/plants/aeschynanthus-radicans.png'),
  'aglaonema-commutatum': require('./illustrations/plants/aglaonema-commutatum.png'),
  'allium-cepa': require('./illustrations/plants/allium-cepa.png'),
  'allium-fistulosum': require('./illustrations/plants/allium-fistulosum.png'),
  'allium-sativum': require('./illustrations/plants/allium-sativum.png'),
  'allium-tuberosum': require('./illustrations/plants/allium-tuberosum.png'),
  'alocasia-reginula': require('./illustrations/plants/alocasia-reginula.png'),
  'alocasia-zebrina': require('./illustrations/plants/alocasia-zebrina.png'),
  'aloe-vera': require('./illustrations/plants/aloe-vera.png'),
  'anthurium-andraeanum': require('./illustrations/plants/anthurium-andraeanum.png'),
  'anthurium-clarinervium': require('./illustrations/plants/anthurium-clarinervium.png'),
  'aspidistra-elatior': require('./illustrations/plants/aspidistra-elatior.png'),
  'beaucarnea-recurvata': require('./illustrations/plants/beaucarnea-recurvata.png'),
  'begonia-rex': require('./illustrations/plants/begonia-rex.png'),
  'beta-vulgaris': require('./illustrations/plants/beta-vulgaris.png'),
  'brassica-oleracea': require('./illustrations/plants/brassica-oleracea.png'),
  'brassica-rapa': require('./illustrations/plants/brassica-rapa.png'),
  'capsicum-annuum': require('./illustrations/plants/capsicum-annuum.png'),
  'ceropegia-woodii': require('./illustrations/plants/ceropegia-woodii.png'),
  'chamaedorea-elegans': require('./illustrations/plants/chamaedorea-elegans.png'),
  'chlorophytum-comosum': require('./illustrations/plants/chlorophytum-comosum.png'),
  'chrysalidocarpus-lutescens': require('./illustrations/plants/chrysalidocarpus-lutescens.png'),
  'codiaeum-variegatum': require('./illustrations/plants/codiaeum-variegatum.png'),
  'colocasia-esculenta': require('./illustrations/plants/colocasia-esculenta.png'),
  'coriandrum-sativum': require('./illustrations/plants/coriandrum-sativum.png'),
  'crassula-ovata': require('./illustrations/plants/crassula-ovata.png'),
  'ctenanthe-burle-marxii': require('./illustrations/plants/ctenanthe-burle-marxii.png'),
  'cucumis-sativus': require('./illustrations/plants/cucumis-sativus.png'),
  'cucurbita-moschata': require('./illustrations/plants/cucurbita-moschata.png'),
  'cucurbita-pepo': require('./illustrations/plants/cucurbita-pepo.png'),
  'curio-rowleyanus': require('./illustrations/plants/curio-rowleyanus.png'),
  'cymbidium-goeringii': require('./illustrations/plants/cymbidium-goeringii.png'),
  'daucus-carota': require('./illustrations/plants/daucus-carota.png'),
  'dendrobium-nobile': require('./illustrations/plants/dendrobium-nobile.png'),
  'dieffenbachia-seguine': require('./illustrations/plants/dieffenbachia-seguine.png'),
  'dischidia-nummularia': require('./illustrations/plants/dischidia-nummularia.png'),
  'dracaena-fragrans': require('./illustrations/plants/dracaena-fragrans.png'),
  'dracaena-trifasciata': require('./illustrations/plants/dracaena-trifasciata.png'),
  'echeveria-elegans': require('./illustrations/plants/echeveria-elegans.png'),
  'epipremnum-aureum': require('./illustrations/plants/epipremnum-aureum.png'),
  'eruca-vesicaria': require('./illustrations/plants/eruca-vesicaria.png'),
  'ficus-elastica': require('./illustrations/plants/ficus-elastica.png'),
  'ficus-lyrata': require('./illustrations/plants/ficus-lyrata.png'),
  'gardenia-jasminoides': require('./illustrations/plants/gardenia-jasminoides.png'),
  'gerbera-jamesonii': require('./illustrations/plants/gerbera-jamesonii.png'),
  'goeppertia-makoyana': require('./illustrations/plants/goeppertia-makoyana.png'),
  'goeppertia-orbifolia': require('./illustrations/plants/goeppertia-orbifolia.png'),
  'gymnocalycium-mihanovichii': require('./illustrations/plants/gymnocalycium-mihanovichii.png'),
  'haworthia-cooperi': require('./illustrations/plants/haworthia-cooperi.png'),
  'haworthiopsis-attenuata': require('./illustrations/plants/haworthiopsis-attenuata.png'),
  'heptapleurum-arboricola': require('./illustrations/plants/heptapleurum-arboricola.png'),
  'hibiscus-rosa-sinensis': require('./illustrations/plants/hibiscus-rosa-sinensis.png'),
  'hoya-carnosa': require('./illustrations/plants/hoya-carnosa.png'),
  'hydrangea-macrophylla': require('./illustrations/plants/hydrangea-macrophylla.png'),
  'kalanchoe-blossfeldiana': require('./illustrations/plants/kalanchoe-blossfeldiana.png'),
  'lactuca-sativa': require('./illustrations/plants/lactuca-sativa.png'),
  'mammillaria-elongata': require('./illustrations/plants/mammillaria-elongata.png'),
  'maranta-leuconeura': require('./illustrations/plants/maranta-leuconeura.png'),
  'mentha-spicata': require('./illustrations/plants/mentha-spicata.png'),
  'mentha-suaveolens': require('./illustrations/plants/mentha-suaveolens.png'),
  'monstera-adansonii': require('./illustrations/plants/monstera-adansonii.png'),
  'monstera-deliciosa': require('./illustrations/plants/monstera-deliciosa.png'),
  'ocimum-basilicum': require('./illustrations/plants/ocimum-basilicum.png'),
  'origanum-vulgare': require('./illustrations/plants/origanum-vulgare.png'),
  'pachira-aquatica': require('./illustrations/plants/pachira-aquatica.png'),
  'paphiopedilum-insigne': require('./illustrations/plants/paphiopedilum-insigne.png'),
  'pelargonium-zonale': require('./illustrations/plants/pelargonium-zonale.png'),
  'peperomia-caperata': require('./illustrations/plants/peperomia-caperata.png'),
  'peperomia-obtusifolia': require('./illustrations/plants/peperomia-obtusifolia.png'),
  'perilla-frutescens': require('./illustrations/plants/perilla-frutescens.png'),
  'petroselinum-crispum': require('./illustrations/plants/petroselinum-crispum.png'),
  'phalaenopsis-amabilis': require('./illustrations/plants/phalaenopsis-amabilis.png'),
  'phalaenopsis-aphrodite': require('./illustrations/plants/phalaenopsis-aphrodite.png'),
  'philodendron-erubescens': require('./illustrations/plants/philodendron-erubescens.png'),
  'philodendron-gloriosum': require('./illustrations/plants/philodendron-gloriosum.png'),
  'philodendron-hederaceum': require('./illustrations/plants/philodendron-hederaceum.png'),
  'philodendron-melanochrysum': require('./illustrations/plants/philodendron-melanochrysum.png'),
  'raphanus-sativus': require('./illustrations/plants/raphanus-sativus.png'),
  'rhaphidophora-tetrasperma': require('./illustrations/plants/rhaphidophora-tetrasperma.png'),
  'rhipsalis-baccifera': require('./illustrations/plants/rhipsalis-baccifera.png'),
  'salvia-rosmarinus': require('./illustrations/plants/salvia-rosmarinus.png'),
  'schlumbergera-truncata': require('./illustrations/plants/schlumbergera-truncata.png'),
  'scindapsus-pictus': require('./illustrations/plants/scindapsus-pictus.png'),
  'sedum-rubrotinctum': require('./illustrations/plants/sedum-rubrotinctum.png'),
  'solanum-lycopersicum': require('./illustrations/plants/solanum-lycopersicum.png'),
  'solanum-melongena': require('./illustrations/plants/solanum-melongena.png'),
  'spathiphyllum-wallisii': require('./illustrations/plants/spathiphyllum-wallisii.png'),
  'spinacia-oleracea': require('./illustrations/plants/spinacia-oleracea.png'),
  'streptocarpus-ionanthus': require('./illustrations/plants/streptocarpus-ionanthus.png'),
  'stromanthe-thalia': require('./illustrations/plants/stromanthe-thalia.png'),
  'syngonium-podophyllum': require('./illustrations/plants/syngonium-podophyllum.png'),
  'tradescantia-zebrina': require('./illustrations/plants/tradescantia-zebrina.png'),
  'yucca-gigantea': require('./illustrations/plants/yucca-gigantea.png'),
  'zamioculcas-zamiifolia': require('./illustrations/plants/zamioculcas-zamiifolia.png'),
};

export function getPlantIllustration(
  imageKey: string | null | undefined,
) {
  if (!imageKey) {
    return undefined;
  }

  return plantIllustrations[imageKey];
}

export const appAssets = {
  app: {
    icon: require('./images/icon.png'),
    splash: require('./images/splash-icon.png'),
  },

  logo: {
    // 나중에 Poti 로고가 준비되면 아래처럼 추가한다.
    // symbol: require('../../assets/logo/poti-symbol.png'),
    // wordmark: require('../../assets/logo/poti-wordmark.png'),
  },

  icons: {
    // water: require('../../assets/icons/water.png'),
    // edit: require('../../assets/icons/edit.png'),
    // delete: require('../../assets/icons/delete.png'),
    // settings: require('../../assets/icons/settings.png'),
  },

  illustrations: {
    plants: plantIllustrations,
  },

  mascot: {
    // default: require('../../assets/mascot/poti-default.png'),
    // happy: require('../../assets/mascot/poti-happy.png'),
    // watering: require('../../assets/mascot/poti-watering.png'),
  },
} as const;

// Generador de Apodos de Brujas y Brujos del Akelarre
// GARANTÍA: Cada concepto/título es 100% ÚNICO globalmente (si alguien tiene 'La Nigromante', nadie puede tener 'El Nigromante')

export interface WitchTitlePair {
  id: string;
  male: string;
  female: string;
}

export const WITCH_TITLES: WitchTitlePair[] = [
  { id: 'brujo', male: 'El Brujo', female: 'La Bruja' },
  { id: 'hechicero', male: 'El Hechicero', female: 'La Hechicera' },
  { id: 'nigromante', male: 'El Nigromante', female: 'La Nigromante' },
  { id: 'invocador', male: 'El Invocador', female: 'La Invocadora' },
  { id: 'encantador', male: 'El Encantador', female: 'La Encantadora' },
  { id: 'chaman', male: 'El Chamán', female: 'La Chamana' },
  { id: 'arcano', male: 'El Arcano', female: 'La Arcana' },
  { id: 'alquimista', male: 'El Alquimista', female: 'La Alquimista' },
  { id: 'ocultista', male: 'El Ocultista', female: 'La Ocultista' },
  { id: 'seductor', male: 'El Seductor', female: 'La Seductora' },
  { id: 'devoto', male: 'El Devoto', female: 'La Devota' },
  { id: 'siniestro', male: 'El Siniestro', female: 'La Siniestra' },
  { id: 'ritualista', male: 'El Ritualista', female: 'La Ritualista' },
  { id: 'vidente', male: 'El Vidente', female: 'La Vidente' },
  { id: 'conjurador', male: 'El Conjurador', female: 'La Conjuradora' },
  { id: 'hereje', male: 'El Hereje', female: 'La Hereje' },
  { id: 'mistico', male: 'El Místico', female: 'La Mística' },
  { id: 'iluminado', male: 'El Iluminado', female: 'La Iluminada' },
  { id: 'profeta', male: 'El Profeta', female: 'La Profetisa' },
  { id: 'taumaturgo', male: 'El Taumaturgo', female: 'La Taumaturga' },
  { id: 'guardian_fuego', male: 'El Guardián del Fuego', female: 'La Guardiana del Fuego' },
  { id: 'senor_noche', male: 'El Señor de la Noche', female: 'La Dama de la Noche' },
  { id: 'cazador_almas', male: 'El Cazador de Almas', female: 'La Cazadora de Almas' },
  { id: 'brujo_rojo', male: 'El Brujo Rojo', female: 'La Bruja Roja' },
  { id: 'medianoche', male: 'El Rey de Medianoche', female: 'La Reina de Medianoche' },
  { id: 'prohibido', male: 'El Hechicero Prohibido', female: 'La Hechicera Prohibida' },
  { id: 'portador_sombras', male: 'El Portador de Sombras', female: 'La Portadora de Sombras' },
  { id: 'maestro_caldero', male: 'El Maestro del Caldero', female: 'La Dama del Caldero' },
  { id: 'senor_brasas', male: 'El Señor de las Brasas', female: 'La Señora de las Brasas' },
  { id: 'susurrador', male: 'El Susurrador de Tinieblas', female: 'La Susurradora de Tinieblas' },
  { id: 'guardian_pacto', male: 'El Guardián del Pacto', female: 'La Guardiana del Pacto' },
  { id: 'caminante_astral', male: 'El Caminante Astral', female: 'La Caminante Astral' },
  { id: 'tentador', male: 'El Tentador', female: 'La Tentadora' },
  { id: 'aruspice', male: 'El Arúspice', female: 'La Pitonisa' },
  { id: 'mago_sangre', male: 'El Mago de Sangre', female: 'La Maga de Sangre' },
  { id: 'extasis', male: 'El Señor del Éxtasis', female: 'La Dama del Éxtasis' },
  { id: 'sacerdote', male: 'El Sumo Sacerdote', female: 'La Gran Sacerdotisa' },
  { id: 'hierofante', male: 'El Hierofante', female: 'La Hierofante' },
  { id: 'centinela_abismo', male: 'El Centinela del Abismo', female: 'La Centinela del Abismo' },
  { id: 'oraculo_sangre', male: 'El Oráculo de Sangre', female: 'La Oráculo de Sangre' },
  { id: 'custodio_llama', male: 'El Custodio de la Llama', female: 'La Custodia de la Llama' },
  { id: 'espiritista', male: 'El Espiritista', female: 'La Espiritista' },
  { id: 'caballero_luna', male: 'El Caballero de la Luna', female: 'La Dama de la Luna' },
  { id: 'elegido_pecado', male: 'El Elegido del Pecado', female: 'La Elegida del Pecado' },
  { id: 'domador_sombras', male: 'El Domador de Sombras', female: 'La Domadora de Sombras' },
  { id: 'vengador_astral', male: 'El Vengador Astral', female: 'La Vengadora Astral' },
  { id: 'guia_almas', male: 'El Guía de Almas', female: 'La Guía de Almas' },
  { id: 'guardian_secreto', male: 'El Guardián del Secreto', female: 'La Guardiana del Secreto' },
  { id: 'nigro', male: 'El Señor Nigro', female: 'La Dama Nigra' },
  { id: 'senor_abismo', male: 'El Señor del Abismo', female: 'La Señora del Abismo' },
];

export const MALE_NICKNAMES = WITCH_TITLES.map((t) => t.male);
export const FEMALE_NICKNAMES = WITCH_TITLES.map((t) => t.female);

// Lista de nombres masculinos comunes en español que pueden terminar en consonante o excepciones
const MALE_NAMES_EXCEPTIONS = new Set([
  'oscar', 'óscar', 'hector', 'héctor', 'victor', 'víctor', 'césar', 'cesar', 'ruben', 'rubén',
  'cristian', 'lucas', 'gabriel', 'joan', 'guillem', 'pol', 'marc', 'pablo', 'sergio', 'javier',
  'miguel', 'jorge', 'marcos', 'fernando', 'pedro', 'luis', 'antonio', 'manuel', 'jose', 'josé',
  'hugo', 'mario', 'diego', 'nicolas', 'nicolás', 'raul', 'raúl', 'gonzalo', 'adrian', 'adrián',
  'ivan', 'iván', 'ramon', 'ramón', 'carlos', 'juan', 'david', 'alejandro', 'daniel', 'alberto',
  'enrique', 'guillermo', 'rafael', 'francisco', 'alvaro', 'álvaro', 'rodrigo', 'ignacio', 'jaime',
  'charly', 'charli', 'coke', 'abel', 'dani', 'marco', 'rober', 'julian', 'julián',
]);

/**
 * Detección de género basada en reglas del español y lista de excepciones
 */
export function detectGender(name: string): 'masculino' | 'femenino' {
  if (!name) return 'masculino';

  const cleanName = name.trim().toLowerCase().split(' ')[0];

  if (MALE_NAMES_EXCEPTIONS.has(cleanName)) {
    return 'masculino';
  }

  // Regla general: Si termina en 'a', suele ser femenino
  if (cleanName.endsWith('a') || cleanName.endsWith('ía') || cleanName.endsWith('ina') || cleanName.endsWith('ela')) {
    return 'femenino';
  }

  // Si termina en 'o', 'or', 'on', 'en', 'el', 'os', 'us', 'ar', 'er', 'ir', 'y' -> Masculino
  return 'masculino';
}

function normalizeTitleText(t: string): string {
  return t.toLowerCase().replace(/[«»"']/g, '').trim();
}

/**
 * Genera un apodo garantizado ÚNICO CROSS-GENDER:
 * Si alguien ya tiene 'La Nigromante', 'El Nigromante' QUEDA BLOQUEADO para los hombres también.
 */
export function generateUniqueWitchNickname(
  name: string,
  explicitGender?: 'masculino' | 'femenino',
  usedNicknames: string[] = []
): string {
  if (!name || name.trim() === '') return 'El Iniciado';

  const gender = explicitGender || detectGender(name);

  // 1. Identificar qué conceptos/IDs ya están ocupados (sea en masculino o femenino)
  const takenTitleIds = new Set<string>();
  const normalizedUsed = usedNicknames.map(normalizeTitleText);

  for (const used of normalizedUsed) {
    for (const pair of WITCH_TITLES) {
      if (
        normalizeTitleText(pair.male) === used ||
        normalizeTitleText(pair.female) === used ||
        used.includes(pair.id)
      ) {
        takenTitleIds.add(pair.id);
      }
    }
  }

  const cleanName = name.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = (hash << 5) - hash + cleanName.charCodeAt(i);
    hash |= 0;
  }

  const startIndex = Math.abs(hash) % WITCH_TITLES.length;

  // 2. Buscar el primer título libre en la lista compartida
  for (let offset = 0; offset < WITCH_TITLES.length; offset++) {
    const candidate = WITCH_TITLES[(startIndex + offset) % WITCH_TITLES.length];
    if (!takenTitleIds.has(candidate.id)) {
      return gender === 'masculino' ? candidate.male : candidate.female;
    }
  }

  // 3. Fallback en caso extremo
  const basePair = WITCH_TITLES[startIndex];
  const baseName = gender === 'masculino' ? basePair.male : basePair.female;
  let suffix = 2;
  while (normalizedUsed.includes(normalizeTitleText(`${baseName} ${suffix}`))) {
    suffix++;
  }
  return `${baseName} ${suffix}`;
}

export function generateWitchNickname(name: string, explicitGender?: 'masculino' | 'femenino'): string {
  return generateUniqueWitchNickname(name, explicitGender, []);
}


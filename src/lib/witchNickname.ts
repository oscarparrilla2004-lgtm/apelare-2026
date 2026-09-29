// Generador de Apodos de Brujas y Brujos del Akelarre (Diferenciados por Género y 100% Únicos)

export const MALE_NICKNAMES = [
  'El Brujo',
  'El Hechicero',
  'El Nigromante',
  'El Invocador',
  'El Encantador',
  'El Chamán',
  'El Arcano',
  'El Alquimista',
  'El Ocultista',
  'El Seductor',
  'El Devoto',
  'El Siniestro',
  'El Ritualista',
  'El Vidente',
  'El Conjurador',
  'El Hereje',
  'El Nigro',
  'El Místico',
  'El Iluminado',
  'El Profeta',
  'El Taumaturgo',
  'El Guardián del Fuego',
  'El Señor de la Noche',
  'El Cazador de Almas',
  'El Nigromante Rojo',
  'El Brujo de Medianoche',
  'El Hechicero Prohibido',
  'El Portador de Sombras',
  'El Maestro del Caldero',
  'El Señor de las Brasas',
  'El Susurrador de Tinieblas',
  'El Guardián del Pacto',
  'El Caminante Astral',
  'El Tentador',
  'El Arúspice',
  'El Mago de Sangre',
];

export const FEMALE_NICKNAMES = [
  'La Bruja',
  'La Hechicera',
  'La Nigromante',
  'La Invocadora',
  'La Encantadora',
  'La Chamana',
  'La Arcana',
  'La Alquimista',
  'La Ocultista',
  'La Seductora',
  'La Devota',
  'La Siniestra',
  'La Sacerdotisa',
  'La Vidente',
  'La Conjuradora',
  'La Hereje',
  'La Mística',
  'La Iluminada',
  'La Profetisa',
  'La Taumaturga',
  'La Guardiana del Fuego',
  'La Dama de la Noche',
  'La Cazadora de Almas',
  'La Bruja Roja',
  'La Reina de Medianoche',
  'La Hechicera Prohibida',
  'La Portadora de Sombras',
  'La Dama del Caldero',
  'La Señora de las Brasas',
  'La Susurradora de Tinieblas',
  'La Guardiana del Pacto',
  'La Caminante Astral',
  'La Tentadora',
  'La Pitonisa',
  'La Maga de Sangre',
  'La Dama del Éxtasis',
];

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

  // Regla general: Si termina en 'a', suele ser femenino (excepto nombres masculinos raros)
  if (cleanName.endsWith('a') || cleanName.endsWith('ía') || cleanName.endsWith('ina') || cleanName.endsWith('ela')) {
    return 'femenino';
  }

  // Si termina en 'o', 'or', 'on', 'en', 'el', 'os', 'us', 'ar', 'er', 'ir', 'y' -> Masculino
  return 'masculino';
}

/**
 * Genera un apodo garantizado ÚNICO que no colisiona con ningún apodo ya tomado en la base de datos.
 */
export function generateUniqueWitchNickname(
  name: string,
  explicitGender?: 'masculino' | 'femenino',
  usedNicknames: string[] = []
): string {
  if (!name || name.trim() === '') return 'El Iniciado';

  const gender = explicitGender || detectGender(name);
  const pool = gender === 'masculino' ? MALE_NICKNAMES : FEMALE_NICKNAMES;
  
  // Normalizar conjunto de apodos ya usados (case-insensitive)
  const usedSet = new Set(
    usedNicknames.map((n) => n.toLowerCase().replace(/[«»"']/g, '').trim())
  );

  const cleanName = name.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = (hash << 5) - hash + cleanName.charCodeAt(i);
    hash |= 0;
  }

  const startIndex = Math.abs(hash) % pool.length;

  // 1. Probar los apodos del pool empezando por el hash del nombre hasta encontrar uno libre
  for (let offset = 0; offset < pool.length; offset++) {
    const candidate = pool[(startIndex + offset) % pool.length];
    const candidateNorm = candidate.toLowerCase().trim();
    if (!usedSet.has(candidateNorm)) {
      return candidate;
    }
  }

  // 2. Si todos los 36 apodos estuvieran ocupados (más de 36 invitados del mismo género), añadir sufijo
  const base = pool[startIndex];
  let suffix = 2;
  while (usedSet.has(`${base} ${suffix}`.toLowerCase())) {
    suffix++;
  }
  return `${base} ${suffix}`;
}

export function generateWitchNickname(name: string, explicitGender?: 'masculino' | 'femenino'): string {
  return generateUniqueWitchNickname(name, explicitGender, []);
}

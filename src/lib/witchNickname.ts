// Generador de Apodos Simples de Brujas y Brujos del Akelarre (Diferenciados por Género)

const MALE_NICKNAMES = [
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
];

const FEMALE_NICKNAMES = [
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
];

// Lista de nombres masculinos comunes en español que pueden terminar en consonante o excepciones
const MALE_NAMES_EXCEPTIONS = new Set([
  'oscar', 'óscar', 'hector', 'héctor', 'victor', 'víctor', 'césar', 'cesar', 'ruben', 'rubén',
  'cristian', 'lucas', 'gabriel', 'joan', 'guillem', 'pol', 'marc', 'pablo', 'sergio', 'javier',
  'miguel', 'jorge', 'marcos', 'fernando', 'pedro', 'luis', 'antonio', 'manuel', 'jose', 'josé',
  'hugo', 'mario', 'diego', 'nicolas', 'nicolás', 'raul', 'raúl', 'gonzalo', 'adrian', 'adrián',
  'ivan', 'iván', 'ramon', 'ramón', 'carlos', 'juan', 'david', 'alejandro', 'daniel', 'alberto',
  'enrique', 'guillermo', 'rafael', 'francisco', 'alvaro', 'álvaro', 'rodrigo', 'ignacio', 'jaime',
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

  // Si termina en 'o', 'or', 'on', 'en', 'el', 'os', 'us', 'ar', 'er', 'ir' -> Masculino
  return 'masculino';
}

/**
  * Genera un apodo simple de una sola palabra (Ej: "El Brujo", "La Hechicera")
  */
export function generateWitchNickname(name: string, explicitGender?: 'masculino' | 'femenino'): string {
  if (!name || name.trim() === '') return 'El Iniciado';

  const gender = explicitGender || detectGender(name);
  const pool = gender === 'masculino' ? MALE_NICKNAMES : FEMALE_NICKNAMES;

  const cleanName = name.trim();
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = (hash << 5) - hash + cleanName.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % pool.length;
  return pool[index];
}

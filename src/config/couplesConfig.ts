export interface CoupleDefinition {
  id: string;
  partner1: {
    name: string;
    token: string;
    gender: 'femenino' | 'masculino';
  };
  partner2: {
    name: string;
    token: string;
    gender: 'masculino' | 'femenino';
  };
}

export const COUPLES_CONFIG: CoupleDefinition[] = [
  {
    id: 'pareja_1',
    partner1: { name: 'Maria', token: 'maria', gender: 'femenino' },
    partner2: { name: 'Oscar', token: 'oscar', gender: 'masculino' },
  },
  {
    id: 'pareja_2',
    partner1: { name: 'Diana', token: 'diana', gender: 'femenino' },
    partner2: { name: 'Manu', token: 'manu', gender: 'masculino' },
  },
  {
    id: 'pareja_3',
    partner1: { name: 'Marta', token: 'marta', gender: 'femenino' },
    partner2: { name: 'Rodrigo', token: 'rodrigo', gender: 'masculino' },
  },
  {
    id: 'pareja_4',
    partner1: { name: 'Angela', token: 'angela-mario', gender: 'femenino' },
    partner2: { name: 'Mario', token: 'mario', gender: 'masculino' },
  },
  {
    id: 'pareja_5',
    partner1: { name: 'Oihana', token: 'oihana', gender: 'femenino' },
    partner2: { name: 'Oskartxo', token: 'oskartxo', gender: 'masculino' },
  },
  {
    id: 'pareja_6',
    partner1: { name: 'Carmen', token: 'carmen', gender: 'femenino' },
    partner2: { name: 'Jorge', token: 'jorge-carmen', gender: 'masculino' },
  },
  {
    id: 'pareja_7',
    partner1: { name: 'Sandra', token: 'sandra', gender: 'femenino' },
    partner2: { name: 'Adrián', token: 'adrian', gender: 'masculino' },
  },
  {
    id: 'pareja_8',
    partner1: { name: 'Laura', token: 'laura', gender: 'femenino' },
    partner2: { name: 'Charly', token: 'charly', gender: 'masculino' },
  },
  {
    id: 'pareja_9',
    partner1: { name: 'Angela', token: 'angela-jaime', gender: 'femenino' },
    partner2: { name: 'Jaime', token: 'jaime', gender: 'masculino' },
  },
  {
    id: 'pareja_10',
    partner1: { name: 'Soraya', token: 'soraya', gender: 'femenino' },
    partner2: { name: 'Antonio', token: 'antonio', gender: 'masculino' },
  },
  {
    id: 'pareja_11',
    partner1: { name: 'Nuria', token: 'nuria', gender: 'femenino' },
    partner2: { name: 'Marco', token: 'marco', gender: 'masculino' },
  },
  {
    id: 'pareja_12',
    partner1: { name: 'Aimara', token: 'aimara', gender: 'femenino' },
    partner2: { name: 'Abel', token: 'abel', gender: 'masculino' },
  },
  {
    id: 'pareja_13',
    partner1: { name: 'Elena', token: 'elena', gender: 'femenino' },
    partner2: { name: 'Dani', token: 'dani', gender: 'masculino' },
  },
  {
    id: 'pareja_14',
    partner1: { name: 'Susana', token: 'susana', gender: 'femenino' },
    partner2: { name: 'Coke', token: 'coke', gender: 'masculino' },
  },
  {
    id: 'pareja_15',
    partner1: { name: 'Sara', token: 'sara-pablo', gender: 'femenino' },
    partner2: { name: 'Pablo', token: 'pablo', gender: 'masculino' },
  },
  {
    id: 'pareja_16',
    partner1: { name: 'Ana', token: 'ana', gender: 'femenino' },
    partner2: { name: 'Julian', token: 'julian', gender: 'masculino' },
  },
  {
    id: 'pareja_17',
    partner1: { name: 'Sara', token: 'sara-rober', gender: 'femenino' },
    partner2: { name: 'Rober', token: 'rober', gender: 'masculino' },
  },
  {
    id: 'pareja_18',
    partner1: { name: 'Nana', token: 'nana', gender: 'femenino' },
    partner2: { name: 'Alber', token: 'alber', gender: 'masculino' },
  },
  {
    id: 'pareja_19',
    partner1: { name: 'Bea', token: 'bea-sergio', gender: 'femenino' },
    partner2: { name: 'Sergio', token: 'sergio', gender: 'masculino' },
  },
  {
    id: 'pareja_20',
    partner1: { name: 'Aran', token: 'aran', gender: 'femenino' },
    partner2: { name: 'Jorge', token: 'jorge-aran', gender: 'masculino' },
  },
  {
    id: 'pareja_21',
    partner1: { name: 'Bea', token: 'bea-javi', gender: 'femenino' },
    partner2: { name: 'Javi', token: 'javi', gender: 'masculino' },
  },
];

export const TOTAL_GUESTS_COUNT = COUPLES_CONFIG.length * 2; // 42 guests

/**
 * Busca a la pareja de un invitado dado su token
 */
export function getSpouseInfoByToken(token: string) {
  const norm = token.toLowerCase().trim();
  for (const couple of COUPLES_CONFIG) {
    if (couple.partner1.token.toLowerCase() === norm) {
      return {
        me: couple.partner1,
        spouse: couple.partner2,
        coupleId: couple.id,
      };
    }
    if (couple.partner2.token.toLowerCase() === norm) {
      return {
        me: couple.partner2,
        spouse: couple.partner1,
        coupleId: couple.id,
      };
    }
  }
  return null;
}

/**
 * Obtiene la lista plana de los 42 invitados con sus datos
 */
export function getAllGuestsFlat() {
  const list: {
    token: string;
    name: string;
    gender: 'femenino' | 'masculino';
    spouseName: string;
    spouseToken: string;
    coupleId: string;
  }[] = [];

  for (const couple of COUPLES_CONFIG) {
    list.push({
      token: couple.partner1.token,
      name: couple.partner1.name,
      gender: couple.partner1.gender,
      spouseName: couple.partner2.name,
      spouseToken: couple.partner2.token,
      coupleId: couple.id,
    });
    list.push({
      token: couple.partner2.token,
      name: couple.partner2.name,
      gender: couple.partner2.gender,
      spouseName: couple.partner1.name,
      spouseToken: couple.partner1.token,
      coupleId: couple.id,
    });
  }

  return list;
}

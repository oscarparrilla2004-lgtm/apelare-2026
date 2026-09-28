export interface EventConfig {
  title: string;
  subtitle: string;
  dates: string;
  dressCode: string;
  dressCodeDetail: string;
  fridayDressCode: string;
  fridayDressCodeDetail: string;
  saturdayDressCode: string;
  saturdayDressCodeDetail: string;
  price: string;
  priceLabel: string;
  priceDetail: string;
  bizumRecipient: string;
  bizumPhone: string;
  bizumPhoneFormatted: string;
  bizumDeadline: string;
  bizumInstruction: string;
  paymentReminder: string;
  whatsappLink: string;
  secretEnabled: boolean;
  guestCounterEnabled: boolean;
  soundEnabled: boolean;
  texts: {
    introTitle: string;
    introSubtitle: string;
    introInstruction: string;
    lockTitle: string;
    lockInstructionTilt: string;
    lockInstructionDrag: string;
    portalCrossed: string;
    portalRecognized: string;
    datesLabel: string;
    pactTitle: string;
    pactBody: string;
    nameInputLabel: string;
    nameInputPlaceholder: string;
    pactButton: string;
    pactSealed: string;
    pactGranted: string;
    rewardTitle: string;
    rewardAccepted: string;
    rewardGathering: string;
    rewardOtherSide: string;
    rewardCircleSubtext: string;
    keyPhrase: string;
    enterCircleButton: string;
    secretFoundTitle: string;
    secretFoundText: string;
  };
}

export const eventConfig: EventConfig = {
  title: "AKELARRE DE BRUJAS",
  subtitle: "Sexy, Erótica y Sensual",
  dates: "30 DE OCTUBRE — 1 DE NOVIEMBRE",
  dressCode: "VIERNES: SEXY | SÁBADO: BRUJAS Y BRUJOS ERÓTICO",
  dressCodeDetail: "Viernes fiesta sexy (sin temática) · Sábado fiesta temática de brujas y brujos erótico",
  fridayDressCode: "DRESS CODE SEXY (SIN TEMÁTICA)",
  fridayDressCodeDetail: "VIERNES NOCHE",
  saturdayDressCode: "BRUJAS Y BRUJOS ERÓTICO",
  saturdayDressCodeDetail: "SÁBADO NOCHE",
  price: "235 €",
  priceLabel: "235 € POR PAREJA",
  priceDetail: "Fin de semana completo (alojamiento y experiencia)",
  bizumRecipient: "Oscar",
  bizumPhone: "609016287",
  bizumPhoneFormatted: "609 01 62 87",
  bizumDeadline: "6 de Octubre",
  bizumInstruction: "Bizum a Oscar (609 01 62 87) antes del 6 de Octubre",
  paymentReminder: "Acuérdate de hacer tu pago, no esperes al último momento",
  whatsappLink: "https://chat.whatsapp.com/LeZ1SrloaRWBoA6pMNXk4J",
  secretEnabled: true,
  guestCounterEnabled: true,
  soundEnabled: true,
  texts: {
    introTitle: "HAS RECIBIDO UNA LLAVE",
    introSubtitle: "No todos pueden abrir esta puerta.",
    introInstruction: "Mantén pulsado para despertar la llave",
    lockTitle: "CERRADURA DEL UMBRAL",
    lockInstructionTilt: "Gira ligeramente tu teléfono para girar la llave",
    lockInstructionDrag: "Desliza la llave horizontalmente para girarla",
    portalCrossed: "HAS CRUZADO EL UMBRAL",
    portalRecognized: "La mansión del Akelarre abre sus puertas ante ti.",
    datesLabel: "FECHAS",
    pactTitle: "EL PACTO",
    pactBody: "Has sido elegido para formar parte del Akelarre. Esta llave es personal. Al abrirla, aceptas cruzar el umbral y formar parte del círculo.",
    nameInputLabel: "ESCRIBE TU NOMBRE DE MORTAL",
    nameInputPlaceholder: "Tu Nombre...",
    pactButton: "ACEPTO EL PACTO",
    pactSealed: "PACTO SELLADO",
    pactGranted: "Acceso concedido",
    rewardTitle: "HAS ABIERTO LA LLAVE",
    rewardAccepted: "El Akelarre te acepta.",
    rewardGathering: "Brujas y brujos ya se están reuniendo.",
    rewardOtherSide: "TU RECOMPENSA ESTÁ AL OTRO LADO",
    rewardCircleSubtext: "Accede al grupo privado del Akelarre.",
    keyPhrase: "Abrir la puerta era solo el principio. Al otro lado ya están los demás.",
    enterCircleButton: "ENTRAR AL CÍRCULO",
    secretFoundTitle: "HAS ENCONTRADO UN SECRETO DEL AKELARRE",
    secretFoundText: "Algunas puertas solo aparecen ante quienes saben dónde mirar.",
  },
};

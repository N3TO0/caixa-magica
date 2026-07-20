export function formatAvailableUnits(value) {
  const units = Number(value || 0);

  if (units <= 0) {
    return "Indisponivel";
  }

  if (units === 1) {
    return "1 disponivel";
  }

  return `${units} disponiveis`;
}

export function getAvailabilityHighlight(value) {
  const units = Number(value || 0);

  if (units <= 0) {
    return "Indisponivel";
  }

  if (units === 1) {
    return "Ultima unidade";
  }

  if (units <= 3) {
    return "Ultimas unidades";
  }

  return "Disponivel";
}

export function getAvailabilityTone(value) {
  const units = Number(value || 0);

  if (units <= 0) {
    return "danger";
  }

  if (units <= 3) {
    return "warning";
  }

  return "success";
}

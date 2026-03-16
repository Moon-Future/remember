export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function validateCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

export function validateName(name: string): boolean {
  return name.trim().length >= 1 && name.length <= 50;
}

export function validateTitle(title: string): boolean {
  return title.trim().length >= 1 && title.length <= 200;
}

export function validateCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

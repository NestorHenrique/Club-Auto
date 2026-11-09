// Geração local provisória: o código e o id definitivos do cupom virão do backend.
export function generateCouponCode(): string {
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase().padEnd(4, '0');
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `CLUB-PAR-${digits}-${suffix}`;
}

export function generateLocalId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

/** Formata em reais no padrão brasileiro: R$ 1.234,50 */
export function brl(value: number): string {
  return brlFormatter.format(value).replace(/ /g, ' ');
}

/**
 * Converte número decimal para número romano
 */
export const converterParaRomano = (num: number): string => {
  const valores = [
    { valor: 1000, simbolo: 'M' },
    { valor: 900, simbolo: 'CM' },
    { valor: 500, simbolo: 'D' },
    { valor: 400, simbolo: 'CD' },
    { valor: 100, simbolo: 'C' },
    { valor: 90, simbolo: 'XC' },
    { valor: 50, simbolo: 'L' },
    { valor: 40, simbolo: 'XL' },
    { valor: 10, simbolo: 'X' },
    { valor: 9, simbolo: 'IX' },
    { valor: 5, simbolo: 'V' },
    { valor: 4, simbolo: 'IV' },
    { valor: 1, simbolo: 'I' }
  ];
  
  let resultado = '';
  let numero = num;
  
  for (const { valor, simbolo } of valores) {
    while (numero >= valor) {
      resultado += simbolo;
      numero -= valor;
    }
  }
  
  return resultado;
};

/**
 * Formata tamanho de arquivo de KB para KB ou MB
 */
export const formatTamanhoArquivo = (tamanhoKb: number): string => {
  if (tamanhoKb < 1024) {
    return `${tamanhoKb} KB`;
  }
  const tamanhoMb = (tamanhoKb / 1024).toFixed(2);
  return `${tamanhoMb} MB`;
};

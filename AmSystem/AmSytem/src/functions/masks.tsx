export const insertMaskCPF = (cpf?: string) => {
  if (!cpf) return "";
  return cpf
    ?.replace(/\D/g, "") // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{3})(\d)/, "$1.$2") // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const insertMaskCNPJ = (cnpj?: string) => {
  if (!cnpj) return "";
  return cnpj
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

export const insertMaskRG = (rg?: string) => {
  if (!rg) return "";
  return rg
    ?.replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{1})\d+?$/, "$1");
};

export const insertMaskCel = (cel?: string) => {
  if (!cel) return "";

  // Remove all non-digit characters
  const cleanedNumber = cel.replace(/\D/g, "");

  // Applying mask based on cleaned number
  let maskedNumber = "";
  if (cleanedNumber.length <= 10) {
    // Formats as (XX) XXXX-XXXX for numbers with 10 or fewer digits
    maskedNumber = cleanedNumber.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    // Formats as (XX) XXXXX-XXXX for numbers with more than 10 digits
    maskedNumber = cleanedNumber.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return maskedNumber;
};

export const insertMaskCEP = (cep?: string) => {
  if (!cep) return "";
  const cleaned = cep.replace(/\D/g, "");
  return cleaned.replace(/^(\d{5})(\d{3})/, "$1-$2");
};

export function formatCurrency(input: string): number {
  if (input === undefined) return 0;
  if (!input) return 0;
  input.toString().trim();
  // Verifica se a string começa com "R$ " e extrai o valor numérico
  if (input.toString().startsWith("R$")) {
    const value = input.substring(3); // Remove "R$ "
    // Remove pontos e vírgulas para obter apenas os dígitos
    const cleanValue = value.replace(/[\.,]/g, "");
    console.log("CleanValue", Number(cleanValue));
    // Verifica se há ao menos três caracteres no valor limpo
    if (cleanValue.length >= 3) {
      // Separa os últimos dois caracteres do restante
      const integerPart = cleanValue.slice(0, -2);
      const decimalPart = cleanValue.slice(-2);
      // Formata a nova string com vírgula antes dos dois últimos dígitos
      const formattedValue = integerPart + "," + decimalPart;
      // Adiciona "R$ " no início e retorna
      return Number(formattedValue.replace(",", "."));
    } else if (Number(cleanValue) === 0) {
      return 0;
    } else {
      return Number(input);
    }
  } else {
    return Number(input);
  }
}

export function formatPISPASEP(value: string): string {
  if (value === undefined) return "";
  // Remove qualquer caractere que não seja um número
  value = value.replace(/\D/g, "");

  // Formata o número conforme os padrões do PIS/PASEP
  if (value.length > 11) {
    value = value.slice(0, 11);
  }

  const formattedValue = value
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{5})(\d)/, "$1.$2")
    .replace(/(\d{2})(\d{1,2})$/, "$1-$2");

  return formattedValue;
}

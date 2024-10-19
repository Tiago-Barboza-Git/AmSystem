import { IParcela } from "@/interfaces/parcela.interfaces";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;
  return `${formattedDay}/${formattedMonth}/${year}`;
}

export function removeSpecialCharacters(str?: string): string {
  if (str === undefined) return "";
  return str.toString().replace(/[^A-Za-z0-9]/g, "");
}

export function formatPercentage(input: string): string {
  let inputValue = input ? input.toString().replace(/[^\d]/g, "") : "";

  // Adicionar zeros à esquerda se necessário
  while (inputValue.length < 3) {
    inputValue = "0" + inputValue;
  }

  // Limitar o valor a no máximo 10000 (equivalente a 100.00%)
  if (parseInt(inputValue, 10) > 10000) {
    inputValue = "10000";
  }

  // Inserir o ponto decimal
  inputValue = inputValue.slice(0, -2) + "." + inputValue.slice(-2);

  // Remover zeros à esquerda
  inputValue = inputValue.replace(/^0+/, "");

  // Garantir que pelo menos "0.00" seja retornado
  if (inputValue === "" || inputValue.startsWith(".")) {
    inputValue = "0" + inputValue;
  }

  return inputValue;
}

export function definirProximaParcela(parcelas: IParcela[]): number {
  if (parcelas.length === 0) {
    return 1;
  }

  // Ordena as parcelas pelo número da parcela
  parcelas.sort((a, b) => a.numParcela - b.numParcela);

  // Verifica a menor lacuna a partir do número 1
  let proximaParcela = 1;

  for (let i = 0; i < parcelas.length; i++) {
    if (parcelas[i].numParcela === proximaParcela) {
      proximaParcela++;
    } else if (parcelas[i].numParcela > proximaParcela) {
      break;
    }
  }

  return proximaParcela;
}

export function formatMoney(value: string | number): number {
  const valor = String(value);
  if (valor === undefined || valor.length === 0) return Number(0);
  if (valor.toString().includes(",")) {
    const valueNumber = Number(valor.toString().replace(".", "").replace(",", "."));
    return valueNumber;
  }
  return Number(valor);
}

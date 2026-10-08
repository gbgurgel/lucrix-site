export type OfferKind = "physical" | "digital" | "service";
export type NumericAnswer = number | "";

export interface Answers {
  kind: OfferKind | "";
  name: string;
  price: NumericAnswer;
  monthlyVolume: NumericAnswer;
  unitCost: NumericAnswer;
  packagingCost: NumericAnswer;
  freightCost: NumericAnswer;
  commissionRate: NumericAnswer;
  paymentRate: NumericAnswer;
  paymentFixed: NumericAnswer;
  taxRate: NumericAnswer;
  cac: NumericAnswer;
  returnRate: NumericAnswer;
  fixedCosts: NumericAnswer;
  initialInvestment: NumericAnswer;
}

export type AnswerKey = keyof Answers;
export type QuestionKind = "choice" | "text" | "currency" | "percent" | "quantity";

export interface QuestionDefinition {
  id: AnswerKey;
  title: string;
  description: string;
  kind: QuestionKind;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export const INITIAL_ANSWERS: Answers = {
  kind: "",
  name: "",
  price: "",
  monthlyVolume: "",
  unitCost: "",
  packagingCost: "",
  freightCost: "",
  commissionRate: "",
  paymentRate: "",
  paymentFixed: "",
  taxRate: "",
  cac: "",
  returnRate: "",
  fixedCosts: "",
  initialInvestment: "",
};

export const OFFER_OPTIONS: Array<{
  value: OfferKind;
  label: string;
  detail: string;
  icon: "box" | "screen" | "sparkles";
}> = [
  { value: "physical", label: "Produto físico", detail: "Tem custo, embalagem ou envio.", icon: "box" },
  { value: "digital", label: "Produto digital", detail: "Curso, arquivo, licença ou conteúdo.", icon: "screen" },
  { value: "service", label: "Serviço", detail: "Uma entrega por atendimento ou projeto.", icon: "sparkles" },
];

const TYPE_QUESTION: QuestionDefinition = {
  id: "kind",
  title: "Qual é o tipo da sua oferta?",
  description: "Vamos adaptar as perguntas ao que você vende.",
  kind: "choice",
  required: true,
};

const commonQuestions: QuestionDefinition[] = [
  {
    id: "name",
    title: "Qual o nome da oferta?",
    description: "Só para identificar sua análise.",
    kind: "text",
    placeholder: "Ex.: Garrafa térmica 1L",
    required: true,
  },
  {
    id: "price",
    title: "Qual é o preço por venda?",
    description: "Use o valor que o cliente paga por unidade ou serviço.",
    kind: "currency",
    placeholder: "0,00",
    required: true,
    min: 0.01,
  },
  {
    id: "monthlyVolume",
    title: "Quantas vendas você espera por mês?",
    description: "Uma hipótese inicial já basta — você poderá testar outros volumes depois.",
    kind: "quantity",
    placeholder: "Ex.: 120",
    required: true,
    min: 0,
  },
];

const unitCostQuestion = (kind: OfferKind): QuestionDefinition => ({
  id: "unitCost",
  title:
    kind === "physical"
      ? "Quanto custa o produto por unidade?"
      : kind === "service"
        ? "Qual é o custo de entrega por serviço?"
        : "Há algum custo direto por venda?",
  description:
    kind === "service"
      ? "Informe o valor de entrega por serviço. Não convertemos horas nem capacidade."
      : kind === "digital"
        ? "Inclua ferramentas ou custos variáveis diretamente ligados a cada venda, se houver."
        : "Considere o custo de aquisição ou produção de uma unidade.",
  kind: "currency",
  placeholder: "0,00",
  required: kind !== "digital",
  min: 0,
});

const physicalQuestions: QuestionDefinition[] = [
  {
    id: "packagingCost",
    title: "Quanto custa a embalagem por unidade?",
    description: "Se não usar embalagem adicional, deixe em branco.",
    kind: "currency",
    placeholder: "0,00",
    min: 0,
  },
  {
    id: "freightCost",
    title: "Qual é o frete pago por venda?",
    description: "Use o valor que sai do seu bolso por pedido.",
    kind: "currency",
    placeholder: "0,00",
    min: 0,
  },
];

const sellingCostQuestions: QuestionDefinition[] = [
  {
    id: "commissionRate",
    title: "Qual comissão incide sobre a venda?",
    description: "Some marketplace, afiliado ou comissão comercial, se houver.",
    kind: "percent",
    placeholder: "0",
    min: 0,
    max: 100,
  },
  {
    id: "paymentRate",
    title: "Qual é a taxa percentual de pagamento?",
    description: "A taxa cobrada pela plataforma ou pelo meio de pagamento.",
    kind: "percent",
    placeholder: "0",
    min: 0,
    max: 100,
  },
  {
    id: "paymentFixed",
    title: "Existe uma taxa fixa por transação?",
    description: "Informe o valor fixo cobrado além da taxa percentual.",
    kind: "currency",
    placeholder: "0,00",
    min: 0,
  },
  {
    id: "taxRate",
    title: "Qual percentual de imposto quer considerar?",
    description: "Use uma estimativa informada por você; o Lucrix não determina seu regime tributário.",
    kind: "percent",
    placeholder: "0",
    min: 0,
    max: 100,
  },
  {
    id: "cac",
    title: "Quanto custa conquistar um cliente?",
    description: "Seu CAC por venda — aquisição paga ou outra estimativa que queira considerar.",
    kind: "currency",
    placeholder: "0,00",
    min: 0,
  },
];

const physicalEnding: QuestionDefinition[] = [
  {
    id: "returnRate",
    title: "Qual percentual de devoluções você estima?",
    description: "Uma hipótese de perda por devolução ou reembolso, quando aplicável.",
    kind: "percent",
    placeholder: "0",
    min: 0,
    max: 100,
  },
  {
    id: "fixedCosts",
    title: "Quais são seus custos fixos mensais?",
    description: "Ex.: ferramentas, aluguel ou equipe, sem repetir custos por venda.",
    kind: "currency",
    placeholder: "0,00",
    min: 0,
  },
  {
    id: "initialInvestment",
    title: "Quanto pretende investir para começar?",
    description: "Opcional. Usamos apenas para estimar um retorno simples, não capital de giro.",
    kind: "currency",
    placeholder: "0,00",
    min: 0,
  },
];

const digitalEnding: QuestionDefinition[] = [
  physicalEnding[0],
  physicalEnding[1],
  physicalEnding[2],
];

const serviceEnding: QuestionDefinition[] = [
  physicalEnding[1],
  physicalEnding[2],
];

export function getQuestions(kind: OfferKind | ""): QuestionDefinition[] {
  if (!kind) return [TYPE_QUESTION];
  const selling = [...sellingCostQuestions];
  const result = [...commonQuestions, unitCostQuestion(kind)];

  if (kind === "physical") {
    result.push(...physicalQuestions, ...selling, ...physicalEnding);
  } else if (kind === "digital") {
    result.push(...selling, ...digitalEnding);
  } else {
    result.push(...selling, ...serviceEnding);
  }

  return [TYPE_QUESTION, ...result];
}

export function getQuestionCount(kind: OfferKind | ""): number {
  return getQuestions(kind).length;
}

export function isQuestionValid(question: QuestionDefinition, answers: Answers): boolean {
  const value = answers[question.id];
  if (question.kind === "choice") return value === "physical" || value === "digital" || value === "service";
  if (question.kind === "text") return typeof value === "string" && value.trim().length > 0;
  if (value === "") return !question.required;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return false;
  if (question.min !== undefined && numeric < question.min) return false;
  if (question.max !== undefined && numeric > question.max) return false;
  return true;
}

export function numberAnswer(answers: Answers, key: Exclude<AnswerKey, "kind" | "name">): number {
  const value = answers[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

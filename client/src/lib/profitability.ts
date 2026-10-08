import { Answers, numberAnswer } from "./questionnaire";

export interface SimulationInputs {
  price: number;
  monthlyVolume: number;
  unitCost: number;
  packagingCost: number;
  freightCost: number;
  commissionRate: number;
  paymentRate: number;
  paymentFixed: number;
  taxRate: number;
  cac: number;
  returnRate: number;
  fixedCosts: number;
  initialInvestment: number;
}

export interface ProfitabilityResult {
  price: number;
  monthlyVolume: number;
  variableCostPerSale: number;
  contributionPerSale: number;
  contributionRate: number;
  breakEvenUnits: number | null;
  breakEvenRevenue: number | null;
  monthlyResult: number;
  initialInvestment: number;
  estimatedReturnMonths: number | null;
}

export interface Scenario {
  id: "conservative" | "base" | "optimistic";
  name: string;
  assumption: string;
  priceFactor: number;
  volumeFactor: number;
  result: ProfitabilityResult;
}

export function inputsFromAnswers(answers: Answers): SimulationInputs {
  const isPhysical = answers.kind === "physical";
  const hasReturns = answers.kind === "physical" || answers.kind === "digital";
  return {
    price: numberAnswer(answers, "price"),
    monthlyVolume: numberAnswer(answers, "monthlyVolume"),
    unitCost: numberAnswer(answers, "unitCost"),
    packagingCost: isPhysical ? numberAnswer(answers, "packagingCost") : 0,
    freightCost: isPhysical ? numberAnswer(answers, "freightCost") : 0,
    commissionRate: numberAnswer(answers, "commissionRate"),
    paymentRate: numberAnswer(answers, "paymentRate"),
    paymentFixed: numberAnswer(answers, "paymentFixed"),
    taxRate: numberAnswer(answers, "taxRate"),
    cac: numberAnswer(answers, "cac"),
    returnRate: hasReturns ? numberAnswer(answers, "returnRate") : 0,
    fixedCosts: numberAnswer(answers, "fixedCosts"),
    initialInvestment: numberAnswer(answers, "initialInvestment"),
  };
}

export function calculateProfitability(inputs: SimulationInputs): ProfitabilityResult {
  const { price, monthlyVolume } = inputs;
  const percentageCosts =
    (inputs.commissionRate + inputs.paymentRate + inputs.taxRate + inputs.returnRate) / 100;
  const variableCostPerSale =
    inputs.unitCost +
    inputs.packagingCost +
    inputs.freightCost +
    inputs.paymentFixed +
    inputs.cac +
    price * percentageCosts;
  const contributionPerSale = price - variableCostPerSale;
  const contributionRate = price > 0 ? (contributionPerSale / price) * 100 : 0;
  const monthlyResult = contributionPerSale * monthlyVolume - inputs.fixedCosts;
  const breakEvenUnits =
    contributionPerSale > 0 ? Math.ceil(inputs.fixedCosts / contributionPerSale) : null;
  const breakEvenRevenue = breakEvenUnits === null ? null : breakEvenUnits * price;
  const estimatedReturnMonths =
    inputs.initialInvestment > 0 && monthlyResult > 0
      ? inputs.initialInvestment / monthlyResult
      : null;

  return {
    price,
    monthlyVolume,
    variableCostPerSale,
    contributionPerSale,
    contributionRate,
    breakEvenUnits,
    breakEvenRevenue,
    monthlyResult,
    initialInvestment: inputs.initialInvestment,
    estimatedReturnMonths,
  };
}

export function calculateScenarios(inputs: SimulationInputs): Scenario[] {
  const definitions: Array<{
    id: Scenario["id"];
    name: string;
    assumption: string;
    priceFactor: number;
    volumeFactor: number;
  }> = [
    {
      id: "conservative",
      name: "Pessimista",
      assumption: "Preço 5% menor · volume 25% menor",
      priceFactor: 0.95,
      volumeFactor: 0.75,
    },
    {
      id: "base",
      name: "Base",
      assumption: "Preço e volume informados, sem ajuste",
      priceFactor: 1,
      volumeFactor: 1,
    },
    {
      id: "optimistic",
      name: "Otimista",
      assumption: "Preço 5% maior · volume 20% maior",
      priceFactor: 1.05,
      volumeFactor: 1.2,
    },
  ];

  return definitions.map((scenario) => {
    const scenarioInputs = {
      ...inputs,
      price: inputs.price * scenario.priceFactor,
      monthlyVolume: Math.round(inputs.monthlyVolume * scenario.volumeFactor),
    };
    return { ...scenario, result: calculateProfitability(scenarioInputs) };
  });
}

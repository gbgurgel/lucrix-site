import { describe, expect, it } from "vitest";
import { calculateProfitability, calculateScenarios, inputsFromAnswers } from "./profitability";
import { changeOfferKind, getQuestionCount, getQuestions, INITIAL_ANSWERS } from "./questionnaire";

describe("Lucrix estimate model", () => {
  it("keeps each tailored questionnaire within the requested maximum of 15 questions", () => {
    expect(getQuestionCount("physical")).toBe(15);
    expect(getQuestionCount("digital")).toBeLessThanOrEqual(15);
    expect(getQuestionCount("service")).toBeLessThanOrEqual(15);
    expect(getQuestions("physical").map(({ id }) => id)).toEqual(expect.arrayContaining(["packagingCost", "freightCost"]));
    const digitalIds = getQuestions("digital").map(({ id }) => id);
    expect(digitalIds).not.toContain("packagingCost");
    expect(digitalIds).not.toContain("freightCost");
    const serviceQuestions = getQuestions("service");
    expect(serviceQuestions.find(({ id }) => id === "unitCost")?.title).toBe("Qual é o custo de entrega por serviço?");
    expect(serviceQuestions.map(({ id }) => id)).not.toContain("freightCost");
  });

  it("calculates contribution, break-even and simple payback from explicit inputs", () => {
    const result = calculateProfitability({
      price: 50,
      monthlyVolume: 100,
      unitCost: 15,
      packagingCost: 2,
      freightCost: 3,
      commissionRate: 10,
      paymentRate: 3,
      paymentFixed: 0.5,
      taxRate: 5,
      cac: 4,
      returnRate: 1,
      fixedCosts: 600,
      initialInvestment: 3000,
    });

    expect(result.variableCostPerSale).toBe(34);
    expect(result.contributionPerSale).toBe(16);
    expect(result.contributionRate).toBe(32);
    expect(result.breakEvenUnits).toBe(38);
    expect(result.breakEvenRevenue).toBe(1900);
    expect(result.monthlyResult).toBe(1000);
    expect(result.estimatedReturnMonths).toBe(3);
  });

  it("does not invent a break-even point when unit contribution is not positive", () => {
    const result = calculateProfitability({
      price: 20,
      monthlyVolume: 100,
      unitCost: 20,
      packagingCost: 0,
      freightCost: 0,
      commissionRate: 0,
      paymentRate: 0,
      paymentFixed: 0,
      taxRate: 0,
      cac: 0,
      returnRate: 0,
      fixedCosts: 10,
      initialInvestment: 100,
    });

    expect(result.contributionPerSale).toBe(0);
    expect(result.breakEvenUnits).toBeNull();
    expect(result.estimatedReturnMonths).toBeNull();
  });

  it("uses visible, reproducible price and volume assumptions for three scenarios", () => {
    const inputs = {
      price: 100,
      monthlyVolume: 100,
      unitCost: 30,
      packagingCost: 0,
      freightCost: 0,
      commissionRate: 0,
      paymentRate: 0,
      paymentFixed: 0,
      taxRate: 0,
      cac: 0,
      returnRate: 0,
      fixedCosts: 1000,
      initialInvestment: 0,
    };
    const scenarios = calculateScenarios(inputs);
    expect(scenarios.map(({ name }) => name)).toEqual(["Pessimista", "Base", "Otimista"]);
    expect(scenarios.map(({ assumption }) => assumption)).toEqual([
      "Preço 5% menor · volume 25% menor",
      "Preço e volume informados, sem ajuste",
      "Preço 5% maior · volume 20% maior",
    ]);
    expect(scenarios[0].result.monthlyVolume).toBe(75);
    expect(scenarios[1].result.monthlyVolume).toBe(100);
    expect(scenarios[2].result.monthlyVolume).toBe(120);
  });

  it("clears type-specific answers when the offer category changes", () => {
    const physicalAnswers = {
      ...INITIAL_ANSWERS,
      kind: "physical" as const,
      name: "Garrafa",
      price: 100,
      monthlyVolume: 80,
      unitCost: 25,
      packagingCost: 4,
      freightCost: 12,
      returnRate: 8,
    };

    const digitalAnswers = changeOfferKind(physicalAnswers, "digital");
    expect(digitalAnswers.name).toBe("Garrafa");
    expect(digitalAnswers.price).toBe(100);
    expect(digitalAnswers.monthlyVolume).toBe(80);
    expect(digitalAnswers.unitCost).toBe("");
    expect(digitalAnswers.packagingCost).toBe("");
    expect(digitalAnswers.freightCost).toBe("");
    expect(digitalAnswers.returnRate).toBe("");
  });

  it("normalizes hidden costs by offer type even if stale answers reach the calculation", () => {
    const stalePhysicalAnswers = {
      ...INITIAL_ANSWERS,
      kind: "physical" as const,
      price: 100,
      monthlyVolume: 50,
      packagingCost: 5,
      freightCost: 12,
      returnRate: 8,
    };

    const digital = calculateProfitability({
      ...inputsFromAnswers({ ...stalePhysicalAnswers, kind: "digital" }),
      unitCost: 20,
    });
    const service = inputsFromAnswers({ ...stalePhysicalAnswers, kind: "service" });

    expect(digital.variableCostPerSale).toBe(28);
    expect(service.packagingCost).toBe(0);
    expect(service.freightCost).toBe(0);
    expect(service.returnRate).toBe(0);
  });
});

export interface RepairEstimatorInput {
  productId: string;
  componentName: string;
  minPartPriceInr: number;
  maxPartPriceInr: number;
  minLabourPriceInr: number;
  maxLabourPriceInr: number;
  additionalFeesInr?: number; // diagnostic, shipping, etc.
  includeLabour: boolean;
}

export interface RepairEstimatorOutput {
  minTotalInr: number;
  maxTotalInr: number;
  partsRangeInr: [number, number];
  labourRangeInr: [number, number];
  additionalFeesInr: number;
  isPartsOnly: boolean;
  disclaimer: string;
}

export interface RepairVsReplaceInput {
  currentDeviceValueInr?: number; // current resale / residual value
  repairCostInr: number; // estimated repair cost
  remainingLifeMonths: number; // e.g. 18 months
  replacementDevicePriceInr: number; // e.g. 35,000 INR
  replacementLifeMonths: number; // e.g. 36 months
  comparisonPeriodMonths?: number; // e.g. 24 or 36 months
  annualMaintenanceInr?: number;
}

export interface RepairVsReplaceOutput {
  recommendation: 'Repair appears more economical' | 'Replacement appears more economical' | 'Insufficient information for a reliable recommendation';
  confidence: 'High' | 'Moderate' | 'Low';
  upfrontRepairCostInr: number;
  upfrontReplacementCostInr: number;
  monthlyRepairCostInr: number;
  monthlyReplacementCostInr: number;
  breakevenMonths: number;
  netSavingsInr: number;
  costRatioPercent: number; // repair cost / replacement price
  explanation: string[];
  keyFactors: string[];
}

export const CalculatorService = {
  calculateRepairEstimate: (input: RepairEstimatorInput): RepairEstimatorOutput => {
    const additional = input.additionalFeesInr || 0;
    const partsMin = input.minPartPriceInr;
    const partsMax = input.maxPartPriceInr;

    if (!input.includeLabour) {
      return {
        minTotalInr: partsMin + additional,
        maxTotalInr: partsMax + additional,
        partsRangeInr: [partsMin, partsMax],
        labourRangeInr: [0, 0],
        additionalFeesInr: additional,
        isPartsOnly: true,
        disclaimer: 'This figure is a parts-only estimate. Professional technician labour charges and taxes are not included.',
      };
    }

    const minTotal = partsMin + input.minLabourPriceInr + additional;
    const maxTotal = partsMax + input.maxLabourPriceInr + additional;

    return {
      minTotalInr: minTotal,
      maxTotalInr: maxTotal,
      partsRangeInr: [partsMin, partsMax],
      labourRangeInr: [input.minLabourPriceInr, input.maxLabourPriceInr],
      additionalFeesInr: additional,
      isPartsOnly: false,
      disclaimer: 'Complete illustrative repair estimate (parts + estimated local technician bench fee). Actual quote may vary based on internal diagnostic inspection.',
    };
  },

  calculateRepairVsReplace: (input: RepairVsReplaceInput): RepairVsReplaceOutput => {
    const {
      repairCostInr,
      remainingLifeMonths,
      replacementDevicePriceInr,
      replacementLifeMonths,
      currentDeviceValueInr = 0,
    } = input;

    if (repairCostInr <= 0 || replacementDevicePriceInr <= 0 || remainingLifeMonths <= 0 || replacementLifeMonths <= 0) {
      return {
        recommendation: 'Insufficient information for a reliable recommendation',
        confidence: 'Low',
        upfrontRepairCostInr: repairCostInr,
        upfrontReplacementCostInr: replacementDevicePriceInr,
        monthlyRepairCostInr: 0,
        monthlyReplacementCostInr: 0,
        breakevenMonths: 0,
        netSavingsInr: 0,
        costRatioPercent: 0,
        explanation: ['Please provide valid positive values for repair cost, replacement price, and expected lifespans.'],
        keyFactors: ['Missing critical input parameters'],
      };
    }

    // Monthly amortization
    const monthlyRepairCost = Math.round(repairCostInr / remainingLifeMonths);
    const monthlyReplacementCost = Math.round(replacementDevicePriceInr / replacementLifeMonths);

    // Cost ratio: what % of new device is the repair
    const costRatioPercent = Math.round((repairCostInr / replacementDevicePriceInr) * 100);

    // Rule of thumb in electronics lifecycle economics:
    // If repair cost is < 40% of replacement device AND remaining useful life is >= 12 months,
    // repairing is virtually always economically superior.
    // If repair cost is > 65% of replacement device, replacement is usually wiser.
    
    // Net upfront cash saved today by repairing
    const netUpfrontSavings = replacementDevicePriceInr - repairCostInr;

    // Breakeven: how many months of repair use needed before repair is equivalent to buying replacement
    // Breakeven months = repairCostInr / monthlyReplacementCost
    const breakevenMonths = Math.min(
      remainingLifeMonths,
      Math.max(1, Math.round((repairCostInr / monthlyReplacementCost) * 10) / 10)
    );

    let recommendation: RepairVsReplaceOutput['recommendation'];
    let confidence: RepairVsReplaceOutput['confidence'] = 'High';
    const explanation: string[] = [];
    const keyFactors: string[] = [];

    if (monthlyRepairCost <= monthlyReplacementCost && costRatioPercent <= 50) {
      recommendation = 'Repair appears more economical';
      keyFactors.push(`Upfront repair (₹${repairCostInr.toLocaleString('en-IN')}) saves ₹${netUpfrontSavings.toLocaleString('en-IN')} cash immediately.`);
      keyFactors.push(`Repairing amortizes at ₹${monthlyRepairCost.toLocaleString('en-IN')}/mo vs ₹${monthlyReplacementCost.toLocaleString('en-IN')}/mo for the replacement.`);
      keyFactors.push(`Breakeven is achieved in just ${breakevenMonths} months of continued use.`);
      explanation.push(
        `Repairing your current device costs only ${costRatioPercent}% of a new replacement. By keeping the device running for another ${remainingLifeMonths} months, you avoid significant early depreciation.`
      );
    } else if (costRatioPercent > 60 || monthlyRepairCost > monthlyReplacementCost * 1.3) {
      recommendation = 'Replacement appears more economical';
      confidence = costRatioPercent > 70 ? 'High' : 'Moderate';
      keyFactors.push(`Repair cost is high (${costRatioPercent}% of a brand-new device).`);
      keyFactors.push(`A new device offers fresh warranty, modern battery chemistry, and longer OS support.`);
      explanation.push(
        `Spending ₹${repairCostInr.toLocaleString('en-IN')} on an aging device yields a high amortized rate of ₹${monthlyRepairCost.toLocaleString('en-IN')}/month. Upgrading to a new ₹${replacementDevicePriceInr.toLocaleString('en-IN')} device spreads cost over ${replacementLifeMonths} months at ₹${monthlyReplacementCost.toLocaleString('en-IN')}/month with manufacturer warranty coverage.`
      );
    } else {
      // Borderline zone (50% - 60%)
      if (remainingLifeMonths >= 18) {
        recommendation = 'Repair appears more economical';
        confidence = 'Moderate';
        keyFactors.push(`Borderline cost (${costRatioPercent}%), but solid remaining lifespan (${remainingLifeMonths} months) tilts toward repair.`);
        explanation.push(
          `While the repair cost is noticeable, the extended expected life of ${remainingLifeMonths} months makes repairing financially justifiable to preserve cash flow.`
        );
      } else {
        recommendation = 'Replacement appears more economical';
        confidence = 'Moderate';
        keyFactors.push(`Short expected remaining life (${remainingLifeMonths} months) does not adequately justify a ₹${repairCostInr.toLocaleString('en-IN')} repair.`);
        explanation.push(
          `The short remaining horizon (${remainingLifeMonths} mos) makes the effective cost ₹${monthlyRepairCost.toLocaleString('en-IN')}/mo. Investing that budget toward a replacement provides better long-term reliability.`
        );
      }
    }

    return {
      recommendation,
      confidence,
      upfrontRepairCostInr: repairCostInr,
      upfrontReplacementCostInr: replacementDevicePriceInr,
      monthlyRepairCostInr: monthlyRepairCost,
      monthlyReplacementCostInr: monthlyReplacementCost,
      breakevenMonths,
      netSavingsInr: netUpfrontSavings,
      costRatioPercent,
      explanation,
      keyFactors,
    };
  },

  calculateOwnershipCost: (options: {
    initialPriceInr: number;
    years: 3 | 5;
    expectedRepairsCount: number;
    includeBatterySwap: boolean;
    batteryCostInr: number;
    screenRiskProbability: number; // 0 to 1
    screenCostInr: number;
  }) => {
    const { initialPriceInr, years, expectedRepairsCount, includeBatterySwap, batteryCostInr, screenRiskProbability, screenCostInr } = options;
    const batteryCost = includeBatterySwap ? batteryCostInr : 0;
    const expectedScreenCost = Math.round(screenRiskProbability * screenCostInr);
    const routineMaintenance = years === 5 ? 2500 : 1200; // cleaning, port check, cases, screen protectors
    const totalEstimatedOwnership = initialPriceInr + batteryCost + expectedScreenCost + routineMaintenance;
    const monthlyCost = Math.round(totalEstimatedOwnership / (years * 12));

    return {
      totalEstimatedOwnership,
      monthlyCost,
      breakdown: {
        purchase: initialPriceInr,
        batterySwap: batteryCost,
        weightedScreenRisk: expectedScreenCost,
        maintenance: routineMaintenance,
      },
    };
  },
};

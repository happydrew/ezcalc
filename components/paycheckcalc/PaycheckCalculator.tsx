import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

type PayType = "hourly" | "salary";
type PayPeriod = "weekly" | "monthly" | "bi-weekly";
type TaxKey = "Federal Income Tax" | "State Income Tax" | "Local Income Tax" | "Social Security Tax" | "Medicare Tax" | "State Unemployment Insurance(SUI) Tax";
type StateTaxType = "fixed" | "progressive"

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#fb923c"];

export function PaycheckCalculator({
  initPayType = "salary",
  stateTaxType = "fixed",
  stateTaxRate = 0.0307,
  stateTaxBracket,
  localTaxRate = 0.012
}: {
  stateTaxType: StateTaxType,
  initPayType: PayType,
  stateTaxRate?: number,
  stateTaxBracket?: { payBracket?: number, rate: number }[],
  localTaxRate?: number
}) {
  const [payType, setPayType] = useState<PayType>(initPayType);
  const [payPeriod, setPayPeriod] = useState<PayPeriod>("monthly");
  const [showExemptions, setShowExemptions] = useState(false);
  const [showOvertime, setShowOvertime] = useState(false);
  const [inputs, setInputs] = useState({
    hourlyWage: 0,
    hours: 80,
    annualSalary: 55000,
    overtimeWage: 15,
    overtimeHours: 0,
  });
  const [exemptions, setExemptions] = useState<Record<TaxKey, boolean>>({
    "Federal Income Tax": false,
    "State Income Tax": false,
    "Local Income Tax": false,
    "Social Security Tax": false,
    "Medicare Tax": false,
    "State Unemployment Insurance(SUI) Tax": false
  });

  const taxRates = [
    {
      name: 'Federal Income Tax',
      rate: 0.0479
    },
    {
      name: 'State Income Tax',
      rate: stateTaxRate
    },
    {
      name: 'Local Income Tax',
      rate: localTaxRate
    },
    {
      name: 'Social Security Tax',
      rate: 0.062
    },
    {
      name: 'Medicare Tax',
      rate: 0.0145
    },
    {
      name: 'State Unemployment Insurance(SUI) Tax',
      rate: 0.0007
    }
  ];

  const [results, setResults] = useState<{
    gross: number;
    deductions: { name: string; rate: number; amount: number }[];
    net: number;
  } | null>({
    gross: 0,
    deductions: taxRates.map(t => ({ name: t.name, rate: t.rate, amount: 0 })),
    net: 0,
  });

  const calculateGross = () => {
    let gross = 0;
    const { hourlyWage, hours, annualSalary, overtimeWage, overtimeHours } = inputs;

    if (payType === "hourly") {
      gross = hourlyWage * hours;
    } else {
      const divisor = {
        weekly: 52,
        "bi-weekly": 26,
        monthly: 12,
      }[payPeriod];

      gross = annualSalary / divisor;
    }

    return gross + overtimeWage * overtimeHours;
  };

  const calculatePaycheck = () => {
    const gross = calculateGross();
    const divisor = {
      weekly: 52,
      "bi-weekly": 26,
      monthly: 12,
    }[payPeriod];

    const annualSalary = gross * divisor;
    const stateTaxRate = calcStateTaxRate(annualSalary);
    taxRates.forEach(t => {
      if (t.name === "State Income Tax") {
        t.rate = stateTaxRate;
      }
    });

    const deductions = taxRates
      .map(({ name, rate }) => ({
        name: name,
        rate: !!exemptions[name as TaxKey] ? 0 : rate * 100,
        amount: gross * (!!exemptions[name as TaxKey] ? 0 : rate),
      }));

    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);

    setResults({
      gross,
      deductions,
      net: gross - totalDeductions,
    });
  };

  function calcStateTaxRate(annualSalary: number) {
    if (stateTaxType === "fixed") {
      return stateTaxRate;
    } else {
      const bracket = stateTaxBracket.slice(0, stateTaxBracket.length - 1).find(b => annualSalary <= b.payBracket);
      if (bracket) {
        return bracket.rate;
      } else {
        return stateTaxBracket[stateTaxBracket.length - 1].rate;
      }
    }
  }

  const chartData = results ? [
    { name: "Net Pay", value: results.net },
    ...results.deductions.map(d => ({ name: d.name, value: d.amount }))
  ] : [];

  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    calculatePaycheck();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 rounded-xl border border-gray-200 mb-10">
      <div className="border border-gray-200 rounded-lg p-2 space-y-2">
        {/* Pay Type Selection */}
        <div className="mb-3 border border-gray-200 rounded-lg p-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">Paycheck Type</label>
          <div className="flex gap-4">
            {(["salary", "hourly"] as const).map((type) => (
              <label key={type} className="flex items-center space-x-2 flex-1">
                <input
                  type="radio"
                  checked={payType === type}
                  onChange={() => setPayType(type)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="mb-3 bg-gray-100 rounded-lg p-2 space-y-2">
          {payType === "hourly" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Wage ($)</label>
                <input
                  type="number"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  value={inputs.hourlyWage}
                  onChange={(e) => setInputs(p => ({ ...p, hourlyWage: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours (per pay period)
                </label>
                <input
                  type="number"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  value={inputs.hours}
                  onChange={(e) => setInputs(p => ({ ...p, hours: Number(e.target.value) }))}
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary ($)</label>
              <input
                type="number"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                value={inputs.annualSalary}
                onChange={(e) => setInputs(p => ({ ...p, annualSalary: Number(e.target.value) }))}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Overtime Section */}
      <div className="mt-6 mb-3 py-2 px-6 mx-3 bg-gray-100 rounded-lg">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowOvertime(!showOvertime)}
        >
          <span className="text-sm font-medium text-gray-700">Add Overtime</span>
          <span className="text-lg">{showOvertime ? "−" : "+"}</span>
        </div>

        {showOvertime && (
          <div className="mt-3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overtime Hourly Wage ($)
              </label>
              <input
                type="number"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                value={inputs.overtimeWage}
                onChange={(e) => setInputs(p => ({ ...p, overtimeWage: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overtime Hours (per pay period)
              </label>
              <input
                type="number"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                value={inputs.overtimeHours}
                onChange={(e) => setInputs(p => ({ ...p, overtimeHours: Number(e.target.value) }))}
              />
            </div>
          </div>
        )}
      </div>

      <div className="py-3 px-6 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period</label>
        <select
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          value={payPeriod}
          onChange={(e) => setPayPeriod(e.target.value as PayPeriod)}
        >
          {["weekly", "bi-weekly", "monthly"].map(opt => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Tax Exemptions Accordion */}
      <div className="mt-3 mb-6 mx-3 p-2 bg-gray-100 rounded-lg space-y-3">
        <div
          className="flex items-center justify-between rounded-lg cursor-pointer"
          onClick={() => setShowExemptions(!showExemptions)}
        >
          <span className="text-sm font-medium text-gray-700">Tax Exemptions</span>
          <span className="text-lg">{showExemptions ? "−" : "+"}</span>
        </div>

        {showExemptions && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-3">
            {Object.entries(exemptions).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setExemptions(prev => ({
                    ...prev,
                    [key]: e.target.checked,
                  }))}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {key}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={calculatePaycheck}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Calculate
      </button>

      <div id="net-pay" className="flex justify-center items-center my-6 text-lg text-zinc-700">
        Take Home:<span className="text-2xl font-semibold text-green-500 mx-2">${results.net.toFixed(2)}</span>
      </div>

      {results && (
        <div className="mt-8 space-y-6 border border-gray-200 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Where is your money going?</h2>

          {/* Gross Pay */}
          <div className="">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Gross Pay</h3>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-semibold text-blue-600">
                ${results.gross.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Deductions</h3>
            <div className="space-y-2">
              {results.deductions.map((d, i) => (
                <div
                  key={d.name}
                  className="p-3 rounded-lg flex justify-between items-center"
                  style={{ backgroundColor: COLORS[i] + '20' }}
                >
                  <div>
                    <span className="font-medium text-gray-700">{d.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({d.rate.toFixed(3)}%)</span>
                  </div>
                  <span className="text-gray-700">-${d.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Net Pay */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Take Home</h3>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-semibold text-green-600">
                ${results.net.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Pie Chart */}
          <div >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pay Distribution</h3>
            <div className="flex justify-center">
              <PieChart width={300} height={300}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  activeIndex={activeIndex}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? COLORS[5] : COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              </PieChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
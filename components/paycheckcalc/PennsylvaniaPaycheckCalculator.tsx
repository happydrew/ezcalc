import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

type PayType = "hourly" | "salary";
type PayPeriod = "weekly" | "monthly" | "bi-weekly";
type TaxKey = "Federal Income Tax" | "State Income Tax" | "Local Income Tax" | "Social Security Tax" | "Medicare Tax" | "State Unemployment Insurance(SUI) Tax";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#fb923c"];

export function PennsylvaniaPaycheckCalculator({ stateTaxRate = 0.0307, localTaxRate = 0.012 }: { stateTaxRate?: number, localTaxRate?: number }) {
  const [payType, setPayType] = useState<PayType>("salary");
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

  const chartData = results ? [
    { name: "Net Pay", value: results.net },
    ...results.deductions.map(d => ({ name: d.name, value: d.amount }))
  ] : [];

  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    calculatePaycheck();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Pennsylvania Paycheck Calculator</h1>

      {/* 新增SEO介绍段落 - 上方 */}
      <div className="mb-8 prose prose-blue max-w-none">
        <p className="text-gray-600 mb-4">
          Use this <strong>salary calculator PA</strong> to accurately estimate your take-home pay in Pennsylvania.
          This <strong>hourly paycheck calculator PA</strong> supports both salaried and hourly wage calculations,
          with options for weekly, bi-weekly and monthly pay periods. Calculate net pay after federal,
          state and local taxes in compliance with Pennsylvania tax laws.
        </p>
      </div>

      {/* Pay Type Selection */}
      <div></div>
      <div className="mb-6">
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
      <div className="space-y-4 mb-6">
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

        {/* Add Overtime Section */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
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

        <div>
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
      </div>

      {/* Tax Exemptions Accordion */}
      <div className="mb-6">
        <div
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
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
                    <span className="text-sm text-gray-500 ml-2">({d.rate.toFixed(2)}%)</span>
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
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              </PieChart>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 prose prose-sm md:prose max-w-none text-gray-600">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pennsylvania Paycheck Calculator Guide</h2>

        <h3 className="font-medium text-gray-700 mb-2">How to Use This Calculator</h3>
        <p className="mb-4">
          This <strong>weekly paycheck calculator PA</strong> offers two input modes:
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Salary mode</strong>: Enter your annual salary and select pay period</li>
            <li><strong>Hourly mode</strong>: Enter hourly wage and hours per pay period</li>
          </ul>
          The <strong>PA paycheck calculator</strong> automatically factors in:
        </p>

        <h3 className="font-medium text-gray-700 mb-2">Tax Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Federal Taxes</h4>
            <p>Progressive rates from 10% to 37% based on income brackets</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2">PA State Tax</h4>
            <p>Flat 3.07% rate for all income levels</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium mb-2">Local Taxes</h4>
            <p>Vary by municipality (e.g. Philadelphia 3.8808%, Pittsburgh 3%)</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium mb-2">FICA Taxes</h4>
            <p>Social Security (6.2%) + Medicare (1.45%)</p>
          </div>
        </div>

        <h3 className="font-medium text-gray-700 mb-2">Special Considerations</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Philadelphia residents pay <strong>additional wage tax</strong> (3.8808%)</li>
          <li>Local Earned Income Tax (EIT) rates range from 0.5% to 3.9%</li>
          <li>No tax exemptions for Social Security benefits</li>
        </ul>

        <h3 className="font-medium text-gray-700 mb-2">Why Use Our Calculator?</h3>
        <p className="mb-4">
          This <strong>PA salary calculator</strong> provides the most accurate estimate for:
          <ul className="list-disc pl-6">
            <li><strong>Hourly workers</strong> needing a <strong>PA hourly paycheck calculator</strong></li>
            <li>Contractors calculating <strong>bi-weekly paycheck PA</strong> amounts</li>
            <li>Employees verifying withholdings with <strong>PA payroll calculator</strong></li>
          </ul>
        </p>

        <div className="bg-purple-50 p-4 rounded-lg mt-6">
          <h4 className="font-medium text-purple-800 mb-2">Update Notice</h4>
          <p className="text-sm">
            Tax rates updated for 2023-2024 fiscal year. Includes latest SUI changes.
            For complex cases like multiple jobs or tax credits, consult a tax professional.
          </p>
        </div>
      </div>
    </div>
  );
}
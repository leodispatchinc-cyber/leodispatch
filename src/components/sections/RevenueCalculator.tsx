"use client";

import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { equipmentPresets } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

const MPG = 6.5; // average loaded truck

export default function RevenueCalculator() {
  const [equipment, setEquipment] = useState(equipmentPresets[2].type); // Dry Van
  const [miles, setMiles] = useState(2500);
  const [rpm, setRpm] = useState(equipmentPresets[2].rpm);
  const [fuel, setFuel] = useState(3.9);

  const onEquipment = (type: string) => {
    setEquipment(type);
    const preset = equipmentPresets.find((e) => e.type === type);
    if (preset) setRpm(preset.rpm);
  };

  const { weekly, monthly, yearly, gross, fuelCost } = useMemo(() => {
    const gross = miles * rpm;
    const fuelCost = (miles / MPG) * fuel;
    const weekly = Math.max(gross - fuelCost, 0);
    return { gross, fuelCost, weekly, monthly: weekly * 4.33, yearly: weekly * 52 };
  }, [miles, rpm, fuel]);

  return (
    <section id="calculator" className="container-x scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow="Revenue Calculator"
        title={<>See what your truck can <span className="text-gradient-gold">really earn</span></>}
        subtitle="Adjust the numbers to your operation. Estimated net revenue after fuel."
      />

      <Reveal className="mx-auto mt-14 max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Inputs */}
          <div className="rounded-3xl border border-line bg-surface p-7">
            <label className="mb-2 block text-sm font-medium text-muted">Equipment Type</label>
            <div className="mb-7 flex flex-wrap gap-2">
              {equipmentPresets.map((e) => (
                <button
                  key={e.type}
                  onClick={() => onEquipment(e.type)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    equipment === e.type
                      ? "bg-yellow text-black"
                      : "border border-line text-muted hover:text-paper"
                  }`}
                >
                  {e.type}
                </button>
              ))}
            </div>

            <Slider label="Weekly Miles" value={miles} min={500} max={4000} step={50} onChange={setMiles} display={miles.toLocaleString()} />
            <Slider label="Rate Per Mile (RPM)" value={rpm} min={1} max={4} step={0.05} onChange={setRpm} display={`$${rpm.toFixed(2)}`} />
            <Slider label="Fuel Price / Gallon" value={fuel} min={2.5} max={6} step={0.1} onChange={setFuel} display={`$${fuel.toFixed(2)}`} />
          </div>

          {/* Output */}
          <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-b from-surface-2 to-ink p-7 ring-gold">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow/15 blur-3xl" />
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-yellow/10 px-3 py-1 text-xs font-semibold text-gold">
              <TrendingUp className="h-3.5 w-3.5" /> Estimated Earnings
            </div>

            <div className="space-y-4">
              <Result label="Weekly Revenue" value={formatCurrency(weekly)} big />
              <div className="grid grid-cols-2 gap-4">
                <Result label="Monthly" value={formatCurrency(monthly)} />
                <Result label="Yearly" value={formatCurrency(yearly)} accent />
              </div>
            </div>

            <div className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
              <Row label="Gross line haul (weekly)" value={formatCurrency(gross)} />
              <Row label="Estimated fuel (weekly)" value={`– ${formatCurrency(fuelCost)}`} muted />
            </div>

            <a
              href="/onboarding"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-yellow px-6 py-3.5 text-sm font-semibold text-black transition-all hover:bg-gold"
            >
              Start Earning This — Apply Now
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Slider({
  label, value, min, max, step, onChange, display,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (n: number) => void; display: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className="font-display text-lg font-bold text-yellow">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none"
        style={{
          background: `linear-gradient(90deg, #ffd000 ${pct}%, #262626 ${pct}%)`,
        }}
      />
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffd000;
          border: 3px solid #000;
          box-shadow: 0 0 12px rgba(255, 208, 0, 0.6);
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffd000;
          border: 3px solid #000;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function Result({ label, value, big, accent }: { label: string; value: string; big?: boolean; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border border-line bg-ink/60 p-4 ${big ? "" : ""}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className={`font-display font-extrabold ${big ? "text-4xl" : "text-2xl"} ${accent ? "text-gradient-gold" : "text-paper"}`}>
        {value}
      </div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className={muted ? "text-muted" : "font-medium text-paper"}>{value}</span>
    </div>
  );
}

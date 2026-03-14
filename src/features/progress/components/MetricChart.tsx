interface MetricChartProps {
  data: { label: string; value: number }[];
  title: string;
}

export function MetricChart({ data, title }: MetricChartProps) {
  const maxValue = 100;
  const barWidth = data.length > 0 ? Math.min(32, Math.max(12, 300 / data.length)) : 20;

  return (
    <div className="rounded-xl bg-[#1a1a2e] p-5">
      <h4 className="mb-4 text-sm font-medium text-[#94a3b8]">{title}</h4>

      {data.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-xs text-[#4a4a6a]">
          No data yet
        </div>
      ) : (
        <div className="flex items-end gap-1" style={{ height: 160 }}>
          {/* Y-axis labels */}
          <div className="flex h-full flex-col justify-between pb-5 pr-2">
            {[100, 50, 0].map((v) => (
              <span key={v} className="font-mono text-[10px] text-[#4a4a6a]">
                {v}
              </span>
            ))}
          </div>

          {/* Bars */}
          <div className="flex flex-1 items-end gap-1 overflow-x-auto">
            {data.map((d, i) => {
              const pct = Math.max(2, (d.value / maxValue) * 100);
              const color =
                d.value >= 80
                  ? "bg-emerald-500"
                  : d.value >= 60
                    ? "bg-amber-500"
                    : "bg-red-400";

              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1"
                  style={{ width: barWidth }}
                >
                  <div
                    className="relative w-full"
                    style={{ height: 120 }}
                  >
                    <div
                      className={`absolute bottom-0 w-full rounded-t ${color} transition-all duration-300`}
                      style={{
                        height: `${pct}%`,
                        opacity: 0.8 + (d.value / maxValue) * 0.2,
                      }}
                    />
                  </div>
                  <span className="max-w-full truncate font-mono text-[9px] text-[#4a4a6a]">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

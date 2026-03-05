import { useAppStore } from '../../store/useAppStore'

function formatTime(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
}

export default function TimeSlider() {
  const sunTime = useAppStore((s) => s.sunTime)
  const setSunTime = useAppStore((s) => s.setSunTime)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-white/70 uppercase tracking-wide">
          Sun Time
        </label>
        <span className="text-xs font-mono text-amber-300">
          {formatTime(sunTime)}
        </span>
      </div>
      <input
        type="range"
        min={5}
        max={20}
        step={0.25}
        value={sunTime}
        onChange={(e) => setSunTime(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer
          bg-gradient-to-r from-indigo-900 via-amber-400 to-orange-600
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  )
}

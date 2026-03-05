import { useAppStore } from '../../store/useAppStore'

export default function ClipSlider() {
  const clippingHeight = useAppStore((s) => s.clippingHeight)
  const setClippingHeight = useAppStore((s) => s.setClippingHeight)
  const floorHeight = useAppStore((s) => s.floorPlan.settings.floorHeight)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-white/70 uppercase tracking-wide">
          Section Cut
        </label>
        <span className="text-xs font-mono text-cyan-300">
          {clippingHeight.toFixed(1)}m
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={floorHeight}
        step={0.05}
        value={clippingHeight}
        onChange={(e) => setClippingHeight(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer
          bg-gradient-to-r from-cyan-600 to-slate-600
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  )
}

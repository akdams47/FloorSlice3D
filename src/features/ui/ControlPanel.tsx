import { useAppStore } from '../../store/useAppStore'
import TimeSlider from './TimeSlider'
import ClipSlider from './ClipSlider'

export default function ControlPanel() {
  const isAnimating = useAppStore((s) => s.isAnimating)
  const startFlythrough = useAppStore((s) => s.startFlythrough)
  const activeRoom = useAppStore((s) => s.activeRoom)
  const floorPlan = useAppStore((s) => s.floorPlan)

  const activeLabel = floorPlan.rooms.find((r) => r.id === activeRoom)?.label

  return (
    <div
      className="absolute top-4 right-4 w-56 sm:w-64 pointer-events-auto
        rounded-xl border border-white/10
        bg-black/60 backdrop-blur-xl
        shadow-2xl shadow-black/30
        p-3 sm:p-4 flex flex-col gap-3 sm:gap-4"
    >
      <h2 className="text-sm font-semibold text-white/90 tracking-wide">
        FloorSlice3D
      </h2>

      <TimeSlider />
      <ClipSlider />

      <div className="flex flex-col gap-2">
        <button
          onClick={startFlythrough}
          disabled={isAnimating}
          className="w-full py-2 px-3 rounded-lg text-sm font-medium
            transition-all duration-200
            bg-indigo-600 hover:bg-indigo-500 text-white
            disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed
            active:scale-[0.98]"
        >
          {isAnimating ? 'Flying...' : 'Start Fly-Through'}
        </button>

        {isAnimating && activeLabel && (
          <div className="text-center text-xs text-white/50">
            Visiting: <span className="text-white/80">{activeLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}

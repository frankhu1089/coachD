import CatView from '../CatView'

interface Props {
  unresolvedCount: number
  todayAction: number
  catSpeech: string
}

export default function HomeCatHero({ unresolvedCount, todayAction, catSpeech }: Props) {
  return (
    <div className="flex flex-col items-center pt-2 pb-2 animate-fade-up" style={{ animationDelay: '0ms' }}>
      <div className="cat-portrait w-[108px] h-[108px]">
        <CatView
          expression={unresolvedCount > 0 ? 'sideEye' : todayAction > 0 ? 'gentleSmile' : 'neutral'}
          size={86}
        />
      </div>
      <p className="font-serif italic text-[13px] text-textSecondary mt-3 text-center max-w-[220px] leading-relaxed">
        「{catSpeech}」
      </p>
    </div>
  )
}

export type WorkoutSection = { title: string; items: string[] }
export type WorkoutPlan = {
  label: string; emoji: string
  warm: WorkoutSection; main: WorkoutSection; cool: WorkoutSection
}

export const workoutPlans: Record<string, WorkoutPlan> = {
  chest: {
    label: '胸', emoji: '💪',
    warm: { title: '熱身', items: ['手臂繞環 20 次', '胸肌動態伸展 30 秒', '肩膀活動 10 次'] },
    main: { title: '主訓練', items: ['伏地挺身 3×15', '寬距伏地挺身 3×12', '鑽石伏地挺身 2×10', '毛毛蟲爬行 3 次'] },
    cool: { title: '收操', items: ['胸肌靜態伸展 45 秒', '肩後側伸展 30 秒', '深呼吸放鬆'] },
  },
  legs: {
    label: '腿', emoji: '🦵',
    warm: { title: '熱身', items: ['腿部繞環 20 次', '臀橋 10 下', '深蹲暖身 10 下（輕鬆）'] },
    main: { title: '主訓練', items: ['深蹲 3×15', '弓步蹲 3×12（每側）', '側弓步蹲 2×10（每側）', '臀橋 3×15'] },
    cool: { title: '收操', items: ['股四頭肌伸展 45 秒', '臀肌伸展 45 秒', '小腿伸展 30 秒'] },
  },
  both: {
    label: '胸＋腿', emoji: '🔥',
    warm: { title: '熱身', items: ['開合跳 30 秒', '手臂繞環 20 次', '深蹲暖身 8 下'] },
    main: { title: '主訓練', items: ['深蹲 3×12', '伏地挺身 3×10', '弓步蹲 2×10（每側）', '波比跳 2×8'] },
    cool: { title: '收操', items: ['胸肌伸展 30 秒', '股四頭肌伸展 30 秒', '全身放鬆伸展 60 秒'] },
  },
  cardio: {
    label: '有氧', emoji: '🏃',
    warm: { title: '熱身', items: ['原地踏步 1 分鐘', '動態腿部伸展', '手臂繞環放鬆'] },
    main: { title: '主訓練', items: ['高抬腿 3×30 秒', '開合跳 3×30 秒', '波比跳 3×10', '登山者式 3×20 秒'] },
    cool: { title: '收操', items: ['慢走緩和 2 分鐘', '深呼吸 10 次', '全身靜態伸展'] },
  },
  core: {
    label: '核心', emoji: '⚡',
    warm: { title: '熱身', items: ['貓牛式 10 次', '鳥狗式 8 次（每側）', '骨盆旋轉 10 次'] },
    main: { title: '主訓練', items: ['棒式 3×30 秒', '捲腹 3×15', '俄羅斯轉體 2×20', '側棒式 2×20 秒（每側）'] },
    cool: { title: '收操', items: ['兒童式 45 秒', '仰臥扭腰 30 秒（每側）', '大字放鬆 1 分鐘'] },
  },
  stretch: {
    label: '拉筋', emoji: '🧘',
    warm: { title: '暖身活動', items: ['輕鬆原地踏步 2 分鐘', '頸部緩慢轉動 8 次'] },
    main: { title: '伸展動作', items: ['頸部側拉 30 秒（每側）', '肩膀交叉伸展 30 秒', '胸肌門框伸展 45 秒', '大腿前側伸展 45 秒（每側）', '臀肌鴿式 45 秒（每側）', '小腿伸展 30 秒'] },
    cool: { title: '收尾', items: ['大字形仰躺放鬆 1 分鐘', '深呼吸冥想 5 次'] },
  },
}

export const workoutPlanKeys = ['chest', 'legs', 'both', 'cardio', 'core', 'stretch'] as const
export type WorkoutPlanKey = typeof workoutPlanKeys[number]

export const excuses = [
  '疲累一天', '時間不夠', '心情不好', '工作太忙',
  '身體不適', '不想出門', '休息一下', '其他',
]

export const suggestions = [
  '走個小圈，繞社區一圈就好',
  '伸展或動物流 5 分鐘',
  '伏地挺身 + 深蹲各 10 下',
  '跳繩 50 下',
  '從椅子上起立蹲坐 15 次',
]

export function suggestionsFor(excuse: string): string[] {
  switch (excuse) {
    case '疲累一天':  return ['輕鬆伸展 5 分鐘', '慢慢走個小圈']
    case '時間不夠':  return ['5 分鐘 HIIT', '快速深蹲 + 伏地挺身各 10 下']
    case '心情不好':  return ['出門散個步', '瑜珈或伸展放鬆']
    case '工作太忙':  return ['辦公桌伸展 3 分鐘', '5 分鐘起身活動']
    case '身體不適':  return ['輕柔伸展', '好好休息也是一種選擇']
    case '不想出門':  return ['室內深蹲 15 下', '伏地挺身 + 捲腹各 10 下']
    case '休息一下':  return ['動 5 分鐘再休息', '站起來走動一下就好']
    default:          return suggestions
  }
}

export function autoContext(): string {
  const hour = new Date().getHours()
  return hour >= 17 && hour <= 21 ? '下班後' : '假日下午'
}

export function displayExcuse(excuse: string, customNote?: string): string {
  if (excuse === '其他' && customNote && customNote.trim()) return customNote
  return excuse
}

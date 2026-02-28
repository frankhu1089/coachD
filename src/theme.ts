export const excuses = [
  '太累', '沒時間', '心情不好', '工作太忙',
  '身體不舒服', '懶得出門', '想休息一下', '其他',
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
    case '太累':      return ['輕鬆伸展 5 分鐘', '慢慢走個小圈']
    case '沒時間':    return ['5 分鐘 HIIT', '快速深蹲 + 伏地挺身各 10 下']
    case '心情不好':  return ['出門散個步', '瑜珈或伸展放鬆']
    case '工作太忙':  return ['辦公桌伸展 3 分鐘', '5 分鐘起身活動']
    case '身體不舒服': return ['輕柔伸展', '好好休息也是一種選擇']
    case '懶得出門':  return ['室內深蹲 15 下', '伏地挺身 + 捲腹各 10 下']
    case '想休息一下': return ['動 5 分鐘再休息', '站起來走動一下就好']
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

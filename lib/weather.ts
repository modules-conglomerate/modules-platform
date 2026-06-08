
export interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  wind_speed: number
  condition: string
  condition_icon: string
  feels_like: number
}

const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Ясно',          icon: '☀️' },
  1:  { label: 'Преимущественно ясно', icon: '🌤' },
  2:  { label: 'Переменная облачность', icon: '⛅' },
  3:  { label: 'Пасмурно',      icon: '☁️' },
  45: { label: 'Туман',         icon: '🌫' },
  48: { label: 'Изморозь',      icon: '🌫' },
  51: { label: 'Морось',        icon: '🌦' },
  61: { label: 'Дождь',         icon: '🌧' },
  63: { label: 'Умеренный дождь', icon: '🌧' },
  65: { label: 'Сильный дождь', icon: '🌧' },
  71: { label: 'Снег',          icon: '❄️' },
  73: { label: 'Умеренный снег', icon: '❄️' },
  75: { label: 'Сильный снег',  icon: '❄️' },
  77: { label: 'Снежная крупа', icon: '🌨' },
  80: { label: 'Ливень',        icon: '🌦' },
  85: { label: 'Метель',        icon: '🌨' },
  95: { label: 'Гроза',         icon: '⛈' },
}

export async function getWeather(lat: number, lng: number): Promise<WeatherData | null> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', lat.toString())
    url.searchParams.set('longitude', lng.toString())
    url.searchParams.set('current', [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'surface_pressure',
      'wind_speed_10m',
      'weathercode',
    ].join(','))
    url.searchParams.set('timezone', 'Europe/Moscow')
    url.searchParams.set('wind_speed_unit', 'ms')

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } })
    if (!res.ok) return null

    const data = await res.json()
    const c = data.current

    const wmo = WMO_CODES[c.weathercode] ?? { label: 'Неизвестно', icon: '🌡' }

    return {
      temperature:  Math.round(c.temperature_2m),
      humidity:     Math.round(c.relative_humidity_2m),
      pressure:     Math.round(c.surface_pressure * 0.750064),
      wind_speed:   Math.round(c.wind_speed_10m),
      feels_like:   Math.round(c.apparent_temperature),
      condition:    wmo.label,
      condition_icon: wmo.icon,
    }
  } catch {
    return null
  }
}

export async function getWeatherForObjects(
  objects: { id: string; lat: number | null; lng: number | null; region: string | null }[]
) {
  const results: Record<string, WeatherData | null> = {}
  const withCoords = objects.filter(o => o.lat && o.lng)

  await Promise.all(
    withCoords.map(async function(obj) {
      results[obj.id] = await getWeather(obj.lat!, obj.lng!)
    })
  )

  return results
}

export const getHeaderToken = (token: string, lang?: string) => {
  const result: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  }

  if (lang) {
    result['Accept-Language'] = lang
  }

  return result
}
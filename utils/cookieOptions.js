// utils/cookieOptions.js
export const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    secure: isProd,                 //  only true in production
    sameSite: isProd ? 'strict' : 'lax',
    path: '/',
    domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
  }
}

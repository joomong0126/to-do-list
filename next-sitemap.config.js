/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://to-do-list-fawn-nine.vercel.app', // 실제 도메인으로 변경
  generateRobotsTxt: true, // robots.txt 파일 자동 생성
  sitemapSize: 7000, // 각 사이트맵 파일당 최대 URL 수
  changefreq: 'daily',
  priority: 0.7,
  
  // 특정 페이지 제외
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/server-sitemap-index.xml', // 동적 사이트맵이 있다면
  ],
  
  // 동적 사이트맵 추가 (필요한 경우)
  additionalPaths: async (config) => [
    await config.transform(config, '/custom-page'),
  ],
  
  // robots.txt 설정
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    additionalSitemaps: [
      'https://to-do-list-fawn-nine.vercel.app/sitemap.xml', // 실제 도메인으로 변경
    ],
  },
  
  // 페이지별 우선순위 설정
  transform: async (config, path) => {
    // 메인 페이지
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }
    
    // 기본 설정
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
} 
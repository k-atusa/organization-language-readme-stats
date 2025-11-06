import { NextRequest } from 'next/server';
import { aggregateOrganizationLanguages, AggregatedLanguageStats } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const generateSVG = (languages: AggregatedLanguageStats[], organization: string): string => {
  
  // 바 그래프용 좌표 계산
  let currentX = 0;
  const barHeight = 8;
  const barWidth = 460;
  const borderRadius = 4;
  
  // 전체를 하나의 그룹으로 만들고 clipPath 사용
  const barSegments = languages.map((lang, index) => {
    const width = (lang.percentage / 100) * barWidth;
    const x = currentX;
    const segment = `<rect x="${x}" y="0" width="${width}" height="${barHeight}" fill="${lang.color}"/>`;
    currentX += width;
    return segment;
  }).join('\n      ');
  
  // clipPath를 사용하여 전체 바의 양 끝만 둥글게
  const clipPathId = `rounded-bar-${Math.random().toString(36).substr(2, 9)}`;
  const barWithClipPath = `
    <defs>
      <clipPath id="${clipPathId}">
        <rect x="0" y="0" width="${barWidth}" height="${barHeight}" rx="${borderRadius}"/>
      </clipPath>
    </defs>
    <g clip-path="url(#${clipPathId})">
      ${barSegments}
    </g>`;

  // 언어 리스트 (2열)
  const halfLength = Math.ceil(languages.length / 2);
  const leftColumn = languages.slice(0, halfLength);
  const rightColumn = languages.slice(halfLength);

  const createLanguageItem = (lang: AggregatedLanguageStats, index: number) => {
    const y = 80 + index * 35;
    return `
      <g transform="translate(20, ${y})">
        <circle cx="8" cy="0" r="8" fill="${lang.color}"/>
        <text x="25" y="5" class="lang-name">${lang.language}</text>
        <text x="180" y="5" class="lang-percent">${lang.percentage.toFixed(2)}%</text>
      </g>`;
  };

  const createLanguageItemRight = (lang: AggregatedLanguageStats, index: number) => {
    const y = 80 + index * 35;
    return `
      <g transform="translate(270, ${y})">
        <circle cx="8" cy="0" r="8" fill="${lang.color}"/>
        <text x="25" y="5" class="lang-name">${lang.language}</text>
        <text x="180" y="5" class="lang-percent">${lang.percentage.toFixed(2)}%</text>
      </g>`;
  };

  const leftItems = leftColumn.map((lang, i) => createLanguageItem(lang, i)).join('\n');
  const rightItems = rightColumn.map((lang, i) => createLanguageItemRight(lang, i)).join('\n');

  const totalHeight = 50 + Math.max(leftColumn.length, rightColumn.length) * 35 + 30;

  const svg = `
    <svg width="500" height="${totalHeight}" viewBox="0 0 500 ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .title { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          font-size: 24px;
          font-weight: 700;
          fill: #2b7de9;
        }
        .lang-name { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          font-size: 16px;
          font-weight: 600;
          fill: #333;
        }
        .lang-percent { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          font-size: 16px;
          font-weight: 600;
          fill: #666;
        }
      </style>

      <!-- Background with border -->
      <rect width="500" height="${totalHeight}" fill="white" rx="10"/>
      <rect width="500" height="${totalHeight}" fill="none" stroke="#e0e0e0" stroke-width="1" rx="10"/>
      
      <!-- Title -->
      <text x="20" y="35" class="title">Most Used Languages</text>
      
      <!-- Language Bar -->
      <g transform="translate(20, 50)">
        ${barWithClipPath}
      </g>

      <!-- Language List -->
      ${leftItems}
      ${rightItems}
    </svg>
  `;

  return svg;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ organization: string }> }
) => {
  try {
    const { organization } = await params;

    if (!organization) {
      return new Response('Organization name is required', { status: 400 });
    }

    // 잘못된 요청 필터링 (favicon, robots.txt 등)
    const invalidPaths = ['favicon.ico', 'robots.txt', 'sitemap.xml', 'apple-touch-icon.png'];
    if (invalidPaths.includes(organization.toLowerCase()) || organization.includes('.')) {
      return new Response('Not Found', { status: 404 });
    }

    // GitHub API에서 실제 데이터 가져오기
    let languages = await aggregateOrganizationLanguages(organization);

    // 쿼리 파라미터 처리
    const { searchParams } = new URL(request.url);
    const excludeParam = searchParams.get('exclude');
    const maxParam = searchParams.get('max');
    
    // 1. 제외할 언어 처리
    if (excludeParam) {
      // 쉼표로 분리하고 대소문자 구분 없이 처리
      const excludeList = excludeParam
        .split(',')
        .map(lang => lang.trim().toLowerCase())
        .filter(lang => lang.length > 0);
      
      if (excludeList.length > 0) {
        // 제외할 언어를 필터링
        languages = languages.filter(
          lang => !excludeList.includes(lang.language.toLowerCase())
        );
        
        // 제외 후 남은 언어들의 비율을 다시 계산
        const totalBytes = languages.reduce((sum, lang) => sum + lang.bytes, 0);
        if (totalBytes > 0) {
          languages = languages.map(lang => ({
            ...lang,
            percentage: (lang.bytes / totalBytes) * 100,
          }));
        }
      }
    }

    // 2. 최대 언어 개수 처리
    if (maxParam) {
      const maxLanguages = parseInt(maxParam);
      if (maxLanguages > 0 && languages.length > maxLanguages) {
        // 상위 n개만 표시하고 나머지는 ETC로 묶기
        const topLanguages = languages.slice(0, maxLanguages);
        const etcLanguages = languages.slice(maxLanguages);
        
        // ETC 항목 생성
        const etcBytes = etcLanguages.reduce((sum, lang) => sum + lang.bytes, 0);
        const totalBytes = languages.reduce((sum, lang) => sum + lang.bytes, 0);
        
        if (etcBytes > 0) {
          const etcItem: AggregatedLanguageStats = {
            language: 'ETC',
            bytes: etcBytes,
            percentage: (etcBytes / totalBytes) * 100,
            color: '#000000', // 검은색
          };
          
          languages = [...topLanguages, etcItem];
        } else {
          languages = topLanguages;
        }
      }
    }

    if (languages.length === 0) {
      return new Response(
        `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="100">
          <text x="250" y="50" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#666">
            No language data found for organization: ${organization}
          </text>
        </svg>`,
        {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=300, s-maxage=300',
          },
        }
      );
    }

    const svg = generateSVG(languages, organization);

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating SVG:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // 더 친절한 에러 메시지 제공
    let displayMessage = errorMessage;
    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      const { organization } = await params;
      displayMessage = `Organization '${organization}' not found`;
    } else if (errorMessage.includes('403') || errorMessage.includes('rate limit')) {
      displayMessage = 'GitHub API rate limit exceeded. Please try again later.';
    }
    
    return new Response(
      `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="120">
        <rect width="500" height="120" fill="white" rx="10"/>
        <text x="250" y="50" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ff0000">
          Error
        </text>
        <text x="250" y="80" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#666">
          ${displayMessage}
        </text>
      </svg>`,
      { 
        status: 500,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
};

import { LanguageStatsData } from '@/types/language';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// 임시 Mock 데이터 생성 함수
const getMockData = (organization: string): LanguageStatsData => {
  return {
    organization,
    languages: [
      { name: 'JavaScript', percentage: 71.63, color: '#f1e05a' },
      { name: 'HTML', percentage: 14.56, color: '#e34c26' },
      { name: 'TypeScript', percentage: 9.36, color: '#3178c6' },
      { name: 'CSS', percentage: 3.76, color: '#563d7c' },
      { name: 'GLSL', percentage: 0.40, color: '#5686a5' },
      { name: 'C++', percentage: 0.28, color: '#f34b7d' },
    ],
  };
};

const generateSVG = (data: LanguageStatsData): string => {
  const { languages } = data;
  
  // 바 그래프용 좌표 계산
  let currentX = 0;
  const barHeight = 8;
  const barWidth = 460;
  
  const barSegments = languages.map((lang) => {
    const width = (lang.percentage / 100) * barWidth;
    const segment = `<rect x="${currentX}" y="0" width="${width}" height="${barHeight}" fill="${lang.color}" rx="4"/>`;
    currentX += width;
    return segment;
  }).join('\n      ');

  // 언어 리스트 (2열)
  const halfLength = Math.ceil(languages.length / 2);
  const leftColumn = languages.slice(0, halfLength);
  const rightColumn = languages.slice(halfLength);

  const createLanguageItem = (lang: { name: string; percentage: number; color: string }, index: number) => {
    const y = 80 + index * 35;
    return `
      <g transform="translate(20, ${y})">
        <circle cx="8" cy="0" r="8" fill="${lang.color}"/>
        <text x="25" y="5" class="lang-name">${lang.name}</text>
        <text x="180" y="5" class="lang-percent">${lang.percentage.toFixed(2)}%</text>
      </g>`;
  };

  const createLanguageItemRight = (lang: { name: string; percentage: number; color: string }, index: number) => {
    const y = 80 + index * 35;
    return `
      <g transform="translate(270, ${y})">
        <circle cx="8" cy="0" r="8" fill="${lang.color}"/>
        <text x="25" y="5" class="lang-name">${lang.name}</text>
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

      <!-- Background -->
      <rect width="500" height="${totalHeight}" fill="white" rx="10"/>
      
      <!-- Title -->
      <text x="20" y="35" class="title">Most Used Languages</text>
      
      <!-- Language Bar -->
      <g transform="translate(20, 50)">
        ${barSegments}
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
  { params }: { params: { organization: string } }
) => {
  try {
    const organization = params.organization;

    if (!organization) {
      return new Response('Organization name is required', { status: 400 });
    }

    // TODO: GitHub API에서 실제 데이터 가져오기
    const data = getMockData(organization);
    const svg = generateSVG(data);

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating SVG:', error);
    return new Response('Failed to generate SVG', { status: 500 });
  }
};

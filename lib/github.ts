export interface Repository {
  name: string;
  full_name: string;
  private: boolean;
  fork: boolean;
}

export interface LanguageData {
  [language: string]: number;
}

export interface AggregatedLanguageStats {
  language: string;
  bytes: number;
  percentage: number;
  color: string;
}

// 간단한 메모리 캐시
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  console.log(`✓ Cache hit for ${key}`);
  return entry.data;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
  console.log(`✓ Cached result for ${key}`);
}

// GitHub API 헤더 생성 (토큰이 있으면 사용)
function getGitHubHeaders() {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  // 환경변수에서 GitHub 토큰 가져오기
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    // console.log('✓ GitHub token found, using authenticated requests');
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('⚠ No GitHub token found, using unauthenticated requests (rate limit: 60/hour)');
  }
  
  return headers;
}

// Rate limit 정보 확인
async function checkRateLimit() {
  try {
    const response = await fetch('https://api.github.com/rate_limit', {
      headers: getGitHubHeaders(),
    });
    
    if (response.ok) {
      const data = await response.json();
      const { core } = data.resources;
      console.log(`GitHub API Rate Limit: ${core.remaining}/${core.limit} remaining`);
      console.log(`Reset time: ${new Date(core.reset * 1000).toLocaleString()}`);
      return core;
    }
  } catch (error) {
    console.error('Failed to check rate limit:', error);
  }
  return null;
}

export async function fetchOrganizationRepos(org: string): Promise<Repository[]> {
  // 캐시 확인
  const cacheKey = `repos:${org}`;
  const cached = getCached<Repository[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const allRepos: Repository[] = [];
    let page = 1;
    const perPage = 100;
    
    // 페이지네이션 처리 (최대 10페이지 = 1000개 레포지토리)
    while (page <= 10) {
      const response = await fetch(
        `https://api.github.com/orgs/${org}/repos?sort=updated&per_page=${perPage}&page=${page}`,
        {
          headers: getGitHubHeaders(),
          cache: 'no-store', // Next.js 캐시 비활성화 (우리가 직접 관리)
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          console.error('GitHub API rate limit exceeded');
          await checkRateLimit();
        }
        throw new Error(`Failed to fetch repositories: ${response.statusText}`);
      }

      const repos: Repository[] = await response.json();
      
      if (repos.length === 0) {
        break; // 더 이상 레포지토리가 없음
      }
      
      allRepos.push(...repos);
      
      if (repos.length < perPage) {
        break; // 마지막 페이지
      }
      
      page++;
    }

    const filteredRepos = allRepos.filter(repo => !repo.fork);
    setCache(cacheKey, filteredRepos);
    return filteredRepos;
  } catch (error) {
    console.error('Error fetching organization repos:', error);
    return [];
  }
}

export async function fetchRepositoryLanguages(owner: string, repo: string): Promise<LanguageData> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers: getGitHubHeaders(),
        next: { revalidate: 3600 } // 1시간 캐시
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        console.error(`Rate limit exceeded for ${owner}/${repo}`);
      } else {
        console.error(`Failed to fetch languages for ${owner}/${repo}: ${response.statusText}`);
      }
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching languages for ${owner}/${repo}:`, error);
    return {};
  }
}

// 배치 처리를 위한 헬퍼 함수
async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    
    // 배치 사이에 약간의 지연 추가 (rate limit 완화)
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

export async function aggregateOrganizationLanguages(
  org: string
): Promise<AggregatedLanguageStats[]> {
  // 전체 결과 캐시 확인
  const cacheKey = `aggregated:${org}`;
  const cached = getCached<AggregatedLanguageStats[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Rate limit 확인
  await checkRateLimit();
  
  // 1. 조직의 모든 레포지토리 가져오기
  const repos = await fetchOrganizationRepos(org);

  if (repos.length === 0) {
    return [];
  }

  console.log(`Found ${repos.length} repositories for ${org}`);

  // 2. 각 레포지토리의 언어 데이터 가져오기 (배치 처리)
  // 배치 크기를 50으로 제한하여 rate limit 방지
  const languagesData = await processBatch(
    repos,
    50,
    (repo) => fetchRepositoryLanguages(org, repo.name)
  );

  // 3. 언어별로 bytes 합산
  const aggregated: { [language: string]: number } = {};

  languagesData.forEach(repoLanguages => {
    Object.entries(repoLanguages).forEach(([language, bytes]) => {
      if (aggregated[language]) {
        aggregated[language] += bytes;
      } else {
        aggregated[language] = bytes;
      }
    });
  });

  // 4. 총 bytes 계산
  const totalBytes = Object.values(aggregated).reduce((sum, bytes) => sum + bytes, 0);

  if (totalBytes === 0) {
    return [];
  }

  // 5. 퍼센트 계산 및 정렬
  const result: AggregatedLanguageStats[] = Object.entries(aggregated)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: (bytes / totalBytes) * 100,
      color: getLanguageColor(language),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // 결과 캐시 저장
  setCache(cacheKey, result);

  return result;
}

// 언어별 GitHub 표준 색상
const LANGUAGE_COLORS: { [key: string]: string } = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  PowerShell: '#012456',
  'Objective-C': '#438eff',
  Scala: '#c22d40',
  Perl: '#0298c3',
  Haskell: '#5e5086',
  Lua: '#000080',
  R: '#198CE7',
  Vim: '#199f4b',
  Elixir: '#6e4a7e',
  Clojure: '#db5855',
  GLSL: '#5686a5',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Batchfile: '#C1F12E',
  Makefile: '#427819',
  Dockerfile: '#384d54',
};

function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] || '#cccccc';
}

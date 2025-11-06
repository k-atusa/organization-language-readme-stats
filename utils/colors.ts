// 언어별 GitHub 표준 색상
export const LANGUAGE_COLORS: Record<string, string> = {
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
  Objective: '#438eff',
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
};

export const getLanguageColor = (language: string): string => {
  return LANGUAGE_COLORS[language] || '#cccccc';
};

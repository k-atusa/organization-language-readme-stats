// GitHub standard language colors
export const LANGUAGE_COLORS: Record<string, string> = {
  // Popular languages
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Less: '#1d365d',
  Sass: '#a53b70',
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
  
  // Shell & Scripting
  Shell: '#89e051',
  PowerShell: '#012456',
  Batchfile: '#C1F12E',
  Perl: '#0298c3',
  Raku: '#0000fb',
  Lua: '#000080',
  Awk: '#c30e9b',
  
  // System languages
  Assembly: '#6E4C13',
  Objective: '#438eff',
  'Objective-C': '#438eff',
  'Objective-C++': '#6866fb',
  
  // Functional languages
  Haskell: '#5e5086',
  OCaml: '#3be133',
  Erlang: '#B83998',
  Elixir: '#6e4a7e',
  Clojure: '#db5855',
  'Common Lisp': '#3fb68b',
  'Standard ML': '#dc566d',
  'Emacs Lisp': '#c065db',
  Smalltalk: '#596706',
  
  // JVM languages
  Scala: '#c22d40',
  Groovy: '#4298b8',
  
  // Web frameworks & tools
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Astro: '#ff5a03',
  MDX: '#fcb32c',
  EJS: '#a91e50',
  Mustache: '#724b3b',
  Jinja: '#a52a22',
  
  // Build & Config
  Makefile: '#427819',
  CMake: '#DA3434',
  Dockerfile: '#384d54',
  Meson: '#007800',
  BitBake: '#00bce4',
  Starlark: '#76d275',
  Just: '#384d54',
  
  // Data & Science
  R: '#198CE7',
  'Jupyter Notebook': '#DA5B0B',
  MATLAB: '#e16737',
  Mathematica: '#dd1100',
  Gnuplot: '#f0a9f0',
  Stan: '#b2011d',
  
  // Other compiled languages
  Hack: '#878787',
  D: '#ba595e',
  Yacc: '#4B6C4B',
  Lex: '#DBCA00',
  Thrift: '#D12127',
  Terra: '#00004c',
  Pawn: '#dbb284',
  
  // Markup & Data
  Roff: '#ecdebe',
  M4: '#000000',
  XSLT: '#EB8CEB',
  
  // Mobile & Game Dev
  Metal: '#8f14e9',
  UnrealScript: '#a54c4d',
  RenderScript: '#000000',
  SourcePawn: '#f69e0f',
  
  // Web Assembly & VM
  LLVM: '#185619',
  
  // Database
  PLSQL: '#dad8d8',
  PLpgSQL: '#336790',
  
  // Testing & Spec
  Gherkin: '#5B2063',
  Alloy: '#64C800',
  
  // Hardware
  Verilog: '#b2b7f8',
  
  // Other languages
  Pascal: '#E3F171',
  CoffeeScript: '#244776',
  ReScript: '#ed5051',
  Cython: '#fedf5b',
  NASL: '#000000',
  SWIG: '#000000',
  SmPL: '#c94949',
  'Vim Script': '#199f4b',
  'Vim Snippet': '#199f4b',
  Tcl: '#e4cc98',
  Puppet: '#302B6D',
  Nix: '#7e7eff',
  'DIGITAL Command Language': '#000000',
  RPC: '#000000',
  GDB: '#000000',
  YARA: '#220000',
  sed: '#64b970',
  Smarty: '#f0c040',
  AIDL: '#34EB6B',
  Dune: '#ff9800',
  XS: '#000000',
  M: '#000000',
  Ragel: '#9d5200',
  Mako: '#7e858d',
  'POV-Ray SDL': '#6bac65',
  Befunge: '#000000',
  Turing: '#cf142b',
  'Module Management System': '#000000',
  DTrace: '#000000',
  VBA: '#867db1',
  'OpenEdge ABL': '#5ce600',
  AppleScript: '#101F1F',
  'Linker Script': '#000000',
  Procfile: '#3B2F63',
};

// Legacy name mappings
const LANGUAGE_ALIASES: Record<string, string> = {
  'Objective': 'Objective-C',
  'Vim': 'Vim Script',
};

export const getLanguageColor = (language: string): string => {
  // Check for alias first
  const normalizedLanguage = LANGUAGE_ALIASES[language] || language;
  return LANGUAGE_COLORS[normalizedLanguage] || '#cccccc';
};

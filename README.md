# 🌍 Miniature Fishstick

Um jogo Wordle-like onde você adivinha o país do dia baseado na sua proximidade geográfica. A cada palpite, você recebe um score em quilômetros de distância até o país correto, com bônus por fronteiras e continentes!

## 🎮 Como Jogar

1. Acesse a aplicação
2. Digite o nome de um país (com autocomplete)
3. Receba um score em km (0 km = acertou! 🎉)
4. Tente acertar o país do dia em poucos palpites
5. O jogo reseta diariamente

**Pontuação:**
- **0 km**: Acertou! (verde escuro)
- **1-100 km**: Muito perto (verde claro)
- **101-500 km**: Perto (amarelo)
- **501-1000 km**: Longe (laranja)
- **1000+ km**: Muito longe (vermelho)

## 🚀 Começando

### Pré-requisitos
- Node.js 20+
- pnpm (via Corepack)

### Instalação

```bash
# Habilitar Corepack e instalar pnpm
corepack enable && corepack prepare pnpm@latest --activate

# Instalar dependências
pnpm install
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento (http://localhost:3000)
pnpm dev

# Executar testes
pnpm test

# Testes com cobertura
pnpm test:coverage

# Lint
pnpm lint

# Build para produção
pnpm build
pnpm start
```

## 🏗️ Arquitetura

```
miniature-fishstick/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── countries/           # GET lista todos os países
│   │   ├── daily-country/       # GET retorna país do dia + metadados
│   │   └── guess/               # POST valida palpite e calcula proximidade
│   ├── layout.tsx               # Layout raiz com Analytics
│   ├── page.tsx                 # Página principal (jogo)
│   └── globals.css              # Estilos globais
│
├── components/                  # Componentes React reutilizáveis
│   ├── GuessInput.tsx          # Input com autocomplete de países
│   └── GuessHistory.tsx        # Histórico colorido de palpites
│
├── lib/                         # Lógica de negócio
│   ├── types.ts                # Tipos TypeScript (Country)
│   ├── proximity.ts            # Cálculo Haversine + bônus
│   ├── countryOfTheDay.ts      # Seleção determinística do país do dia
│   ├── normalize.ts            # Normalização de strings (acentos, etc)
│   ├── storage.ts              # LocalStorage para histórico do jogo
│   └── useCountries.ts         # Hook para carregar lista de países
│
├── data/
│   └── countries.json          # Dataset de ~250 países com coordenadas
│
├── tests/                       # Suite de testes (Vitest)
│   ├── api/
│   │   ├── countries.test.ts
│   │   ├── daily-country.test.ts
│   │   └── guess.test.ts
│   ├── lib/
│   │   ├── proximity.test.ts
│   │   ├── normalize.test.ts
│   │   └── countryOfTheDay.test.ts
│   └── setup.ts                # Configuração de testes
│
├── styles/                     # Estilos Tailwind
│   ├── tokens.css             # Tokens de design
│   └── utilities.css          # Utilidades customizadas
│
├── docs/                       # Documentação de APIs (REST Client)
│   ├── daily-crounty-api.rest
│   └── guess-api.rest
│
├── scripts/
│   └── generate-countries.mjs  # Script para gerar countries.json
│
├── public/                     # Arquivos estáticos
│
├── coverage/                   # Relatório de cobertura de testes (gitignored)
│
└── Config files
    ├── next.config.ts         # Next.js config (React Compiler ativo)
    ├── vitest.config.ts       # Vitest config
    ├── tsconfig.json          # TypeScript config
    ├── postcss.config.mjs      # PostCSS + Tailwind
    ├── eslint.config.mjs       # ESLint
    └── package.json
```

## 🔌 APIs

### `GET /api/countries`
Lista todos os países disponíveis.

**Response:**
```json
["Afghanistan", "Albania", "Algeria", ...]
```

### `GET /api/daily-country`
Retorna o país do dia, índice e seed (para evitar spoilers).

**Response:**
```json
{
  "dayIndex": 758,
  "date": "2026-02-08",
  "seed": "a1b2c3d4"
}
```

### `POST /api/guess`
Valida um palpite e calcula proximidade em km.

**Request:**
```json
{
  "guess": "Brazil"
}
```

**Response (200):**
```json
{
  "country": "Brazil",
  "rank": 1234,
  "isCorrect": false
}
```

**Error (400):**
```json
{
  "error": "Guess is required"
}
```

**Error (404):**
```json
{
  "error": "Country not found"
}
```

## 📊 Stack Tecnológico

**Frontend:**
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS 4
- React Compiler (babel-plugin-react-compiler)

**Backend:**
- Next.js API Routes
- TypeScript

**Testing & Quality:**
- Vitest 4
- Vitest Coverage (v8)
- ESLint 9
- TypeScript strict mode

**Deployment:**
- Vercel Analytics integrado

## ✅ Funcionalidades Implementadas

- ✅ Seleção determinística do país do dia (sempre o mesmo para todos em 24h)
- ✅ Cálculo de proximidade geográfica via Haversine
- ✅ Bônus por fronteiras e continentes
- ✅ Autocomplete com TAB/datalist
- ✅ Histórico local (localStorage) com cores baseadas em proximidade
- ✅ Reset automático quando muda o dia
- ✅ UI responsiva (mobile/desktop)
- ✅ Analytics com Vercel
- ✅ TypeScript strict
- ✅ ESLint
- ✅ Suite de testes

## 🔧 Melhorias Recomendadas

### 1. **Estrutura & Limpeza**

#### Remover
- ❌ **Pasta `/types` vazia**: Não há arquivos. Types estão em `lib/types.ts`
- ❌ **Pasta `/coverage` do VCS**: Adicionar ao `.gitignore` (já deve estar)
- ❌ **README padrão gerado**: Substituir pelo novo

#### Reorganizar (opcional, se crescer)
- Considerar mover types com contexto para `/lib/types/*.ts` se crescerem
- Exemplo: `lib/types/country.ts`, `lib/types/game.ts`

### 2. **Código & Qualidade**

#### Documentação
- [ ] Adicionar JSDoc a todas as funções públicas
- [ ] Documentar contrato de `getCountryOfTheDay` para arrays vazios (vide #4 no TODO.md)
- [ ] Descrever fórmula Haversine em comentário
- [ ] Adicionar exemplos de uso em handlers de API

#### Tipos
- [ ] Criar tipo `ProximityScore` ou `GameResult` para retornos de API
- [ ] Usar union types para status de resposta (success | error)
- [ ] Type-safe localStorage com validação

#### Componentes
- [ ] Extrair lógica de cores (`colorForRank`) para utilitário ou hook
- [ ] Considerar componente de listagem genérica se similar a `GuessHistory`
- [ ] Adicionar `aria-*` attributes para acessibilidade

### 3. **Testes (vide TODO.md prioritizado)**

Seguir o TODO.md existente:

- [ ] **Expandir testes da rota `POST /api/guess`** (TODO #1)
  - Erro JSON
  - País não encontrado (404)
  - Caso sucesso com mocks
  - Validação de status HTTP

- [ ] **Tornar `daily-country` determinístico** (TODO #2)
  - Mock de `new Date()` com `vi.setSystemTime`
  - Validar formato de data (YYYY-MM-DD)

- [ ] **Validar Haversine com números reais** (TODO #3)
  - Coordenadas conhecidas (Londres vs Paris)
  - Tolerância ±1 km

- [ ] **Documentar contrato de `getCountryOfTheDay`** (TODO #4)
  - Decidir: throw ou undefined para array vazio?

- [ ] **Mockar dependências em testes de rota** (TODO #5)
  - `vi.mock('@/lib/countryOfTheDay', ...)`
  - `vi.mock('@/lib/proximity', ...)`

### 4. **Performance & Features**

- [ ] Lazy loading de country list (se dataset crescer)
- [ ] Cachear lista de países no backend
- [ ] Validar input antes de chamar API
- [ ] Indicador visual de loading durante fetch
- [ ] Retry logic com exponential backoff para falhas de rede

### 5. **DevX & CI/CD**

- [ ] Adicionar script `pnpm lint:fix` para auto-fix
- [ ] Adicionar pré-commit hook com `husky + lint-staged`
- [ ] Gerar coverage badge no CI
- [ ] Atualizar CI workflow para rodar lint também
- [ ] Documentar variáveis de ambiente (se houver)

### 6. **Acessibilidade & UX**

- [ ] Adicionar labels acessíveis
- [ ] Keyboard navigation completo
- [ ] Dark mode melhorado
- [ ] Notificação visual de "dia novo" quando reseta
- [ ] Opção de "share" do resultado (como Wordle)
- [ ] Modo claro (light mode) explícito

### 7. **Metadata & SEO**

- [ ] Atualizar `layout.tsx`: title e description dinâmicos
- [ ] Adicionar favicon e og: tags
- [ ] Sitemap (se public)

## 📝 Convenções de Código

```typescript
// ✅ Nomes descritivos
const calculateProximity = (guess, target) => { ... }

// ✅ JSDoc para funções públicas
/**
 * Calcula distância em km usando Haversine.
 * @param guess País do palpite
 * @param target País alvo do dia
 * @returns Distância em km ajustada por bônus
 */
export function calculateProximity(...) { ... }

// ✅ Types em um arquivo centralizado
import { Country } from '@/lib/types';

// ✅ Constantes em UPPER_SNAKE_CASE
const START_DATE = new Date("2024-01-01");
const EARTH_RADIUS_KM = 6371;

// ✅ Componentes com type props explícito
type Props = { /* ... */ };
export default function MyComponent({ ... }: Props) { }

// ✅ Testes com nomenclatura clara
test('calculateProximity returns 0 for identical countries', () => { })
```

## 🐛 Problemas Conhecidos

- [ ] Daily-country usa `new Date()` — não determinístico sem mock
- [ ] `getCountryOfTheDay` retorna `undefined` implicitamente para array vazio
- [ ] Testes de rota `POST /guess` cobrem apenas caso de erro
- [ ] Componentes sem acessibilidade (ARIA labels)

## 📚 Referências

- [Next.js Docs](https://nextjs.org/docs)
- [Vitest Docs](https://vitest.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)

## 📄 Licença

MIT

---

**Última atualização:** 8 de fevereiro de 2026

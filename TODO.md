# Melhorias de Testes (priorizadas)

Este arquivo lista melhorias recomendadas para a suíte de testes do projeto `miniature-fishstick`, com descrição, motivação, benefícios e critérios de aceite. Cada item pode ser implementado independentemente.

---

## 1) Expandir testes da rota `POST /api/guess`

- O que: adicionar testes unitários cobrindo:
  - erro de parsing JSON (simular `req.json()` lançando)
  - `guess` ausente / não-string (já existe um teste; manter)
  - país não encontrado (esperar 404)
  - caso de sucesso (mockar `getCountryOfTheDay` e `calculateProximity` para controlar `isCorrect` e `rank`)

- Por que: hoje só temos teste para requisição sem `guess`. O handler depende de outras funções (`normalize`, `getCountryOfTheDay`, `calculateProximity`), por isso precisamos isolar o handler com mocks para validar sua lógica corretamente.

- Benefícios:
  - reduz falsos positivos/negativos por dependências externas
  - garante respostas HTTP corretas (status + body)

- Critério de aceite:
  - existe arquivo `tests/api/guess.handler.test.ts` com os 4 cenários
  - todos os testes passam localmente

- Arquivos a criar/editar:
  - `tests/api/guess.handler.test.ts`

---

## 2) Tornar `daily-country` determinístico nos testes

- O que: mockar a data com `vi.setSystemTime(...)` em `tests/api/daily-country.test.ts` e validar que `date` possui formato `YYYY-MM-DD` e que `dayIndex` é o calculado para a data escolhida.

- Por que: o endpoint usa `new Date()` — testes sem data mockada são não-determinísticos.

- Benefícios:
  - testes reproduzíveis em qualquer ambiente
  - evita falhas intercorrentes em CI

- Critério de aceite:
  - `tests/api/daily-country.test.ts` contém pelo menos um teste com `vi.setSystemTime` e valida `date` via regex `/^\d{4}-\d{2}-\d{2}$/`.

---

## 3) Validar cálculo haversine em `proximity`

- O que: adicionar teste numérico que compara o resultado da função `haversineDistance` (indiretamente via `calculateProximity`) para coordenadas conhecidas (ex.: Londres [51.5074,-0.1278] vs Paris [48.8566,2.3522]) com tolerância (±1 km).

- Por que: garante que a implementação matemática não regresse; atualmente apenas testamos relações e casos limites.

- Benefícios:
  - aumenta confiança na precisão do ranking de proximidade

- Critério de aceite:
  - teste `tests/lib/proximity.haversine.test.ts` que usa `toBeCloseTo(expected, 0)` ou `Math.abs(score - expected) <= 1`

---

## 4) Decidir e documentar contrato de `getCountryOfTheDay` para array vazio

- O que: decidir entre (A) lançar erro em arrays vazios ou (B) retornar `undefined`. Atualizar implementação e testes conforme a decisão.

- Por que: comportamento atual retorna `undefined` implicitamente; é melhor ter contrato explícito para evitar comportamentos silenciosos em produção.

- Benefícios:
  - clareza de API interna
  - evita NPEs silenciosos

- Critério de aceite:
  - documentação no JSDoc de `lib/countryOfTheDay.ts` e testes atualizados em `tests/lib/countryOfTheDay.test.ts` para refletir contrato

---

## 5) Isolar testes de rota com mocks das dependências internas

- O que: em handlers da API (`app/api/*/route.ts`), usar `vi.mock()` nos testes para substituir chamadas a `@/lib/*` por versões controladas. Aplicar especialmente em `guess` e `daily-country`.

- Por que: testes unitários devem validar apenas a camada sendo testada (o handler). Dependências externas (cálculos, seleção do país) devem ser substituídas.

- Benefícios:
  - testes mais rápidos e menos frágeis
  - capacidade de simular cenários (ex.: `getCountryOfTheDay` devolvendo X) sem alterar dados reais

- Critério de aceite:
  - testes atualizados usando `vi.mock('@/lib/countryOfTheDay', ...)` e `vi.mock('@/lib/proximity', ...)` onde apropriado

---

## 6) Adicionar testes de integração leves (opcional)

- O que: configurar `msw` (Mock Service Worker) para simular chamadas HTTP externas em testes de integração, mantendo testes unitários rápidos.

- Por que: útil caso handlers façam fetch para APIs externas no futuro.

- Benefícios:
  - permite escrever testes de integração sem rede

- Critério de aceite:
  - adição de `msw` como devDependency e um exemplo de setup em `tests/setup-msw.ts` (opcional)

---

## 7) Scripts e CI

- O que: adicionar scripts `test:ci` (já existe `test:coverage`) e garantir workflow GitHub Actions roda `pnpm test:coverage` em PRs.

- Por que: manter qualidade na integração contínua.

- Benefícios:
  - evita merges com testes quebrados ou cobertura regressa

- Critério de aceite:
  - workflow `.github/workflows/ci.yml` existente ou criado e passando

---

## Comandos úteis

- Rodar todos os testes (uma vez):
```bash
pnpm test -- --run
```

- Rodar cobertura:
```bash
pnpm test:coverage
```

---

## Estimativa (por item)

- Item 1 (guess handler): 1.5 - 2 horas
- Item 2 (daily-country deterministic): 15-30 minutos
- Item 3 (haversine numeric test): 30-45 minutos
- Item 4 (contrato countryOfTheDay): 30-60 minutos (dependendo se mudar implementação)
- Item 5 (mocks nas rotas): 1-2 horas
- Item 6 (msw optional): 1-2 horas
- Item 7 (CI scripts): 15-30 minutos

---

Se quiser, posso começar implementando automaticamente os itens 1, 2 e 3 agora (adicionar os testes e rodar `pnpm test` + `pnpm test:coverage`). Indique quais itens deseja que eu implemente primeiro.

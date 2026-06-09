# Invista Consórcios — Site

Site institucional da **Invista Consórcios** (invconsorcios.com.br) — crédito planejado e construção de patrimônio sem juros abusivos, em Manaus/AM.

Site estático (HTML/CSS/JS puro), hospedado na **Vercel**.

## Estrutura

```
.
├── index.html              # Página inicial
├── sobre.html              # Sobre nós
├── solucoes.html           # Soluções de consórcio
├── data-certa.html         # Consórcio com Data Certa (veículos)
├── clientes.html           # Clientes
├── blog.html               # Blog (em construção)
├── contato.html            # Contato (formulário GoHighLevel + mapa)
├── privacidade.html        # Política de Privacidade (LGPD)
├── termos.html             # Termos de Uso
├── assets/                 # CSS, JS, imagens (WebP + originais), favicons
├── uploads/                # Mídia adicional
├── robots.txt              # Diretrizes de crawling
├── sitemap.xml             # Mapa do site
└── vercel.json             # Headers de segurança + cache
```

## Otimizações aplicadas

- **Performance:** imagens convertidas para WebP com fallback `<picture>` (–97% de peso), lazy loading, cache de longa duração.
- **Segurança:** headers via `vercel.json` (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy), iframe do mapa em sandbox.
- **SEO técnico:** títulos/descrições únicos, Open Graph, Twitter Cards, dados estruturados (JSON-LD), favicons, `robots.txt` e `sitemap.xml`.
- **LGPD:** páginas de Política de Privacidade e Termos de Uso.

## Desenvolvimento local

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```

> Os headers de segurança do `vercel.json` só têm efeito quando servido pela Vercel — valide em um deploy de preview.

---

Desenvolvido e otimizado pela **VANTAGE** — automação com IA e consultoria estratégica.

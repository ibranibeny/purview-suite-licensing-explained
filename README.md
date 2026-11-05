# Microsoft Purview Suite licensing, explained

A dynamic, source-linked website that explains Microsoft Purview Suite licensing, built from public Microsoft documentation.

- **Website:** https://ibranibeny.github.io/purview-suite-licensing-explained/
- **Present as slides:** https://ibranibeny.github.io/purview-suite-licensing-explained/slides/

It answers three customer questions:

1. **Licensed vs. not licensed:** what does the Purview Suite add on top of Microsoft 365 E3?
2. **Without a Suite license:** what can users still do, and what can't they do?
3. **1,000 employees, 500 licenses:** what happens to the other 500, and what are the options?

Every claim carries a numbered citation that links to its Microsoft source. Last verified: **5 November 2026**.

## Topics

| Menu | Topics |
| --- | --- |
| Licensed vs. not | The Suite is an add-on · Data security · Compliance & risk · Audit retention · Copilot data |
| Without a license | Can and can't · Pay-as-you-go |
| 1,000 vs. 500 | The scenario · Who needs a license · What the other 500 keep · Enforcement · Running a 500/500 split · Three options · Subset add-ons |
| Tools | License planner · Capability explorer |
| Reference | Key takeaways · FAQ · Sources |

Each topic has its own address, for example `?topic=audit`, so you can share a link to a single topic.

## Features

- **Topic menu:** a dropdown for each topic group in the header, a full topic list in the sidebar (a slide-out menu on phones), breadcrumbs, and previous/next links.
- **No page reloads:** topics open instantly, and the browser's back and forward buttons work.
- **Search:** press `/` or `Ctrl+K` to search topics, capabilities and FAQ answers.
- **Citations:** select a citation number to see its source, open it, or jump to the full list. Each topic ends with the sources it uses, and the Sources page shows where each source is cited.
- **License planner:** enter a headcount, license count and price to see coverage, list-price cost and what to plan for. *Copy link to this scenario* shares the exact numbers.
- **Capability explorer:** search and filter all 23 capabilities by area, or show only where the Suite adds something.
- **Print:** print the current topic, or the full guide from the Sources page.

## Repository layout

| Path | What it is |
| --- | --- |
| `index.html` | The website: every topic, the menus and the tools |
| `assets/site.css` | Styles |
| `assets/app.js` | Topic navigation, search, citations, planner and explorer |
| `assets/favicon.png` | Site icon |
| `slides/index.html` | The same content as a 21-slide click-through presentation |
| `404.html` | Page-not-found page |

The site is static (GitHub Pages); everything dynamic runs in the browser, with no server, tracking or external dependencies.

## Sources

1. [Microsoft Purview Suite: product page and FAQ](https://www.microsoft.com/en-us/security/microsoft-purview-suite) (microsoft.com)
2. [Microsoft Purview licensing guidance](https://www.microsoft.com/licensing/guidance/Microsoft-Purview) (Microsoft Licensing)
3. [Microsoft Purview service description](https://learn.microsoft.com/en-us/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-purview-service-description) (Microsoft Learn)
4. [Learn about auditing solutions in Microsoft Purview](https://learn.microsoft.com/en-us/purview/audit-solutions-overview) (Microsoft Learn)
5. [Manage audit log retention policies](https://learn.microsoft.com/en-us/purview/audit-log-retention-policies) (Microsoft Learn)
6. [Learn about Microsoft Purview billing models](https://learn.microsoft.com/en-us/purview/purview-billing-models) (Microsoft Learn)
7. [Message encryption FAQ](https://learn.microsoft.com/en-us/purview/ome-faq) (Microsoft Learn)
8. [Get started with eDiscovery](https://learn.microsoft.com/en-us/purview/edisc-get-started) (Microsoft Learn)
9. [Get started with Insider Risk Management](https://learn.microsoft.com/en-us/purview/insider-risk-management-configure) (Microsoft Learn)

All sources accessed 5 November 2026.

## Assumptions

Enterprise commercial cloud (government, education and sovereign clouds may differ). Baseline: Microsoft 365 E3. Prices are US list prices on microsoft.com and are shown for illustration only; regional and agreement prices differ. The license planner does list-price arithmetic only; it is not a quote.

## Disclaimer

This site summarises public Microsoft documentation. It is not a licensing agreement or an official licensing statement: the Microsoft Product Terms and your licensing agreement govern. Licensing changes often, so confirm details with your Microsoft account team or partner.

Microsoft, Microsoft 365, Microsoft Purview and Copilot are trademarks of the Microsoft group of companies.

---
title: AI Cooling Is Becoming the Next Data-Center Bottleneck
slug: ai-cooling-next-data-center-bottleneck
section: financial-research
visualKey: ai-cooling-thermal-chain
date: 2026-05-31
tags:
  - investing
  - data-centers
  - ai
  - cooling
  - liquid-cooling
  - infrastructure
  - thermal-management
keywords:
  - ai data center cooling
  - liquid cooling
  - vertiv
  - eaton boyd
  - schneider motivair
  - alfa laval
format: company-compare
perspective: investor
summary: Cooling is no longer a facilities footnote. As GB200-class racks push past 100 kW and Rubin-era systems move higher, the investable edge sits with vendors that can deliver validated thermal chains at hyperscaler scale — especially Vertiv, Eaton, and Schneider — while component specialists and facility-loop names offer more selective exposure.
readingTime: 10
relatedSlugs:
  - china-ai-infrastructure-hidden-power-play
  - ai-power-semis-wolfspeed-onsemi-infineon
sourceLinks:
  - label: "HPE GB200 NVL72 product page"
    url: "https://buy.hpe.com/us/en/compute/rack-scale-system/nvidia-nvl-system/nvidia-gb200-nvl72-by-hpe/p/1014890104"
  - label: "Vertiv EMEA CoolChip CDU 2300 launch"
    url: "https://www.vertiv.com/en-emea/about/news-and-events/news-releases/2026/vertiv-expands-liquid-cooling-portfolio-in-emea-to-accelerate-ai-ready-data-centre-deployments"
  - label: "Vertiv Vera Rubin DSX infrastructure announcement"
    url: "https://www.vertiv.com/en-us/about/news-and-events/corporate-news/2026/vertiv-brings-converged-physical-infrastructure-to-nvidia-vera-rubin-dsx-ai-factories"
  - label: "Eaton Q1 2026 earnings transcript summary"
    url: "https://www.aol.com/finance/eaton-etn-q1-2026-earnings-181250830.html"
  - label: "Eaton acquires Boyd Thermal"
    url: "https://www.eaton.com/us/en-us/company/news-insights/news-releases/2026/eaton-completes-acquisition-of-leading-liquid-cooling-solutions-provider-boyd-thermal.html"
  - label: "Schneider direct liquid cooling for AI data centers"
    url: "https://blog.se.com/datacenter/2026/03/10/single-phase-direct-liquid-cooling-efficient-thermal-solution-ai-data-centers"
  - label: "Schneider brownfield AI modernization"
    url: "https://blog.se.com/datacenter/2026/02/26/brownfield-data-center-modernization-ai"
  - label: "Schneider + Motivair liquid cooling portfolio"
    url: "https://www.se.com/us/en/about-us/newsroom/news/press-releases/schneider-electric-unveils-liquid-cooling-portfolio-with-motivair-featuring-dedicated-solutions-and-services-for-hpc-and-ai-workloads-68da975376d417f4a10de42c"
  - label: "Schneider Lake Mariner delivery"
    url: "https://www.se.com/us/en/about-us/newsroom/news/press-releases/Schneider-Electric-progresses-phaseddelivery-of-over-290M-in-AI-Infrastructure-Solutions-including-Motivair-technologies-at-TeraWulf%E2%80%99s-GoogleBacked-Lake-Mariner-Campus-6a1514cee67b3015570e068a"
  - label: "Alfa Laval FreeWaterLoop launch"
    url: "https://www.alfalaval.com/media/news/investors/2026/alfa-laval-launches-freewaterloop-to-support-efficient-data-center-cooling"
  - label: "Delta GoCool 3MW CDU now shipping"
    url: "https://www.deltapowersolutions.com/en/mcis/news-2026-gocool-3mw-cdu-now-shipping-powering-the-next-generation-of-ai-data-centers.php"
  - label: "TVBS on Asia Vital Components"
    url: "https://news.tvbs.com.tw/english/3179423"
---

:::callout
label: Educational purposes only
text: This note is for educational purposes only and is not investment advice or a recommendation to buy or sell any security.
variant: warning
:::

:::thesis-card
label: Core Thesis
title: Cooling is becoming the gating layer between AI capex and usable compute
text: "Once racks move into GB200-class density, the investable question stops being whether liquid cooling is real and starts being where margins and validation sit. Right now the best public equities are the vendors that can ship an end-to-end thermal chain — CDU, manifolds, controls, heat rejection, and lifecycle service — not just a clever component."
:::

:::metric-strip
metrics:
  - {label: GB200 rack power, note: "HPE NVL72 rack", value: "132 kW"}
  - {label: Liquid-cooled share, note: "Of that rack load", value: "115 kW"}
  - {label: Vertiv CDU capacity, note: "CoolChip CDU 2300", value: "2.3 MW"}
  - {label: Eaton data-center orders, note: "Q1 2026 YoY", value: "+240%"}
  - {label: AVC liquid-cooling penetration, note: "AI server forecast 2025 → 2026", value: "18% → 57%"}
:::

:::flowchart
title: GPU rack to facility loop — where the money sits in AI cooling
steps:
  - {label: "GPU / CPU package", note: "Heat spikes at the silicon; cold plates become mandatory as TDP rises"}
  - {label: "Cold plate", note: "Chip-level heat capture; component specialists like AVC and Auras live here"}
  - {label: "In-rack / row manifolds", note: "Distribute coolant reliably across multiple servers and racks"}
  - {label: "CDU", note: "Controls flow, pressure, and temperature while decoupling IT and facility loops"}
  - {label: "Facility loop / heat rejection", note: "Pumps, heat exchangers, chillers, and water-side efficiency"}
  - {label: "Controls + lifecycle service", note: "Monitoring, leak detection, commissioning, maintenance, and uptime assurance"}
caption: "The thermal chain is only as strong as its weakest integration point. That is why system vendors are capturing the premium." 
:::

:::comparison-table
columns:
  - Company
  - What is verified
  - Why it matters
  - Main risk / what remains unproven
rows:
  - ['Vertiv (VRT)', 'CoolChip CDU family spans 100 kW to 2.3 MW; EMEA launch adds CDU 2300 and row manifolds; company is integrated into NVIDIA Vera Rubin DSX infrastructure models with standardized 12.5 MW building blocks.', 'This is the cleanest listed expression of full-stack thermal-chain exposure: CDU, manifolds, heat rejection, controls, and service sold as a validated system.', 'Valuation is likely the richest in the group, and the open question is whether margins stay elevated once hyperscalers standardize and multi-source more aggressively.']
  - ['Eaton (ETN)', 'Q1 2026 data-center orders rose 240%; Boyd backlog doubled over the last six months; Eaton now owns liquid cooling through Boyd inside a broader grid-to-chip platform.', 'Eaton is not a pure-play cooling stock, but it now owns one of the more credible thermal component and subsystem assets while keeping the power-distribution attach opportunity.', 'Cooling may remain a high-growth slice inside a much larger electrical business, which means the thesis depends on continued attach-rate gains rather than standalone thermal purity.']
  - ['Schneider Electric (SU)', 'Motivair gives Schneider an end-to-end portfolio from cold plates to CDUs and ChilledDoors; management says the portfolio is built for racks above 140 kW and toward 1 MW+; Schneider and Motivair have already delivered more than $290M of AI infrastructure at Lake Mariner.', 'Schneider has a strong brownfield and hyperscale retrofit angle because it can bundle power, monitoring, and cooling into one deployment motion.', 'The listed equity is diversified and the cooling upside can get diluted by the rest of the portfolio; investors still need proof that cooling meaningfully lifts group economics rather than just revenue mix.']
  - ['Alfa Laval (ALFA)', 'FreeWaterLoop launches Alfa Laval into the facility-loop side of data-center cooling, combining pumps, heat exchangers, and filtration in one integrated external cooling system.', 'This is a credible picks-and-shovels exposure to the facility loop, especially if customers push for efficient heat rejection and water-side optimization rather than only rack-level hardware.', 'It is earlier and less validated than Vertiv, Eaton, or Schneider in AI data-center cooling, so the upside is real but the direct monetization signal is still weaker.']
  - ['Asian thermal chain (AVC / Auras / Delta)', 'AVC reportedly holds 40–50% of cold plates for Nvidia GB200 and GB300 and was named one of four preferred cold-plate suppliers for Vera Rubin; Delta is shipping a 3 MW CDU; Auras is gaining exposure to cold plates and manifolds.', 'This is where purity sits at the component level: cold plates, manifolds, and high-volume thermal manufacturing tied directly to GPU ramps.', 'Most of the best names are non-U.S. and some are harder for global investors to access; component vendors can also face faster margin compression if designs commoditize.']
:::

:::bullets
items:
  - Cooling is no longer a facilities afterthought. At GB200 rack densities, it is part of the compute bill of materials and part of deployment risk management.
  - The economic edge is shifting toward validated systems, not isolated parts. Hyperscalers care about uptime, commissioning speed, leak control, and serviceability as much as thermal performance.
  - Brownfield retrofit demand is real, but it is selective. Schneider is right that retrofits can beat greenfield on time-to-revenue, but not every legacy site can take the power, water, and floor-loading changes.
  - Immersion remains strategically interesting, but the current monetization center of gravity is still direct-to-chip plus hybrid air/liquid architectures.
:::

:::heading
text: The market is finally pricing cooling as a deployment constraint, not a support function
:::

:::paragraph
text: "The key fact pattern is physical, not promotional. HPE's GB200 NVL72 rack consumes 132 kW, of which 115 kW is liquid cooled. Schneider argues direct liquid cooling has moved from efficiency upgrade to performance assurance layer as Blackwell-class GPUs approach the kilowatt range. Vertiv is now shipping a 2.3 MW CDU and explicitly tying its power and cooling blocks to NVIDIA's Rubin-era AI factory reference design. This is not vendor poetry anymore. It is a stack-level redesign forced by power density." 
:::

:::paragraph
text: "That shift matters for investors because cooling now determines how quickly capex turns into productive compute. The data-center winner is not merely the operator that orders GPUs. It is the operator that can commission racks, move heat reliably, protect uptime, and keep service complexity under control. That is why the public-equity upside is broadening from chip vendors into the thermal chain." 
:::

:::heading
text: Vertiv looks like the cleanest pure-play expression today
:::

:::paragraph
text: "Vertiv has the best disclosed mix of proof points. The company is shipping CDU capacity from 100 kW to 2.3 MW, adding row manifolds in EMEA, and framing the full thermal chain — direct-to-chip, immersion, rear-door heat exchangers, coolant distribution, heat rejection, intelligent controls, and lifecycle services — as one coherent system. Its March 2026 Rubin DSX announcement matters because it pushes Vertiv beyond 'cooling vendor' into validated AI-factory infrastructure architecture." 
:::

:::paragraph
text: "The bull case is obvious: if customers want fewer integration points and faster deployment, Vertiv can sell a higher-value bundle than a standalone component maker. The risk is equally obvious: the stock likely already discounts a lot of that. The open debate is not whether Vertiv has product-market fit. It is whether the market is paying too much for the quality and whether hyperscaler dual-sourcing compresses the premium over time." 
:::

:::heading
text: Eaton and Schneider are the diversified names with the strongest attach-rate upside
:::

:::paragraph
text: "Eaton's angle is not thermal purity but attach-rate leverage. Q1 2026 data-center orders were up 240%, and Boyd's backlog doubled over the last six months. By acquiring Boyd, Eaton moved from 'power into the rack' toward a more complete grid-to-chip story. That matters because once a customer standardizes on a vendor for both electrical and thermal layers, the switching cost rises and the cross-sell gets more attractive." 
:::

:::paragraph
text: "Schneider has a similar logic, but with a stronger retrofit and software story. Motivair gives it cold plates, CDUs, ChilledDoors, and liquid-to-air dissipation, while Schneider layers in power gear and EcoStruxure monitoring. The Lake Mariner delivery is a useful proof point because it shows customers are already buying power plus cooling plus digital intelligence as one package. If time-to-power and time-to-cooling remain the bottlenecks, that integrated pitch should keep working." 
:::

:::heading
text: Facility-loop and component specialists matter, but they are different trades
:::

:::paragraph
text: "Alfa Laval is the facility-loop trade. FreeWaterLoop gives investors exposure to pumps, heat exchangers, filtration, and water-side efficiency rather than the rack-level thermal interface. That is less glamorous than cold plates, but it can be valuable if operators increasingly optimize total system efficiency and water usage instead of only chip-level heat capture." 
:::

:::paragraph
text: "The Asian supply chain is where the highest purity sits. TVBS reports that AVC holds 40–50% of the cold-plate market for Nvidia GB200 and GB300, and that AI server liquid-cooling penetration could jump from 18% in 2025 to 57% in 2026. Delta is shipping a 3 MW CDU. Auras is gaining cold-plate and manifold exposure. The problem for global investors is not whether these names are relevant. It is that access, disclosure style, and future margin durability can all be messier than with the larger integrated infrastructure vendors." 
:::

:::heading
text: The right base case is direct-to-chip scale-up, not immersion taking over tomorrow
:::

:::paragraph
text: "Direct-to-chip looks like the near-term winner because it solves the thermal problem without blowing up service workflows. Schneider explicitly frames single-phase DLC as the most practical and scalable architecture for high-density AI. Brownfield retrofits also favor DLC and rear-door hybrids because they let operators stage upgrades rack by rack instead of rebuilding the entire facility. Immersion may win niche deployments and specific ultra-dense clusters, but it still looks early as the default public-equity thesis." 
:::

:::scenario-ladder
scenarios:
  - {label: "Bull", probability: "Plausible", outcome: "Thermal-chain vendors compound faster than the market expects", description: "Blackwell and Rubin ramps force broader liquid-cooling adoption, hyperscalers prefer validated system vendors, and retrofit demand proves large enough to extend the cycle beyond greenfield AI factories. Vertiv, Eaton, and Schneider capture both product and service attach."}
  - {label: "Base", probability: "Highest", outcome: "Cooling remains a real secular winner, but equity performance diverges", description: "Liquid cooling keeps taking share, yet returns concentrate in the vendors with system integration and customer validation. Component suppliers grow fast but see earlier pricing pressure. Diversified names win through attach rather than through multiple expansion alone."}
  - {label: "Bear", probability: "Real but not dominant", outcome: "Cooling turns into cyclical AI capex beta", description: "Hyperscalers multi-source aggressively, designs standardize faster than expected, and margins on cold plates, manifolds, and even CDUs compress. Retrofit demand disappoints and immersion stays too niche to rescue supplier mix."}
:::

:::comparison-table
title: "Claim audit — what is fact, what is interpretation, what is still unproven"
columns: ["Bucket", "What we can say now", "Why investors should care"]
rows:
  - ["Verified facts", "GB200-class racks are already above 100 kW; Vertiv is shipping 2.3 MW CDUs; Eaton's data-center orders are up 240%; Schneider and Motivair have delivered more than $290M at Lake Mariner.", "The cooling constraint is commercial reality, not a theoretical future need."]
  - ["Interpretation", "Integrated thermal-chain vendors should capture better economics than standalone components because they reduce deployment risk and service complexity.", "If true, the best equities are system vendors first and component suppliers second."]
  - ["Still unproven", "How durable pricing power will be once hyperscaler designs standardize; how big retrofit demand really is; whether immersion becomes meaningful outside niches; whether component margins survive scale.", "Those unknowns determine whether today's winners are compounders or just high-beta AI infrastructure trades."]
:::

:::verdict
label: Portfolio verdict
text: "Cooling is real enough to matter, but the cleanest trade is not 'buy anything linked to heat.' Today the best risk-adjusted names are the integrated thermal-chain vendors with validation, service depth, and cross-sell power — especially Vertiv first, then Eaton and Schneider. Component specialists and facility-loop suppliers are worth tracking, but they need more proof on margin durability and investor access." 
:::

:::key-takeaways
takeaways:
  - {icon: "✓", text: "Cooling has moved from background utility to deployment gate as AI racks cross 100 kW and beyond."}
  - {icon: "✓", text: "Vertiv has the strongest pure-play setup because it sells the whole thermal chain, not just a part."}
  - {icon: "✓", text: "Eaton and Schneider are the diversified winners if power-plus-cooling attach rates keep rising."}
  - {icon: "?", text: "Facility-loop and component names can outperform, but the burden of proof on pricing power and margin durability is higher."}
  - {icon: "⚠", text: "The main risk is that cooling becomes commoditized AI capex beta once designs standardize and customers multi-source."}
:::

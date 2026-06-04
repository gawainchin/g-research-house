#!/usr/bin/env python3
"""Update G Research House static market watch data via yfinance.

This is intentionally a build-time/static-data helper, not a live trading widget.
It captures a timestamped snapshot for mentioned tickers so the site can show
price movement context without requiring client-side market-data credentials.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import yfinance as yf

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "market-watch.json"

WATCHLIST = [
    {
        "symbol": "NVDA",
        "name": "NVIDIA",
        "theme": "AI leaders / semis",
        "articleSlugs": ["ai-is-not-the-climate-bubble-valuation-rhymes", "cerebras-ipo-wafer-scale-inference"],
    },
    {
        "symbol": "AMD",
        "name": "AMD",
        "theme": "AI leaders / semis",
        "articleSlugs": ["ai-is-not-the-climate-bubble-valuation-rhymes"],
    },
    {
        "symbol": "MSFT",
        "name": "Microsoft",
        "theme": "AI leaders / platforms",
        "articleSlugs": ["ai-is-not-the-climate-bubble-valuation-rhymes", "ai-cooling-next-data-center-bottleneck"],
    },
    {
        "symbol": "META",
        "name": "Meta Platforms",
        "theme": "AI leaders / platforms",
        "articleSlugs": ["ai-is-not-the-climate-bubble-valuation-rhymes", "ai-cooling-next-data-center-bottleneck"],
    },
    {
        "symbol": "GOOGL",
        "name": "Alphabet",
        "theme": "AI leaders / platforms",
        "articleSlugs": ["ai-is-not-the-climate-bubble-valuation-rhymes"],
    },
    {
        "symbol": "PLTR",
        "name": "Palantir",
        "theme": "AI valuation discipline",
        "articleSlugs": ["ai-is-not-the-climate-bubble-valuation-rhymes", "palantir-rule-of-40-deep-dive"],
    },
    {
        "symbol": "VRT",
        "name": "Vertiv",
        "theme": "AI power / cooling",
        "articleSlugs": ["ai-is-not-the-climate-bubble-valuation-rhymes", "ai-cooling-next-data-center-bottleneck"],
    },
    {
        "symbol": "ETN",
        "name": "Eaton",
        "theme": "AI power / electrification",
        "articleSlugs": ["ai-is-not-the-climate-bubble-valuation-rhymes", "ai-cooling-next-data-center-bottleneck"],
    },
    {
        "symbol": "MU",
        "name": "Micron",
        "theme": "Memory / HBM",
        "articleSlugs": ["agentic-inference-memory-io-pressure-indicator"],
    },
    {
        "symbol": "005930.KS",
        "name": "Samsung Electronics",
        "theme": "Memory / HBM",
        "articleSlugs": ["agentic-inference-memory-io-pressure-indicator"],
    },
    {
        "symbol": "000660.KS",
        "name": "SK Hynix",
        "theme": "Memory / HBM",
        "articleSlugs": ["agentic-inference-memory-io-pressure-indicator"],
    },
    {
        "symbol": "AMAT",
        "name": "Applied Materials",
        "theme": "Semicap / packaging",
        "articleSlugs": ["agentic-inference-memory-io-pressure-indicator", "cerebras-ipo-wafer-scale-inference"],
    },
    {
        "symbol": "TSM",
        "name": "TSMC",
        "theme": "Foundry / advanced packaging",
        "articleSlugs": ["cerebras-ipo-wafer-scale-inference", "ai-power-semis-wolfspeed-onsemi-infineon"],
    },
    {
        "symbol": "IFX.DE",
        "name": "Infineon",
        "theme": "Power semiconductors",
        "articleSlugs": ["ai-power-semis-wolfspeed-onsemi-infineon"],
    },
    {
        "symbol": "ON",
        "name": "onsemi",
        "theme": "Power semiconductors",
        "articleSlugs": ["ai-power-semis-wolfspeed-onsemi-infineon"],
    },
    {
        "symbol": "WOLF",
        "name": "Wolfspeed",
        "theme": "Power semiconductors / optionality",
        "articleSlugs": ["ai-power-semis-wolfspeed-onsemi-infineon"],
    },
    {
        "symbol": "IREN",
        "name": "IREN",
        "theme": "AI data centers / compute infra",
        "articleSlugs": ["why-iren-may-be-structurally-safer-than-nebius"],
    },
    {
        "symbol": "NBIS",
        "name": "Nebius",
        "theme": "AI cloud / compute infra",
        "articleSlugs": ["why-iren-may-be-structurally-safer-than-nebius"],
    },
    {
        "symbol": "1810.HK",
        "name": "Xiaomi",
        "theme": "China AI / platforms",
        "articleSlugs": ["china-ai-infrastructure-hidden-power-play"],
    },
    {
        "symbol": "0700.HK",
        "name": "Tencent",
        "theme": "China AI / platforms",
        "articleSlugs": ["china-ai-infrastructure-hidden-power-play"],
    },
    {
        "symbol": "9988.HK",
        "name": "Alibaba",
        "theme": "China AI / cloud",
        "articleSlugs": ["china-ai-infrastructure-hidden-power-play"],
    },
]


def pct(new: float | None, old: float | None) -> float | None:
    if new is None or old is None or old == 0:
        return None
    return (new / old - 1.0) * 100.0


def fmt_num(value):
    if value is None:
        return None
    try:
        return float(value)
    except Exception:
        return None


def snapshot_one(item: dict) -> dict:
    symbol = item["symbol"]
    row = dict(item)
    row.update({
        "currency": None,
        "price": None,
        "change1D": None,
        "change5D": None,
        "change1M": None,
        "changeYTD": None,
        "marketCap": None,
        "dataOk": False,
        "error": None,
    })
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="1y", interval="1d", auto_adjust=False)
        if hist is None or hist.empty:
            raise RuntimeError("no price history")
        closes = [fmt_num(v) for v in hist["Close"].dropna().tolist()]
        dates = list(hist["Close"].dropna().index)
        if not closes:
            raise RuntimeError("no closes")
        price = closes[-1]
        prev = closes[-2] if len(closes) >= 2 else None
        five = closes[-6] if len(closes) >= 6 else closes[0]
        month = closes[-22] if len(closes) >= 22 else closes[0]
        latest_year = int(getattr(dates[-1], "year"))
        ytd_close = None
        for d, c in zip(dates, closes):
            if int(getattr(d, "year")) == latest_year:
                ytd_close = c
                break
        info = {}
        try:
            info = ticker.fast_info or {}
        except Exception:
            info = {}
        row.update({
            "currency": info.get("currency"),
            "price": price,
            "change1D": pct(price, prev),
            "change5D": pct(price, five),
            "change1M": pct(price, month),
            "changeYTD": pct(price, ytd_close),
            "marketCap": fmt_num(info.get("market_cap")),
            "dataOk": True,
        })
    except Exception as exc:
        row["error"] = str(exc)
    return row


def main() -> None:
    rows = [snapshot_one(item) for item in WATCHLIST]
    data = {
        "title": "Ticker Monitor",
        "updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": "yfinance snapshot; delayed market data; educational context only",
        "summary": "Price-move context for tickers mentioned across G Research House articles and thesis clusters.",
        "tickers": rows,
    }
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {OUT.relative_to(ROOT)} with {len(rows)} tickers")
    failures = [r for r in rows if not r.get("dataOk")]
    if failures:
        print("missing:", ", ".join(f"{r['symbol']} ({r['error']})" for r in failures))


if __name__ == "__main__":
    main()

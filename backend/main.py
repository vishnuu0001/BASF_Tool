from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="BASF LMP WP1 Simulation Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Scoring Logic ---
class AppMetrics(BaseModel):
    dc: int;
    tf: int;
    dr: int;
    der: int;
    er: int;
    gross: float


def calculate_confidence(m: AppMetrics):
    # Confidence Score Calculation
    avg_score = (m.dc + m.tf + m.dr + m.der + m.er)
    conf_pct = (avg_score / 25) * 100

    # Banding Logic
    if conf_pct >= 75:
        band = "High (Committable)"
    elif conf_pct >= 50:
        band = "Medium (Conditional)"
    else:
        band = "Low (Aspirational)"

    # Weighted Savings Calculation
    weighted = (conf_pct / 100) * m.gross
    return round(conf_pct, 1), band, round(weighted, 2)


@app.get("/api/v1/portfolio")
async def get_portfolio_simulation():
    portfolio_data = [
        # 1. Finance Segment
        {
            "segment": "Finance & GBS",
            "apps": [
                {
                    "id": "A-101", "name": "Legacy Finance Reporting Tool", "gross": 1.10,
                    "dc": 5, "tf": 5, "dr": 4, "der": 5, "er": 4,
                    "strategy": "Elimination First",
                    "findings": ["Redundant with Target Architecture 2030", "High manual data reconciliation",
                                 "License expires Q3 2026"]
                },
                {
                    "id": "A-699", "name": "Shadow IT Collaboration Tool", "gross": 0.38,
                    "dc": 5, "tf": 5, "dr": 5, "der": 4, "er": 5,
                    "strategy": "Elimination",
                    "findings": ["Duplicate of standard MS Teams", "Security non-compliant", "High data leakage risk"]
                }
            ]
        },
        # 2. Supply Chain Segment
        {
            "segment": "Supply Chain & Logistics",
            "apps": [
                {
                    "id": "A-214", "name": "Custom Procurement Workflow", "gross": 0.95,
                    "dc": 4, "tf": 4, "dr": 3, "der": 4, "er": 3,
                    "strategy": "Migration",
                    "findings": ["Move to BASF SAP Core", "Technical debt > 40%", "Process standardization required"]
                }
            ]
        },
        # 3. R&D Segment (Previously Missing)
        {
            "segment": "R&D & Innovation",
            "apps": [
                {
                    "id": "A-387", "name": "R&D Lab Data Tracker", "gross": 0.85,
                    "dc": 3, "tf": 3, "dr": 2, "der": 3, "er": 2,
                    "strategy": "Retain & Modernize",
                    "findings": ["Niche functionality not in global ERP", "Low integration readiness",
                                 "User adoption key challenge"]
                }
            ]
        },
        # 4. Operations Segment (Previously Missing)
        {
            "segment": "Operations & Manufacturing",
            "apps": [
                {
                    "id": "A-512", "name": "Plant Maintenance Desktop App", "gross": 1.20,
                    "dc": 4, "tf": 2, "dr": 2, "der": 3, "er": 2,
                    "strategy": "Re-platform",
                    "findings": ["Legacy OS dependency (Win7)", "Critical for shift handover", "High latency issues"]
                }
            ]
        }
    ]

    # Calculate Totals
    for seg in portfolio_data:
        seg_weighted = 0
        for app in seg["apps"]:
            c, b, w = calculate_confidence(AppMetrics(
                gross=app['gross'], dc=app['dc'], tf=app['tf'], dr=app['dr'], der=app['der'], er=app['er']
            ))
            app.update({"confidence": c, "band": b, "weighted": w})
            seg_weighted += w
        seg["total_weighted"] = round(seg_weighted, 2)

    return {
        "portfolio": portfolio_data,
        "governance": {
            "raci": [
                {"task": "Scope Decision", "ddo": "X", "it": "Y", "board": "Y"},
                {"task": "Savings Approval", "ddo": "X", "it": "Y", "board": "X"},
                {"task": "Data Quality Sign-off", "ddo": "Y", "it": "X", "board": "Y"},
                {"task": "Phase-Gate Readiness", "ddo": "Y", "it": "Y", "board": "X"}
            ],
            "gates": [
                "Minimum data completeness threshold met",
                "Cost allocation logic agreed",
                "Stakeholder alignment workshops completed",
                "Target Architecture 2030 alignment baseline established"
            ]
        },
        "change_management": {
            "comms_plan": [
                {"week": "W1", "title": "Mobilization", "desc": "Kickoff & Success Criteria"},
                {"week": "W2", "title": "Standards", "desc": "Arch Alignment & Guardrails"},
                {"week": "W3", "title": "Readiness", "desc": "Segment Onboarding"},
                {"week": "W4", "title": "Go-Live", "desc": "Sprint 0 & Dashboard Validation"}
            ],
            "stakeholders": [
                {"name": "Board of Directors", "impact": "High", "focus": "Strategic Oversight",
                 "strategy": "Executive readouts & portfolio steering"},
                {"name": "DDO & Architecture", "impact": "Critical", "focus": "Future Readiness",
                 "strategy": "Architecture alignment workshops"},
                {"name": "Information Managers", "impact": "Critical", "focus": "Data Integrity",
                 "strategy": "Process stewardship & validation"}
            ]
        }
    }
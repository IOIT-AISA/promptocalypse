with open("backend/app/routes/game.py", "r") as f:
    content = f.read()

import re

# Insert ScenarioResponse import
content = content.replace("    LeaderboardEntry,\n    SubmitKeyRequest,\n    SubmitKeyResponse,\n    UserStateResponse,\n)", "    LeaderboardEntry,\n    SubmitKeyRequest,\n    SubmitKeyResponse,\n    UserStateResponse,\n    ScenarioResponse,\n)")

new_route = """
@router.get("/scenario/{level}", response_model=ScenarioResponse)
async def get_scenario(level: int) -> ScenarioResponse:
    \"\"\"Retrieve scenario data for a given level (Issue #46).\"\"\"
    scenarios = {
        1: {
            "target": "RefundBot-9000",
            "scenario": "E-commerce bot with a master refund code.",
            "attack_vector": "Social engineering / roleplay.",
        },
        2: {
            "target": "SysAdmin-Omega",
            "scenario": "IT Helpdesk behind a keyword firewall blocking 'password', 'key', etc.",
            "attack_vector": "Synonyms, translation, technical framing.",
        },
        3: {
            "target": "Project Blackout",
            "scenario": "Military AI behind an egress scrubber that masks the flag on the way out.",
            "attack_vector": "Cryptography, encoding, text formatting.",
        }
    }
    
    if level not in scenarios:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scenario for level {level} not found",
        )
        
    data = scenarios[level]
    return ScenarioResponse(
        level=level,
        target=data["target"],
        scenario=data["scenario"],
        attack_vector=data["attack_vector"],
    )
"""

content += new_route

with open("backend/app/routes/game.py", "w") as f:
    f.write(content)

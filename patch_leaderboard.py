with open("backend/app/routes/game.py", "r") as f:
    content = f.read()

import re

pattern = r'async def get_leaderboard\(\) -> list\[LeaderboardEntry\]:.*?return entries'

new_code = """async def get_leaderboard() -> list[LeaderboardEntry]:
    \"\"\"
    Retrieve ranked leaderboard of participants.
    
    Tier 1 (Completed): Fetch users where completed_at IS NOT NULL
    ordered by final_score DESC, total_prompts ASC, total_chars ASC.
    
    Tier 2 (Active): Fetch users where completed_at IS NULL
    ordered by current_level DESC, total_prompts ASC, total_chars ASC.
    
    Concatenates the lists and dynamically assigns the rank integer iteratively.
    \"\"\"
    async with get_db_context() as db:
        # Tier 1: Completed
        cursor1 = await db.execute(
            \"\"\"
            SELECT
                username, current_level, completed_at, start_time,
                total_prompts, total_chars, final_score
            FROM users
            WHERE is_disqualified = 0 AND completed_at IS NOT NULL
            ORDER BY final_score DESC, total_prompts ASC, total_chars ASC
            LIMIT 50
            \"\"\"
        )
        tier1_rows = await cursor1.fetchall()

        # Tier 2: Active
        cursor2 = await db.execute(
            \"\"\"
            SELECT
                username, current_level, completed_at, start_time,
                total_prompts, total_chars, final_score
            FROM users
            WHERE is_disqualified = 0 AND completed_at IS NULL
            ORDER BY current_level DESC, total_prompts ASC, total_chars ASC
            LIMIT 50
            \"\"\"
        )
        tier2_rows = await cursor2.fetchall()

    all_rows = tier1_rows + tier2_rows
    # enforce overall limit of 50
    all_rows = all_rows[:50]

    now_iso = datetime.now(timezone.utc).isoformat()
    entries: list[LeaderboardEntry] = []
    
    for rank, row in enumerate(all_rows, start=1):
        end_time_str = row["completed_at"] if row["completed_at"] else now_iso
        duration_seconds = _compute_duration_seconds(
            row["start_time"], end_time_str
        )
        completed = row["completed_at"] is not None
        entries.append(
            LeaderboardEntry(
                rank=rank,
                username=row["username"],
                current_level=row["current_level"],
                completed=completed,
                final_score=row["final_score"],
                total_prompts=row["total_prompts"],
                total_chars=row["total_chars"],
                duration_seconds=duration_seconds,
                status="Completed" if completed else "In Progress"
            )
        )

    return entries"""

content = re.sub(pattern, new_code, content, flags=re.DOTALL)

with open("backend/app/routes/game.py", "w") as f:
    f.write(content)

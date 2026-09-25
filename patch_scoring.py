with open("backend/app/scoring.py", "r") as f:
    content = f.read()

old_check = """        if completed_at is not None:
            await db.rollback()
            return {
                "status": STATUS_ALREADY_COMPLETED,
                "message": "Challenge already completed",
            }"""

new_check = """        if completed_at is not None:
            await db.rollback()
            return {
                "status": STATUS_ALREADY_COMPLETED,
                "message": "Challenge already completed",
            }

        # Issue #55: 120-minute global time limit
        if elapsed_minutes(start_time, now_iso) >= 120:
            final_score = calculate_final_score(prompts, 120, fails)
            await db.execute(
                "UPDATE users SET completed_at = ?, final_score = ? WHERE id = ?",
                (now_iso, final_score, user_id)
            )
            await db.commit()
            return {
                "status": "time_limit_exceeded",
                "message": "Time limit exceeded. Arena locked.",
            }"""

content = content.replace(old_check, new_check)

with open("backend/app/scoring.py", "w") as f:
    f.write(content)

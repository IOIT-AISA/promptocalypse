import re

with open("backend/app/routes/chat.py", "r") as f:
    content = f.read()

# I need to parse start_time, check elapsed minutes, if >= 120, update user and throw 403.
old_query = '"SELECT current_level, completed_at FROM users WHERE id = ?",'
new_query = '"SELECT current_level, completed_at, start_time, total_prompts, failed_attempts FROM users WHERE id = ?",'

content = content.replace(old_query, new_query)

old_check = """            if user_row["completed_at"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Arena already completed!",
                )

            level = user_row["current_level"]"""

new_check = """            if user_row["completed_at"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Arena already completed!",
                )

            # Check 120 minute time limit (Issue #55)
            from app.scoring import elapsed_minutes, calculate_final_score
            from datetime import datetime, timezone
            now_iso = datetime.now(timezone.utc).isoformat()
            if elapsed_minutes(user_row["start_time"], now_iso) >= 120:
                final_score = calculate_final_score(
                    user_row["total_prompts"], 120, user_row["failed_attempts"]
                )
                await db.execute(
                    "UPDATE users SET completed_at = ?, final_score = ? WHERE id = ?",
                    (now_iso, final_score, request.user_id)
                )
                await db.commit()
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Time limit exceeded. Arena locked.",
                )

            level = user_row["current_level"]"""

content = content.replace(old_check, new_check)

with open("backend/app/routes/chat.py", "w") as f:
    f.write(content)

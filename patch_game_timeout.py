with open("backend/app/routes/game.py", "r") as f:
    content = f.read()

new_check = """    if outcome == "time_limit_exceeded":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Time limit exceeded. Arena locked.",
        )

    if outcome == STATUS_NOT_FOUND:"""

content = content.replace("    if outcome == STATUS_NOT_FOUND:", new_check)

with open("backend/app/routes/game.py", "w") as f:
    f.write(content)

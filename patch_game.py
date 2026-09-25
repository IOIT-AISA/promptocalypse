import re

with open("backend/app/routes/game.py", "r") as f:
    content = f.read()

limiter_check_code = """
    try:
        limiter.check(request.user_id)
    except HTTPException as e:
        logger.warning(
            "Rate limit cooldown active for submit-key",
            extra={
                "event": "submit_key_rate_limit_exceeded",
                "user_id": request.user_id,
                "status_code": status.HTTP_429_TOO_MANY_REQUESTS,
                "detail": e.detail,
            },
        )
        raise e

    async with get_db_context() as db:"""

content = content.replace("    async with get_db_context() as db:", limiter_check_code)

record_attempt_code = """    outcome = result["status"]
    
    is_correct = outcome in (STATUS_CORRECT, STATUS_COMPLETED)
    limiter.record_attempt(request.user_id, is_correct)"""

content = content.replace('    outcome = result["status"]', record_attempt_code)

with open("backend/app/routes/game.py", "w") as f:
    f.write(content)

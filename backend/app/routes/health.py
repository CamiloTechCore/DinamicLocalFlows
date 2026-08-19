from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def api_health():
    return {
        "status": "healthy",
        "service": "DinamicLocalFlows",
        "version": "0.1.0",
    }

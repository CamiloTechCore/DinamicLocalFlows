from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import logging

from app.services.export_service import export_service
from app.services.file_manager import file_manager
from app.models.flow import ExportResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/{flow_id}", response_model=ExportResponse)
async def export_flow_ascii(
    flow_id: str,
    workspace: Optional[str] = Query(None),
    format: str = Query("tree", pattern="^(tree|table|compact)$"),
):
    try:
        flow = file_manager.get_flow(flow_id, workspace)
        if not flow:
            raise HTTPException(status_code=404, detail="Flow not found")
        if format == "table":
            ascii_art = export_service.export_flow_table(flow)
        elif format == "compact":
            ascii_art = export_service.export_flow_compact(flow)
        else:
            ascii_art = export_service.export_flow(flow)
        return ExportResponse(
            success=True,
            flowId=flow_id,
            flowName=flow["name"],
            ascii=ascii_art,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error exporting: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

from fastapi import APIRouter, HTTPException, Body
import logging

from app.models.flow import Workspace, WorkspaceCreate, WorkspaceListResponse
from app.services.file_manager import file_manager

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("", status_code=201)
async def create_workspace(workspace_data: WorkspaceCreate = Body(...)):
    try:
        file_manager.create_workspace(workspace_data.model_dump())
        workspace = file_manager.get_workspace(workspace_data.name)
        return {"success": True, "message": "Workspace created successfully", "data": workspace}
    except Exception as e:
        logger.error(f"Error creating workspace: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=WorkspaceListResponse)
async def list_workspaces():
    try:
        workspaces_data = file_manager.list_workspaces()
        workspaces = [Workspace(**w) for w in workspaces_data]
        return WorkspaceListResponse(success=True, data=workspaces, count=len(workspaces))
    except Exception as e:
        logger.error(f"Error listing workspaces: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{workspace_name}")
async def get_workspace(workspace_name: str):
    workspace = file_manager.get_workspace(workspace_name)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return {"success": True, "data": workspace}

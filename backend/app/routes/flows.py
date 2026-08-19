from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional
import logging

from app.models.flow import Flow, FlowCreate, FlowUpdate, FlowResponse, FlowListResponse
from app.services.file_manager import file_manager

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("", response_model=FlowResponse, status_code=201)
async def create_flow(flow_data: FlowCreate = Body(...)):
    try:
        flow_dict = flow_data.model_dump()
        result = file_manager.save_flow(flow_dict)
        saved_flow = file_manager.get_flow(result["id"], flow_dict.get("workspace"))
        return FlowResponse(success=True, message="Flow created successfully", data=Flow(**saved_flow))
    except Exception as e:
        logger.error(f"Error creating flow: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error creating flow: {str(e)}")


@router.get("", response_model=FlowListResponse)
async def list_flows(workspace: Optional[str] = Query(None)):
    try:
        flows_data = file_manager.list_flows(workspace)
        flows = [Flow(**flow) for flow in flows_data]
        return FlowListResponse(success=True, data=flows, count=len(flows), workspace=workspace)
    except Exception as e:
        logger.error(f"Error listing flows: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error listing flows: {str(e)}")


@router.get("/{flow_id}", response_model=FlowResponse)
async def get_flow(
    flow_id: str,
    workspace: Optional[str] = Query(None),
    include_subflows: bool = Query(False),
):
    try:
        if include_subflows:
            flow_data = file_manager.get_flow_with_subflows(flow_id, workspace)
        else:
            flow_data = file_manager.get_flow(flow_id, workspace)
        if not flow_data:
            raise HTTPException(status_code=404, detail=f"Flow {flow_id} not found")
        return FlowResponse(success=True, message="Flow retrieved successfully", data=Flow(**flow_data))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting flow: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error getting flow: {str(e)}")


@router.put("/{flow_id}", response_model=FlowResponse)
async def update_flow(
    flow_id: str,
    flow_update: FlowUpdate = Body(...),
    workspace: Optional[str] = Query(None),
):
    try:
        update_dict = {k: v for k, v in flow_update.model_dump().items() if v is not None}
        update_dict["workspace"] = workspace
        result = file_manager.update_flow(flow_id, update_dict)
        if not result["success"]:
            raise HTTPException(status_code=404, detail="Flow not found")
        updated_flow = file_manager.get_flow(flow_id, workspace)
        return FlowResponse(success=True, message="Flow updated successfully", data=Flow(**updated_flow))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating flow: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error updating flow: {str(e)}")


@router.delete("/{flow_id}", status_code=204)
async def delete_flow(flow_id: str, workspace: Optional[str] = Query(None)):
    try:
        result = file_manager.delete_flow(flow_id, workspace)
        if not result["success"]:
            raise HTTPException(status_code=404, detail="Flow not found")
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting flow: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error deleting flow: {str(e)}")


@router.get("/{flow_id}/summary", tags=["Analysis"])
async def get_flow_summary(flow_id: str, workspace: Optional[str] = Query(None)):
    try:
        flow_data = file_manager.get_flow(flow_id, workspace)
        if not flow_data:
            raise HTTPException(status_code=404, detail="Flow not found")
        nodes = flow_data.get("nodes", [])
        edges = flow_data.get("edges", [])
        node_types = {}
        for node in nodes:
            node_type = node.get("type", "unknown")
            node_types[node_type] = node_types.get(node_type, 0) + 1
        return {
            "success": True,
            "flowId": flow_id,
            "flowName": flow_data.get("name"),
            "summary": {
                "totalNodes": len(nodes),
                "totalEdges": len(edges),
                "nodeTypes": node_types,
                "hasSubflows": any(n.get("type") == "subflow" for n in nodes),
                "createdAt": flow_data.get("createdAt"),
                "updatedAt": flow_data.get("updatedAt"),
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting summary: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error getting summary: {str(e)}")


@router.post("/{flow_id}/duplicate", response_model=FlowResponse, status_code=201)
async def duplicate_flow(
    flow_id: str,
    new_name: str = Query(...),
    workspace: Optional[str] = Query(None),
):
    try:
        original = file_manager.get_flow(flow_id, workspace)
        if not original:
            raise HTTPException(status_code=404, detail="Flow not found")
        copy_data = original.copy()
        copy_data["name"] = new_name
        copy_data.pop("id", None)
        result = file_manager.save_flow(copy_data)
        saved_copy = file_manager.get_flow(result["id"], workspace)
        return FlowResponse(
            success=True,
            message=f"Flow duplicated as '{new_name}'",
            data=Flow(**saved_copy),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error duplicating flow: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error duplicating flow: {str(e)}")

"""
Servicio de Gestión de Archivos JSON
Maneja la lectura, escritura y organización de flujos en el sistema de archivos local
"""

import json
import uuid
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class FileManager:
    BASE_PATH = Path("database")
    FLOWS_PATH = BASE_PATH / "flows"
    WORKSPACES_PATH = BASE_PATH / "workspaces"

    def __init__(self):
        self._ensure_directories()

    @staticmethod
    def _ensure_directories():
        FileManager.FLOWS_PATH.mkdir(parents=True, exist_ok=True)
        FileManager.WORKSPACES_PATH.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def _generate_filename(name: str, file_id: Optional[str] = None) -> str:
        if file_id is None:
            file_id = str(uuid.uuid4())
        clean_name = "".join(c if c.isalnum() or c in ["_", "-"] else "_" for c in name)
        clean_name = clean_name[:50]
        return f"{clean_name}_{file_id}.json"

    @staticmethod
    def _get_flow_path(filename: str, workspace: Optional[str] = None) -> Path:
        if workspace:
            workspace_path = FileManager.FLOWS_PATH / workspace
            workspace_path.mkdir(parents=True, exist_ok=True)
            return workspace_path / filename
        return FileManager.FLOWS_PATH / filename

    @staticmethod
    def save_flow(flow_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            flow_id = flow_data.get("id") or str(uuid.uuid4())
            flow_data["id"] = flow_id
            now = datetime.utcnow().isoformat()
            flow_data["createdAt"] = flow_data.get("createdAt", now)
            flow_data["updatedAt"] = now
            filename = FileManager._generate_filename(flow_data["name"], flow_id)
            workspace = flow_data.get("workspace")
            filepath = FileManager._get_flow_path(filename, workspace)
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(flow_data, f, indent=2, ensure_ascii=False)
            logger.info(f"Flow saved: {filepath}")
            return {"success": True, "id": flow_id, "filepath": str(filepath), "filename": filename}
        except Exception as e:
            logger.error(f"Error saving flow: {str(e)}")
            raise

    @staticmethod
    def get_flow(flow_id: str, workspace: Optional[str] = None) -> Optional[Dict[str, Any]]:
        try:
            search_paths = []
            if workspace:
                search_paths.append(FileManager.FLOWS_PATH / workspace)
            else:
                search_paths.append(FileManager.FLOWS_PATH)
                for sub in FileManager.FLOWS_PATH.iterdir():
                    if sub.is_dir():
                        search_paths.append(sub)

            for search_path in search_paths:
                if not search_path.exists():
                    continue
                for filepath in search_path.glob(f"*_{flow_id}.json"):
                    with open(filepath, "r", encoding="utf-8") as f:
                        return json.load(f)
            return None
        except Exception as e:
            logger.error(f"Error reading flow: {str(e)}")
            raise

    @staticmethod
    def update_flow(flow_id: str, flow_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            workspace = flow_data.get("workspace")
            current_flow = FileManager.get_flow(flow_id, workspace)
            if not current_flow:
                raise ValueError(f"Flow {flow_id} not found")
            current_flow.update(flow_data)
            current_flow["id"] = flow_id
            current_flow["updatedAt"] = datetime.utcnow().isoformat()
            filename = FileManager._generate_filename(current_flow["name"], flow_id)
            filepath = FileManager._get_flow_path(filename, workspace or current_flow.get("workspace"))
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(current_flow, f, indent=2, ensure_ascii=False)
            return {"success": True, "id": flow_id, "message": "Flow updated successfully"}
        except Exception as e:
            logger.error(f"Error updating flow: {str(e)}")
            raise

    @staticmethod
    def delete_flow(flow_id: str, workspace: Optional[str] = None) -> Dict[str, Any]:
        try:
            search_paths = []
            if workspace:
                search_paths.append(FileManager.FLOWS_PATH / workspace)
            else:
                search_paths.append(FileManager.FLOWS_PATH)
                for sub in FileManager.FLOWS_PATH.iterdir():
                    if sub.is_dir():
                        search_paths.append(sub)

            for search_path in search_paths:
                if not search_path.exists():
                    continue
                for filepath in search_path.glob(f"*_{flow_id}.json"):
                    filepath.unlink()
                    return {"success": True, "id": flow_id, "message": "Flow deleted successfully"}
            raise ValueError(f"Flow {flow_id} not found")
        except Exception as e:
            logger.error(f"Error deleting flow: {str(e)}")
            raise

    @staticmethod
    def list_flows(workspace: Optional[str] = None) -> List[Dict[str, Any]]:
        try:
            flows = []
            if workspace:
                search_path = FileManager.FLOWS_PATH / workspace
            else:
                search_path = FileManager.FLOWS_PATH
            if not search_path.exists():
                return []
            for filepath in search_path.rglob("*.json"):
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        flows.append(json.load(f))
                except json.JSONDecodeError:
                    logger.warning(f"Invalid JSON file: {filepath}")
            return flows
        except Exception as e:
            logger.error(f"Error listing flows: {str(e)}")
            raise

    @staticmethod
    def create_workspace(workspace_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            workspace_name = workspace_data["name"]
            filepath = FileManager.WORKSPACES_PATH / f"{workspace_name}.json"
            workspace_data["createdAt"] = datetime.utcnow().isoformat()
            workspace_data["flowCount"] = 0
            (FileManager.FLOWS_PATH / workspace_name).mkdir(parents=True, exist_ok=True)
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(workspace_data, f, indent=2, ensure_ascii=False)
            return {"success": True, "name": workspace_name, "message": "Workspace created successfully"}
        except Exception as e:
            logger.error(f"Error creating workspace: {str(e)}")
            raise

    @staticmethod
    def get_workspace(workspace_name: str) -> Optional[Dict[str, Any]]:
        try:
            filepath = FileManager.WORKSPACES_PATH / f"{workspace_name}.json"
            if filepath.exists():
                with open(filepath, "r", encoding="utf-8") as f:
                    workspace = json.load(f)
                flows = FileManager.list_flows(workspace_name)
                workspace["flowCount"] = len(flows)
                return workspace
            return None
        except Exception as e:
            logger.error(f"Error reading workspace: {str(e)}")
            raise

    @staticmethod
    def list_workspaces() -> List[Dict[str, Any]]:
        try:
            workspaces = []
            if FileManager.WORKSPACES_PATH.exists():
                for filepath in FileManager.WORKSPACES_PATH.glob("*.json"):
                    try:
                        with open(filepath, "r", encoding="utf-8") as f:
                            workspace = json.load(f)
                        flows = FileManager.list_flows(workspace["name"])
                        workspace["flowCount"] = len(flows)
                        workspaces.append(workspace)
                    except json.JSONDecodeError:
                        logger.warning(f"Invalid JSON file: {filepath}")
            return workspaces
        except Exception as e:
            logger.error(f"Error listing workspaces: {str(e)}")
            raise

    @staticmethod
    def get_flow_with_subflows(flow_id: str, workspace: Optional[str] = None) -> Optional[Dict[str, Any]]:
        try:
            flow = FileManager.get_flow(flow_id, workspace)
            if not flow:
                return None
            for node in flow.get("nodes", []):
                if node.get("type") == "subflow" and "reference" in node.get("data", {}):
                    ref = node["data"]["reference"]
                    subflow_id = ref.split("_")[-1].replace(".json", "")
                    subflow = FileManager.get_flow(subflow_id, workspace)
                    if subflow:
                        node["data"]["resolvedSubflow"] = subflow
            return flow
        except Exception as e:
            logger.error(f"Error resolving subflows: {str(e)}")
            raise


file_manager = FileManager()

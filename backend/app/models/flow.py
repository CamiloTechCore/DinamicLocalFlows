from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class NodeType(str, Enum):
    START = "start"
    END = "end"
    PROCESS = "process"
    DECISION = "decision"
    SUBFLOW = "subflow"
    INPUT = "input"
    OUTPUT = "output"


class EdgeType(str, Enum):
    DEFAULT = "default"
    CONDITIONAL = "conditional"
    LOOP = "loop"


class Position(BaseModel):
    x: float
    y: float


class NodeData(BaseModel):
    description: Optional[str] = None
    trigger: Optional[str] = None
    status: Optional[str] = None
    reference: Optional[str] = None
    conditions: Optional[List[Dict[str, str]]] = None
    outputs: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = {}


class Node(BaseModel):
    id: str
    type: NodeType
    label: str
    position: Position
    data: NodeData = Field(default_factory=NodeData)
    style: Optional[Dict[str, Any]] = None


class Edge(BaseModel):
    id: str
    source: str
    target: str
    type: EdgeType = EdgeType.DEFAULT
    data: Optional[Dict[str, Any]] = None
    animated: Optional[bool] = False


class FlowCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    workspace: Optional[str] = None
    nodes: List[Node] = Field(default_factory=list)
    edges: List[Edge] = Field(default_factory=list)

    @field_validator("name")
    @classmethod
    def name_must_be_alphanumeric(cls, v):
        if not v.replace(" ", "").replace("_", "").isalnum():
            raise ValueError("Name must contain only letters, numbers, spaces and underscores")
        return v


class FlowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    nodes: Optional[List[Node]] = None
    edges: Optional[List[Edge]] = None


class Flow(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    version: str = "1.0.0"
    workspace: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
    nodes: List[Node]
    edges: List[Edge]


class WorkspaceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=500)
    icon: Optional[str] = None


class Workspace(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    createdAt: datetime
    flowCount: int = 0


class FlowResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Flow] = None
    error: Optional[str] = None


class FlowListResponse(BaseModel):
    success: bool
    data: List[Flow]
    count: int
    workspace: Optional[str] = None


class ExportResponse(BaseModel):
    success: bool
    flowId: str
    flowName: str
    ascii: str
    mimeType: str = "text/plain"


class WorkspaceListResponse(BaseModel):
    success: bool
    data: List[Workspace]
    count: int

"""
FastAPI Backend - DinamicLocalFlows
Punto de entrada principal de la aplicación
"""

import os
from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes import flows, workspaces, export, health

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting DinamicLocalFlows Backend...")
    os.makedirs("database/flows", exist_ok=True)
    os.makedirs("database/workspaces", exist_ok=True)
    logger.info("Database directories initialized")
    yield
    logger.info("Stopping DinamicLocalFlows Backend...")


app = FastAPI(
    title="DinamicLocalFlows API",
    description="API local para gestión de diagramas de flujo interactivos",
    version="0.1.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "DinamicLocalFlows",
        "version": "0.1.0",
    }


app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(flows.router, prefix="/api/flows", tags=["Flows"])
app.include_router(workspaces.router, prefix="/api/workspaces", tags=["Workspaces"])
app.include_router(export.router, prefix="/api/export", tags=["Export"])


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "status_code": 500},
    )


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to DinamicLocalFlows API",
        "docs": "/api/docs",
        "openapi": "/api/openapi.json",
    }


@app.get("/api", tags=["Root"])
async def api_root():
    return {
        "message": "DinamicLocalFlows API v0.1.0",
        "endpoints": {
            "flows": "/api/flows",
            "workspaces": "/api/workspaces",
            "export": "/api/export",
            "docs": "/api/docs",
        },
    }

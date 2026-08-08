import uvicorn
import os
from pathlib import Path

if __name__ == "__main__":
    # Crear directorios
    Path("database/flows").mkdir(parents=True, exist_ok=True)
    Path("database/workspaces").mkdir(parents=True, exist_ok=True)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from .core import preload
from .database import close_session
from .api import routers

try:
    preload()
except Exception as e:
    print(f"Preload failed: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup code
    print("App Startup!")
    yield
    # shutdown code
    close_session()
    print("App Shutdown!")
    

app = FastAPI(debug=True, lifespan=lifespan)

origins = [
    "http://localhost:3000",
    # add the local ip for frontend as well
]

for router in routers:
    app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    # reload means auto-restart the server everytime a change is made
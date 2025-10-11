import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager
from .core import preload
from .database import close_session
from .api import routers
from os import getenv


preload(load_data=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup code
    print("App Startup!")
    yield
    # shutdown code
    close_session()
    print("App Shutdown!")
    

app = FastAPI(debug=True, lifespan=lifespan)

# origins = [
#     "http://localhost:3000",

#     CORSMiddleware
#     # add the local ip for frontend as well
# ]


# app.add_middleware(
#     origins
# )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://share-a-dish-demo.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



for router in routers:
    app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    # reload means auto-restart the server everytime a change is made
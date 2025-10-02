import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.preload import preload 

preload()  

app = FastAPI(debug=True)

origins = [
    "http://localhost:3000",
    # add the local ip for frontend as well
]

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    # reload means auto-restart the server everytime a change is made
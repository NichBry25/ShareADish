from .user import router as user_router
from .recipe import router as recipe_router
from .ai import router as ai_router
routers = [user_router, recipe_router, ai_router]
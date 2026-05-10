from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.notify import router as notify_router
from api.contact import router as contact_router
from api.login import router as login_router
from api.register import router as register_router
from api.request_reset import router as request_reset_router
from api.reset_password import router as reset_password_router
from api.profile import router as profile_router
from api.user import router as user_router
from api.progress import router as progress_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notify_router, prefix="/api")
app.include_router(contact_router, prefix="/api")
app.include_router(login_router, prefix="/api")
app.include_router(register_router, prefix="/api")
app.include_router(request_reset_router, prefix="/api")
app.include_router(reset_password_router, prefix="/api")
app.include_router(profile_router, prefix="/api")
app.include_router(user_router, prefix="/api")
app.include_router(progress_router, prefix="/api")
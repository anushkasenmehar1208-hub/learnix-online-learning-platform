import os

from sqlmodel import create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://lenujan@localhost/learnix")

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+psycopg://",
        1
    )

engine = create_engine(DATABASE_URL)

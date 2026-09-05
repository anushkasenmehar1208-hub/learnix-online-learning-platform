import os

from sqlmodel import create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://lenujan@localhost/learnix")

engine = create_engine(DATABASE_URL)

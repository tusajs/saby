from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine, select
from sqlalchemy.dialects.sqlite import insert
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column


engine = create_engine("sqlite:///" + str(Path(__file__).with_name("salon.sqlite3")))


class Base(DeclarativeBase):
    pass


class Master(Base):
    __tablename__ = "masters"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    specialization: Mapped[str]


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    with Session(engine) as session, session.begin():
        session.execute(insert(Master).on_conflict_do_nothing(index_elements=["id"]), [
            {"id": 1, "name": "Анна", "specialization": "Парикмахер"},
            {"id": 2, "name": "Мария", "specialization": "Визажист"},
        ])
    yield


app = FastAPI(lifespan=lifespan)


def master_info(master: Master):
    return {"id": master.id, "name": master.name, "specialization": master.specialization}


@app.get("/masters")
def list_masters(specialization: str | None = None):
    query = select(Master).order_by(Master.id)
    if specialization is not None:
        query = query.where(Master.specialization == specialization)
    with Session(engine) as session:
        return [master_info(master) for master in session.scalars(query)]


@app.get("/masters/{master_id}")
def get_master(master_id: int):
    with Session(engine) as session:
        master = session.get(Master, master_id)
        if master is None:
            raise HTTPException(404, "Master not found")
        return master_info(master)

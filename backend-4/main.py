from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, StringConstraints
from sqlalchemy import ForeignKey, create_engine
from sqlalchemy.dialects.sqlite import insert
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column


engine = create_engine("sqlite:///" + str(Path(__file__).with_name("salon.sqlite3")))


class Base(DeclarativeBase):
    pass


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    title: Mapped[str]
    desc: Mapped[str]
    duration: Mapped[int]
    price: Mapped[float]


ShortText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]


class ServiceCreate(BaseModel):
    categoryId: int = Field(gt=0)
    title: ShortText
    desc: ShortText
    duration: int = Field(ge=30, le=180)
    price: float = Field(gt=0, allow_inf_nan=False)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    names = ["Стрижки и укладки", "Маникюр и педикюр", "Брови и ресницы", "Спа-процедуры"]
    with Session(engine) as session, session.begin():
        session.execute(insert(Category).on_conflict_do_nothing(index_elements=["id"]), [
            {"id": i, "name": name} for i, name in enumerate(names, start=1)
        ])
    yield


app = FastAPI(lifespan=lifespan)


@app.post("/services", status_code=201)
def create_service(data: ServiceCreate):
    with Session(engine) as session, session.begin():
        if session.get(Category, data.categoryId) is None:
            raise HTTPException(404, "Category not found")
        service = Service(category_id=data.categoryId, **data.model_dump(exclude={"categoryId"}))
        session.add(service)
        session.flush()
        return {"id": service.id, **data.model_dump()}

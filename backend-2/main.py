from fastapi import FastAPI, HTTPException


app = FastAPI(title="Услуги салона")

categories = {
    1: "Стрижки и укладки",
    2: "Маникюр и педикюр",
    3: "Брови и ресницы",
    4: "Спа-процедуры",
}

services = {
    1: ["Стрижка", "Укладка", "Окрашивание"],
    2: ["Маникюр", "Педикюр"],
    3: ["Коррекция бровей", "Ламинирование ресниц"],
    4: ["Массаж"],
}


def category_info(category_id: int):
    return {
        "id": category_id,
        "name": categories[category_id],
        "servicesCount": len(services.get(category_id, [])),
    }


@app.get("/categories")
def list_categories():
    return [category_info(category_id) for category_id in categories]


@app.get("/categories/{category_id}")
def get_category(category_id: int):
    if category_id not in categories:
        raise HTTPException(status_code=404, detail="Category not found")
    return category_info(category_id)

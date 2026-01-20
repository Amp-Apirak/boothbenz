from typing import Any
from fastapi import FastAPI, HTTPException, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from bson.errors import InvalidId
from pydantic import BaseModel, Field
from typing import Optional

MONGO_HOST = "172.16.1.31"
MONGO_PORT = 27017
MONGO_USER = "root"
MONGO_PASS = "example"
MONGO_AUTH_DB = "admin"

MONGO_URI = (
    f"mongodb://{MONGO_USER}:{MONGO_PASS}@{MONGO_HOST}:{MONGO_PORT}/"
    f"?authSource={MONGO_AUTH_DB}"
)

client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000,
    socketTimeoutMS=10000,
)

API_PREFIX = "/benzEvents/api"

app = FastAPI(
    title="MongoDB Read API",
    docs_url=f"{API_PREFIX}/docs",
    redoc_url=f"{API_PREFIX}/redoc",
    openapi_url=f"{API_PREFIX}/openapi.json",
    version="0.0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix=API_PREFIX)

def to_jsonable(doc: Any) -> Any:
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, dict):
        return {k: to_jsonable(v) for k, v in doc.items()}
    if isinstance(doc, list):
        return [to_jsonable(x) for x in doc]
    return doc


@api.get("/health", tags=["health"])
def health():
    try:
        client.admin.command("ping")
        return {"ok": True, "mongo": "start"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Mongo not ready: {e}")


@api.get("/dbs", tags=["info data"])
def list_databases():
    try:
        dbs = client.list_database_names()
        filtered_dbs = [db for db in dbs if db.startswith("db_")]
        return {"databases": filtered_dbs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api.get("/collections", tags=["info data"])
def list_collections(
    db: str = Query(..., description="database name (required)"),
):
    try:
        return {"db": db, "collections": client[db].list_collection_names()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api.get("/documents", tags=["retrieve data"])
def get_documents(
    db: str = Query(..., description="database name (required)"),
    col: str = Query(..., description="collection name (required)"),
    skip: int = Query(default=0, ge=0),
    limit: Optional[int] = Query(
        default=None,
        ge=1,
        description="number of documents to return (omit for no limit)"
    ),
    sort_field: str = Query(default="_id"),
    sort_dir: int = Query(default=-1, description="-1 desc, 1 asc"),
):
    try:
        sort_dir = 1 if sort_dir == 1 else -1

        cursor = (
            client[db][col]
            .find({})
            .sort(sort_field, sort_dir)
            .skip(skip)
        )

        if limit is not None:
            cursor = cursor.limit(limit)

        docs = [to_jsonable(d) for d in cursor]
        return {
            "db": db,
            "collection": col,
            "count": len(docs),
            "docs": docs,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class UpdateTypeBody(BaseModel):
    type: str = Field(..., min_length=1, max_length=100, description="new type value")


@api.patch("/doc/{doc_id}/type", tags=["update data"])
def update_doc_type(
    doc_id: str,
    body: UpdateTypeBody,
    db: str = Query(..., description="database name (required)"),
    col: str = Query(..., description="collection name (required)"),
):
    try:
        oid = ObjectId(doc_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ObjectId")

    new_type = body.type.strip()
    if not new_type:
        raise HTTPException(status_code=400, detail="type must not be empty")

    try:
        result = client[db][col].update_one({"_id": oid}, {"$set": {"type": new_type}})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")

    try:
        doc = client[db][col].find_one({"_id": oid})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "ok": True,
        "db": db,
        "collection": col,
        "matched": result.matched_count,
        "modified": result.modified_count,
        "doc": to_jsonable(doc),
    }


app.include_router(api)

if __name__ == "__main__":
    import argparse
    import uvicorn

    parser = argparse.ArgumentParser(description="MongoDB Read API")
    parser.add_argument("--host", type=str, default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8111)
    parser.add_argument("--reload", action="store_true")
    args = parser.parse_args()

    print(f"Server running on http://{args.host}:{args.port}")
    print(f"Swagger UI: http://{args.host}:{args.port}{API_PREFIX}/docs")
    print(f"OpenAPI JSON: http://{args.host}:{args.port}{API_PREFIX}/openapi.json")

    uvicorn.run(app, host=args.host, port=args.port, reload=args.reload)

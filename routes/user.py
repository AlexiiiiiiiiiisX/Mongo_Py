from fastapi import APIRouter, Response
from config.db import conn
from schemas.user import userEntity, usersEntity
from models.user import User
from passlib.hash import sha256_crypt
from bson import ObjectId
from starlette.status import HTTP_204_NO_CONTENT


user = APIRouter()


@user.get("/users")
def find_all_users():
    return usersEntity(conn.local.user.find())


@user.post("/users")
def create_user(user: User):
    new_user = dict(user)
    del new_user["id"]
    new_user["password"] = sha256_crypt.encrypt(new_user["password"])

    id = conn.local.user.insert_one(new_user).inserted_id
    user = conn.local.user.find_one({"_id": id})
    return userEntity(user)

@user.put("/users/{id}")
def update_user(id: str, user: User):
    user_data = dict(user)
    if "password" in user_data:
        user_data["password"] = sha256_crypt.encrypt(user_data["password"])
    conn.local.user.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": user_data}
    )
    updated_user = conn.local.user.find_one({"_id": ObjectId(id)})
    return userEntity(updated_user)



@user.get("/users/{id}")
def find_user(id: str):
    return userEntity(conn.local.user.find_one({"_id": ObjectId(id)}))



@user.delete("/users/{id}")
def delete_user(id: str):
    userEntity(conn.local.user.find_one_and_delete({"_id": ObjectId(id)}))
    return Response(status_code=HTTP_204_NO_CONTENT)

{
"openapi": "3.1.0",
"info": {
"title": "Benz Showroom API",
"version": "0.0.1"
},
"paths": {
"/benzEvents/api/BenzEventMongo": {
"get": {
"tags": [
"Benz-event"
],
"summary": "Health Monogodb",
"operationId": "health_monogoDB_benzEvents_api_BenzEventMongo_get",
"responses": {
"200": {
"description": "Successful Response",
"content": {
"application/json": {
"schema": {

                }
              }
            }
          }
        }
      }
    },
    "/benzEvents/api/BenzEventGetDB": {
      "get": {
        "tags": [
          "Benz-event"
        ],
        "summary": "List Databases",
        "operationId": "list_databases_benzEvents_api_BenzEventGetDB_get",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/benzEvents/api/BenzEventGetCollections": {
      "get": {
        "tags": [
          "Benz-event"
        ],
        "summary": "List Collections",
        "operationId": "list_collections_benzEvents_api_BenzEventGetCollections_get",
        "parameters": [
          {
            "name": "db",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "description": "database name (required)",
              "title": "Db"
            },
            "description": "database name (required)"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/benzEvents/api/BenzEventGet": {
      "get": {
        "tags": [
          "Benz-event"
        ],
        "summary": "List Documents",
        "operationId": "list_documents_benzEvents_api_BenzEventGet_get",
        "parameters": [
          {
            "name": "db",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "description": "database name (required)",
              "title": "Db"
            },
            "description": "database name (required)"
          },
          {
            "name": "col",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "description": "collection name (required)",
              "title": "Col"
            },
            "description": "collection name (required)"
          },
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "minimum": 0,
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer",
                  "minimum": 1
                },
                {
                  "type": "null"
                }
              ],
              "description": "number of documents to return (omit for no limit)",
              "title": "Limit"
            },
            "description": "number of documents to return (omit for no limit)"
          },
          {
            "name": "sort_field",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string",
              "default": "_id",
              "title": "Sort Field"
            }
          },
          {
            "name": "sort_dir",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "description": "-1 desc, 1 asc",
              "default": -1,
              "title": "Sort Dir"
            },
            "description": "-1 desc, 1 asc"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/benzEvents/api/BenzEventUpdate/{doc_id}/type": {
      "patch": {
        "tags": [
          "Benz-event"
        ],
        "summary": "Update Documents",
        "operationId": "update_documents_benzEvents_api_BenzEventUpdate__doc_id__type_patch",
        "parameters": [
          {
            "name": "doc_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Doc Id"
            }
          },
          {
            "name": "db",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "description": "database name (required)",
              "title": "Db"
            },
            "description": "database name (required)"
          },
          {
            "name": "col",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "description": "collection name (required)",
              "title": "Col"
            },
            "description": "collection name (required)"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateTypeBody"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/benzEvents/api/benzInfoUpload": {
      "post": {
        "tags": [
          "Benz-info"
        ],
        "summary": "Upload Info",
        "operationId": "upload_info_benzEvents_api_benzInfoUpload_post",
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "$ref": "#/components/schemas/Body_upload_info_benzEvents_api_benzInfoUpload_post"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/benzEvents/api/benzInfoGet": {
      "get": {
        "tags": [
          "Benz-info"
        ],
        "summary": "List Info",
        "operationId": "list_info_benzEvents_api_benzInfoGet_get",
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "minimum": 0,
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "sort_field",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string",
              "default": "_id",
              "title": "Sort Field"
            }
          },
          {
            "name": "sort_dir",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "description": "-1 desc, 1 asc",
              "default": -1,
              "title": "Sort Dir"
            },
            "description": "-1 desc, 1 asc"
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer",
                  "minimum": 1
                },
                {
                  "type": "null"
                }
              ],
              "title": "Limit"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/benzEvents/api/benzInfoDelete/{id}": {
      "delete": {
        "tags": [
          "Benz-info"
        ],
        "summary": "Delete Info",
        "operationId": "delete_info_benzEvents_api_benzInfoDelete__id__delete",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    }

},
"components": {
"schemas": {
"Body_upload_info_benzEvents_api_benzInfoUpload_post": {
"properties": {
"database_name": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Database Name"
},
"database_label": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Database Label"
},
"txt_body": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Txt Body"
},
"txt_body_detail": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Txt Body Detail"
},
"txt_header": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Txt Header"
},
"txt_header_detail": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Txt Header Detail"
},
"txt_header2": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Txt Header2"
},
"txt_header2_detail": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Txt Header2 Detail"
},
"detail_link1": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Link1"
},
"detail_link2": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Link2"
},
"detail_link3": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Link3"
},
"detail_link4": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Link4"
},
"detail_link5": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Link5"
},
"detail_link6": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Link6"
},
"detail_link7": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Link7"
},
"detail_link8": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Link8"
},
"img_body": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Img Body"
},
"img_header": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Img Header"
},
"img_header2": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Img Header2"
},
"img_link1": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Img Link1"
},
"img_link2": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Img Link2"
},
"img_link3": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Img Link3"
},
"img_link4": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Img Link4"
},
"img_link5": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Img Link5"
},
"img_link6": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Img Link6"
},
"img_link7": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Img Link7"
},
"img_link8": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Img Link8"
},
"car_img1": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Car Img1"
},
"car_img2": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Car Img2"
},
"car_img3": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Car Img3"
},
"car_img4": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Car Img4"
},
"car_img5": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Car Img5"
},
"car_img6": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Car Img6"
},
"car_img7": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Car Img7"
},
"car_img8": {
"anyOf": [
{
"type": "string",
"format": "binary"
},
{
"type": "null"
}
],
"title": "Car Img8"
}
},
"type": "object",
"title": "Body_upload_info_benzEvents_api_benzInfoUpload_post"
},
"HTTPValidationError": {
"properties": {
"detail": {
"items": {
"$ref": "#/components/schemas/ValidationError"
},
"type": "array",
"title": "Detail"
}
},
"type": "object",
"title": "HTTPValidationError"
},
"UpdateTypeBody": {
"properties": {
"type": {
"type": "string",
"maxLength": 100,
"minLength": 1,
"title": "Type",
"description": "new type value"
}
},
"type": "object",
"required": [
"type"
],
"title": "UpdateTypeBody"
},
"ValidationError": {
"properties": {
"loc": {
"items": {
"anyOf": [
{
"type": "string"
},
{
"type": "integer"
}
]
},
"type": "array",
"title": "Location"
},
"msg": {
"type": "string",
"title": "Message"
},
"type": {
"type": "string",
"title": "Error Type"
}
},
"type": "object",
"required": [
"loc",
"msg",
"type"
],
"title": "ValidationError"
}
}
}
}

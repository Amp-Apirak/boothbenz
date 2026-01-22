{
"openapi": "3.1.0",
"info": {
"title": "MongoDB Read API",
"version": "0.0.1"
},
"paths": {
"/benzEvents/api/health": {
"get": {
"tags": [
"health"
],
"summary": "Health",
"operationId": "health_benzEvents_api_health_get",
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
    "/benzEvents/api/dbs": {
      "get": {
        "tags": [
          "info data"
        ],
        "summary": "List Databases",
        "operationId": "list_databases_benzEvents_api_dbs_get",
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
    "/benzEvents/api/collections": {
      "get": {
        "tags": [
          "info data"
        ],
        "summary": "List Collections",
        "operationId": "list_collections_benzEvents_api_collections_get",
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
    "/benzEvents/api/documents": {
      "get": {
        "tags": [
          "retrieve data"
        ],
        "summary": "Get Documents",
        "operationId": "get_documents_benzEvents_api_documents_get",
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
    "/benzEvents/api/doc/{doc_id}/type": {
      "patch": {
        "tags": [
          "update data"
        ],
        "summary": "Update Doc Type",
        "operationId": "update_doc_type_benzEvents_api_doc__doc_id__type_patch",
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
    }

},
"components": {
"schemas": {
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

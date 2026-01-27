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
    "/benzEvents/api/BenzEventSearch": {
      "get": {
        "tags": [
          "Benz-event"
        ],
        "summary": "Get Docs By Time Range",
        "operationId": "get_docs_by_time_range_benzEvents_api_BenzEventSearch_get",
        "parameters": [
          {
            "name": "db",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "description": "database name",
              "title": "Db"
            },
            "description": "database name"
          },
          {
            "name": "collection",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "description": "collection name",
              "title": "Collection"
            },
            "description": "collection name"
          },
          {
            "name": "start",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "description": "ISO datetime start Ex. 2026-01-18T09:30:00",
              "title": "Start"
            },
            "description": "ISO datetime start Ex. 2026-01-18T09:30:00"
          },
          {
            "name": "end",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "description": "ISO datetime end Ex. 2026-01-18T09:39:00",
              "title": "End"
            },
            "description": "ISO datetime end Ex. 2026-01-18T09:39:00"
          },
          {
            "name": "type",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "description": "customer | employee",
              "title": "Type"
            },
            "description": "customer | employee"
          },
          {
            "name": "gender",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "description": "man | woman",
              "title": "Gender"
            },
            "description": "man | woman"
          },
          {
            "name": "emotion",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "description": "happy | sad | neutral",
              "title": "Emotion"
            },
            "description": "happy | sad | neutral"
          },
          {
            "name": "zone",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ],
              "description": "zone number",
              "title": "Zone"
            },
            "description": "zone number"
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "maximum": 500,
              "minimum": 1,
              "default": 10,
              "title": "Limit"
            }
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
            "name": "sort",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "description": "1=เก่าไปใหม่, -1=ใหม่ไปเก่า",
              "default": -1,
              "title": "Sort"
            },
            "description": "1=เก่าไปใหม่, -1=ใหม่ไปเก่า"
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
    },
    "/benzEvents/api/benzInfoUpdate/{id}": {
      "patch": {
        "tags": [
          "Benz-info"
        ],
        "summary": "Update Info",
        "operationId": "update_info_benzEvents_api_benzInfoUpdate__id__patch",
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
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "$ref": "#/components/schemas/Body_update_info_benzEvents_api_benzInfoUpdate__id__patch"
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
    "/benzEvents/api/benzCreateDB": {
      "post": {
        "tags": [
          "Benz-info"
        ],
        "summary": "Upload Info",
        "operationId": "upload_info_benzEvents_api_benzCreateDB_post",
        "requestBody": {
          "content": {
            "application/x-www-form-urlencoded": {
              "schema": {
                "$ref": "#/components/schemas/Body_upload_info_benzEvents_api_benzCreateDB_post"
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
"Body_update_info_benzEvents_api_benzInfoUpdate**id**patch": {
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
"title": "DATABASE",
"description": "**DATABASE**"
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
"txt_header": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "HEADER",
"description": "**HEADER**"
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
"detail_link1": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "DETAIL",
"description": "**DETAIL**"
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
"detail_car1": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "CARS",
"description": "**CARS**"
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
"zone_1": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 1"
},
"color_1": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 1"
},
"detail_car2": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car2"
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
"zone_2": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 2"
},
"color_2": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 2"
},
"detail_car3": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car3"
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
"zone_3": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 3"
},
"color_3": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 3"
},
"detail_car4": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car4"
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
"zone_4": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 4"
},
"color_4": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 4"
},
"detail_car5": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car5"
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
"zone_5": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 5"
},
"color_5": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 5"
},
"detail_car6": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car6"
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
"zone_6": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 6"
},
"color_6": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 6"
},
"detail_car7": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car7"
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
"zone_7": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 7"
},
"color_7": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 7"
},
"detail_car8": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car8"
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
},
"zone_8": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 8"
},
"color_8": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 8"
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
"title": "BODY",
"description": "**BODY**"
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
}
},
"type": "object",
"title": "Body_update_info_benzEvents_api_benzInfoUpdate**id**patch"
},
"Body_upload_info_benzEvents_api_benzCreateDB_post": {
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
"title": "DATABASE"
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
"title": "LABEL"
}
},
"type": "object",
"title": "Body_upload_info_benzEvents_api_benzCreateDB_post"
},
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
"title": "DATABASE",
"description": "**DATABASE**"
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
"txt_header": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "HEADER",
"description": "**HEADER**"
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
"detail_link1": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "DETAIL",
"description": "**DETAIL**"
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
"detail_car1": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "CARS",
"description": "**CARS**"
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
"zone_1": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 1"
},
"color_1": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 1"
},
"detail_car2": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car2"
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
"zone_2": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 2"
},
"color_2": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 2"
},
"detail_car3": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car3"
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
"zone_3": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 3"
},
"color_3": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 3"
},
"detail_car4": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car4"
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
"zone_4": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 4"
},
"color_4": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 4"
},
"detail_car5": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car5"
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
"zone_5": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 5"
},
"color_5": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 5"
},
"detail_car6": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car6"
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
"zone_6": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 6"
},
"color_6": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 6"
},
"detail_car7": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car7"
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
"zone_7": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 7"
},
"color_7": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 7"
},
"detail_car8": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Detail Car8"
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
},
"zone_8": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Zone 8"
},
"color_8": {
"anyOf": [
{
"type": "string"
},
{
"type": "null"
}
],
"title": "Color 8"
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
"title": "BODY",
"description": "**BODY**"
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

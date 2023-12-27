from pymilvus import (
    connections,
    FieldSchema, CollectionSchema, DataType,
    Collection,
    utility
)
import numpy as np

def create_connection():
    print("Create connection...")
    connections.connect(host='localhost', port='19530',alias='default')

# Create a collection named 'Image'
def create_collection():
    collection_name = 'Image17'
    id_field = 'id'
    vector_field = 'embedding'

    field_id = FieldSchema(name=id_field, dtype=DataType.INT64, is_primary=True)
    field_embedding = FieldSchema(name=vector_field, dtype=DataType.FLOAT_VECTOR, dim=512)

    schema = CollectionSchema(fields=[field_id, field_embedding], description="Image collection")
    collection = Collection(name=collection_name, schema=schema)
    print("Collection created:", collection_name)
    return collection

# Insert data into collection
def insert_data(collection, num, face_embedding):
    data = [
        [num],
        [face_embedding],
    ]

    res = collection.insert(data)
    print("________", res)
    return data[1]
           
def delete_data(collection, id):
    expr = f"id in [{id}]"
    res = collection.delete(expr)
    print("Deleted", expr, res)
    

# Create index for the vector field
def create_index(collection):
    index_param = {
        'index_type': 'IVF_FLAT',
        'params': {'nlist': 1024},
        'metric_type': 'L2'
    }
    collection.create_index(field_name='embedding', index_params=index_param)
    print("Index created for the vector field.")

def search_faces(collection, search_vectors):
    search_param = {
        'data': [search_vectors],
        'anns_field': 'embedding',
        'param': {'metric_type': 'L2'},
        'limit': 1
    }
    print("search_vectors", search_vectors)
    collection.load()
    results = collection.search(**search_param)
    print("Search Results:", len(results))
    if len(results) > 0:
        return results[0][0]
    return None
        

create_connection()
cols = utility.list_collections()
print("_____", cols)
milvus_collection = create_collection()
create_index(milvus_collection)
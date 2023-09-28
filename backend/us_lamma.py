from llama_index import load_index_from_storage, StorageContext,VectorStoreIndex
from llama_index.vector_stores import ChromaVectorStore,PineconeVectorStore
import openai
import os
from dotenv import load_dotenv
from llama_index import Prompt
import database_utils
import chromadb
from chromadb.utils import embedding_functions
from llama_index.prompts import PromptTemplate

def queryAns(modalId,query):
    """
    Queries GPT model and generates response

    Parameter
    - 
    """
    # modalid INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), contentType VARCHAR(50), samplefile VARCHAR(255), guidelines VARCHAR(255), responeSize VARCHAR(50), paid BOOLEAN,openkey,description

    load_dotenv()
    try:
        openai.api_key = database_utils.getOpenAI(modalId=modalId)
        res = database_utils.getData(modalId=modalId)

        #getting params according to modalId to create prompt
        title = res[1]
        content_type = res[2]
        guidelines = res[4]
        responseSize = res[5]
        description = res[6]

        #creating prompt for the model according params
        template = (
            "Context information is below.\n"
            "---------------------\n"
            "{context_str}\n"
            "---------------------\n"
            "Using both the context information and also using your own knowledge, "
            "answer the question: {query_str}\n"
            "If the context isn't helpful, you can also answer the question on your own.\n"
            "You must follow the following guidelines: \n"
            "---------------------\n"
        )

        if title != "":
            template += f"You are an {title} based AI. \n"
        
        if content_type != "":
            template += f"You create this type of content {content_type}\n"

        if guidelines != "":
            template += f"You need to follow this style {guidelines}\n"

        if responseSize != "":
            template += f"Your response size should be strictly in {responseSize}\n"

        if description != "":
            template += f"Here are some more instructions you need to follow {description}\n"
            

        openai_embedding = embedding_functions.OpenAIEmbeddingFunction(model_name = "text-embedding-ada-002")
        client = chromadb.PersistentClient()
        collection = client.get_collection(modalId,embedding_function=openai_embedding)
        
        path = "/home/ubuntu/content-generator/backend/Vector_DB"#os.getenv("VECTOR_DB_PATH")
        vec_store = ChromaVectorStore(chroma_collection=collection)
        stcontext = StorageContext.from_defaults(vector_store=vec_store,persist_dir=path)
        index = load_index_from_storage(stcontext)


        text_qa_template = PromptTemplate(template)

        query_engine = index.as_query_engine(text_qa_template=text_qa_template)
        res = query_engine.query(query)
        return res
    
    except Exception as e:
        return str(e)


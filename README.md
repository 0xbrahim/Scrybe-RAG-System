# 📄 PDF AI Assistant — Local RAG Chatbot

A lightweight **Retrieval-Augmented Generation (RAG)** application that allows users to upload PDF documents, process their content, generate embeddings, store the document chunks in a vector database, and then chat with the document using a local Large Language Model.

The project uses **n8n** to orchestrate the AI workflow, **Supabase + pgvector** for vector storage and similarity search, and **Ollama** to run the LLM locally. The frontend is built with simple **HTML, CSS, and JavaScript**, making the project easy to understand, customize, and deploy.

The system is designed to run locally without sending document content to a third-party LLM API.

---

## ✨ Features

- 📤 Upload PDF documents from a web interface
- 📄 Extract text from uploaded PDFs
- ✂️ Split documents into smaller chunks
- 🧠 Generate vector embeddings
- 🗄️ Store document chunks and embeddings in Supabase
- 🔎 Perform semantic similarity search
- 🤖 Generate answers using a local Ollama LLM
- 💬 Chat with uploaded documents
- 📚 Support multiple documents
- 🆔 Assign a unique `document_id` to each uploaded document
- 🌐 Simple HTML/CSS/JavaScript frontend
- 🔗 n8n webhook-based backend
- 🔒 Can run completely locally

---

# 🏗️ Architecture

The application consists of four main components:

```text
                    ┌─────────────────────┐
                    │     Web Browser     │
                    │   HTML/CSS/JS UI    │
                    └──────────┬──────────┘
                               │
                         HTTP Webhooks
                               │
                               ▼
                    ┌─────────────────────┐
                    │        n8n          │
                    │ Workflow Automation │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌──────────────────┐       ┌──────────────────┐
        │ PDF Upload       │       │ PDF Chat - RAG   │
        │ Workflow         │       │ Workflow         │
        └────────┬─────────┘       └────────┬─────────┘
                 │                           │
                 ▼                           ▼
        ┌──────────────────┐       ┌──────────────────┐
        │ Text Extraction  │       │ Query Embedding  │
        └────────┬─────────┘       └────────┬─────────┘
                 │                           │
                 ▼                           ▼
        ┌──────────────────┐       ┌──────────────────┐
        │ Text Chunking    │       │ Supabase Vector  │
        └────────┬─────────┘       │ Similarity Search│
                 │                 └────────┬─────────┘
                 ▼                          │
        ┌──────────────────┐                │
        │ Ollama Embedding │                │
        │ Model            │                │
        └────────┬─────────┘                │
                 │                          │
                 ▼                          ▼
        ┌─────────────────────────────────────────┐
        │              Supabase                  │
        │       PostgreSQL + pgvector            │
        └────────────────────┬────────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Ollama LLM       │
                    │ Qwen3 / Gemma    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   AI Response    │
                    └──────────────────┘
```

---

# 🧰 Technologies

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| HTML            | Frontend structure              |
| CSS             | Frontend styling                |
| JavaScript      | Frontend logic and API requests |
| n8n             | Workflow orchestration          |
| Supabase        | Database and vector storage     |
| PostgreSQL      | Database                        |
| pgvector        | Vector similarity search        |
| Ollama          | Local AI model execution        |
| Qwen3 / Gemma   | Local LLM                       |
| Embedding Model | Converts text into vectors      |
| Docker          | Runs n8n locally                |

---

# 💻 Requirements

Before starting, install the following:

- Windows, Linux, or macOS
- Docker
- n8n
- Ollama
- Supabase account
- Git
- A modern web browser

For a laptop with approximately **16 GB RAM and an NVIDIA GPU with 6 GB VRAM**, a small model such as **Qwen3 4B** is recommended.

---

# 1. Clone the Repository

Clone the project:

```bash
git clone https://github.com/0xbrahim/Scrybe-RAG-System.git
cd Scrybe-RAG-System
```

---

# 2. Project Structure

The frontend can have a simple structure:

```text
Scrybe-RAG-System/
│
├── index.html
├── style.css
├── app.js
│
└── README.md
```

The n8n workflows are configured separately.

You can also export your n8n workflows as JSON and place them in a directory such as:

```text
n8n/
├── pdf-upload-workflow.json
└── pdf-chat-rag-workflow.json
```

---

# 3. Install Docker

Install Docker Desktop for your operating system.

After installation, verify that Docker works:

```bash
docker --version
```

Then make sure Docker Desktop is running.

---

# 4. Run n8n with Docker

Start n8n using:

```powershell
docker run -it --rm --name n8n -p 5678:5678 --add-host=host.docker.internal:host-gateway -e GENERIC_TIMEZONE="Asia/Dubai" -e TZ="Asia/Dubai" -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true -e N8N_RUNNERS_ENABLED=true -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
```

After n8n starts, open:

```text
http://localhost:5678
```

Create your n8n account if this is your first installation.

---

# 5. Install Ollama

Install Ollama on the computer running the AI model.

Verify the installation:

```bash
ollama --version
```

---

# 6. Install an LLM

For a relatively lightweight local model, Qwen3 4B can be used:

```bash
ollama pull qwen3:4b
```

Test it:

```bash
ollama run qwen3:4b
```

Try asking it a simple question.

You can also use another Ollama-compatible model if your hardware supports it.

For example:

```bash
ollama pull gemma3:4b
```

The model used by the n8n workflow must match the model installed in Ollama.

---

# 7. Install an Embedding Model

The RAG system needs an embedding model to convert text into vectors.

For example:

```bash
ollama pull nomic-embed-text
```

You can use another embedding model, but the same embedding model and vector dimensions must be used consistently when:

1. Creating document embeddings
2. Creating question embeddings
3. Performing vector similarity search

---

# 8. Create a Supabase Project

Create a project in Supabase.

The database will store:

- Document chunks
- File names
- Document IDs
- Embeddings
- Similarity information

The basic structure used by this project is conceptually:

```text
documents
│
├── id
├── content
├── embedding
├── filename
├── document_id
└── metadata
```

The exact table and column names can be changed, but they must match the n8n workflow.

---

# 9. Enable pgvector

Supabase uses PostgreSQL, and the RAG system requires vector support.

Enable the `vector` extension in your Supabase database.

Conceptually:

```sql
create extension if not exists vector;
```

The embedding column should use the appropriate vector dimension for your selected embedding model.

For example:

```sql
embedding vector(YOUR_DIMENSION)
```

Replace `YOUR_DIMENSION` with the actual number of dimensions produced by your embedding model.

---

# 10. Create the Vector Search Function

The RAG workflow uses a PostgreSQL function to search for the most relevant document chunks.

The function used in this project is:

```text
match_document_chunks
```

Its arguments are:

```text
query_embedding vector
match_document_id text
match_count integer
```

It returns:

```text
TABLE(
    id bigint,
    content text,
    filename text,
    document_id text,
    similarity double precision
)
```

The function performs semantic similarity search and returns the most relevant chunks belonging to the requested document.

The important idea is:

```text
User Question
      ↓
Question Embedding
      ↓
Vector Similarity Search
      ↓
Top K Relevant Chunks
```

In this project, the workflow normally retrieves:

```text
match_count = 5
```

chunks.

---

# 11. Configure Supabase Credentials in n8n

In n8n, create the required Supabase credentials or HTTP authentication configuration.

For REST API requests, the request requires appropriate authentication headers.

Do **not** publish your Supabase service-role key in this GitHub repository.

Never put real secrets inside:

```text
index.html
style.css
app.js
README.md
```

or inside exported workflow files.

Use placeholders instead.

Example:

```text
YOUR_SUPABASE_URL
YOUR_SUPABASE_ANON_KEY
YOUR_SUPABASE_SERVICE_ROLE_KEY
```

---

# 12. Build the First n8n Workflow — PDF Upload

Create a new n8n workflow.

Name it:

```text
PDF Upload
```

The purpose of this workflow is to process an uploaded PDF and store its content in the vector database.

The workflow is approximately:

```text
Webhook
   ↓
Extract PDF Text
   ↓
Split Text into Chunks
   ↓
Generate Embeddings
   ↓
Store Chunks + Embeddings
   ↓
Return document_id
```

---

# 13. Create the PDF Upload Webhook

Add a **Webhook** node.

Configure:

```text
HTTP Method: POST
Path: pdf-upload
```

The production webhook will be:

```text
http://localhost:5678/webhook/pdf-upload
```

When deployed behind a public domain, the URL will become something like:

```text
https://YOUR-N8N-DOMAIN/webhook/pdf-upload
```

The frontend sends the PDF as multipart form data.

The field used by the frontend is:

```text
file
```

---

# 14. Extract the PDF Text

Use an appropriate n8n PDF/document extraction node.

The purpose is to convert:

```text
PDF
```

into:

```text
Plain Text
```

For example:

```text
BRAHIM AHMED
SOFTWARE ENGINEER
...
PROFESSIONAL SUMMARY
...
```

The extracted text is then passed to the chunking step.

---

# 15. Split the Document into Chunks

Large documents should not be sent to the LLM as one huge block.

Split the document into smaller chunks.

Conceptually:

```text
PDF
 ↓
Full Text
 ↓
Chunk 1
Chunk 2
Chunk 3
Chunk 4
...
```

A chunk should contain enough information to preserve context while remaining small enough for efficient retrieval.

The exact chunk size can be adjusted depending on the documents used.

---

# 16. Generate Embeddings

Send each text chunk to Ollama's embedding model.

For example:

```text
nomic-embed-text
```

The result is a vector:

```text
[-0.0509, 0.0474, -0.1485, ...]
```

This vector represents the semantic meaning of the chunk.

---

# 17. Generate a Document ID

Each uploaded file should receive a unique document ID.

For example:

```text
1786747703475-4z6mh3sy
```

Every chunk from the same PDF should use the same `document_id`.

This is important because the chatbot needs to search only the document selected by the user.

Example:

```text
document_id
1786747703475-4z6mh3sy
```

---

# 18. Store the Chunks in Supabase

Insert the following information into Supabase:

```text
id
content
embedding
metadata
document_id
filename
created_at
```

For example:

```text
id: 15

filename:
Brahim_Ahmed_CV.pdf

document_id:
1786747703475-4z6mh3sy

content:
BRAHIM AHMED
SOFTWARE ENGINEER & AGENTIC AI ENGINEER
...

embedding:
[-0.050907362, 0.047420785, ...]
```

At this point, the document is ready for RAG.

---

# 19. Return the Document ID

The PDF upload workflow should return the generated `document_id` and filename to the frontend.

Example response:

```json
{
  "document_id": "1786747703475-4z6mh3sy",
  "filename": "Brahim_Ahmed_CV.pdf"
}
```

The frontend should save this `document_id`.

The chatbot will use it when asking questions.

---

# 20. Build the Second n8n Workflow — PDF Chat - RAG

Create another workflow.

Name it:

```text
PDF Chat - RAG
```

The workflow should look approximately like:

```text
Webhook
   ↓
Create Question Embedding
   ↓
Supabase Vector Search
   ↓
Build Context
   ↓
Generate Answer
   ↓
Respond to Webhook
```

---

# 21. Create the Chat Webhook

Add a Webhook node.

Configure:

```text
HTTP Method: POST
Path: chat
```

The production URL is:

```text
http://localhost:5678/webhook/chat
```

The frontend sends:

```json
{
  "question": "What programming languages does Brahim know?",
  "document_id": "1786747703475-4z6mh3sy"
}
```

The two important fields are:

```text
question
document_id
```

---

# 22. Generate the Question Embedding

The user's question is converted into an embedding using the **same embedding model used for the documents**.

For example:

```text
Question:
What programming languages does Brahim know?

        ↓

Embedding Model

        ↓

[0.021, -0.043, 0.098, ...]
```

The question vector is then sent to Supabase.

---

# 23. Perform Vector Search

Call:

```text
match_document_chunks
```

with:

```text
query_embedding
match_document_id
match_count
```

Example:

```json
{
  "query_embedding": [ ... ],
  "match_document_id": "1786747703475-4z6mh3sy",
  "match_count": 5
}
```

The function returns the most semantically similar chunks.

For example:

```text
Chunk 1
similarity: 0.67

Chunk 2
similarity: 0.64

Chunk 3
similarity: 0.61

Chunk 4
similarity: 0.59

Chunk 5
similarity: 0.56
```

---

# 24. Build the Context

Combine the retrieved chunks into a context for the LLM.

Example:

```text
--- Document Chunk 1 ---

BRAHIM AHMED
SOFTWARE ENGINEER & AGENTIC AI ENGINEER

...

--- Document Chunk 2 ---

Technical Skills:
HTML, CSS, JavaScript, PHP, Kotlin, SQL...

...
```

Then provide the user's question:

```text
Question:
What programming languages does Brahim know?
```

---

# 25. Generate the Answer with Ollama

The context and question are sent to the local LLM.

For example:

```text
Model:
qwen3:4b
```

The LLM should be instructed to answer using the provided document context.

A basic prompt structure is:

```text
You are a document question-answering assistant.

Answer the user's question using only the provided document context.

If the answer cannot be found in the context, say that the information
is not available in the document.

Document Context:
{{context}}

Question:
{{question}}
```

The LLM then generates the answer.

Example:

```text
The document states that Brahim knows HTML, CSS, JavaScript,
PHP, Kotlin, SQL, and React Native.
```

---

# 26. Respond to the Webhook

The final n8n node should return the AI answer to the website.

For example:

```json
{
  "answer": "The document states that Brahim knows HTML, CSS, JavaScript, PHP, Kotlin, SQL, and React Native."
}
```

The JavaScript frontend reads the `answer` field and displays it in the chat interface.

---

# 27. Activate Both Workflows

This is important.

You should activate:

```text
PDF Upload
PDF Chat - RAG
```

When the workflows are active, use:

```text
/webhook/pdf-upload
```

and:

```text
/webhook/chat
```

Do not use:

```text
/webhook-test/
```

for the deployed application.

The `webhook-test` URL is primarily intended for testing while building the workflow.

---

# 28. Create the Frontend

The frontend uses three files:

```text
index.html
style.css
app.js
```

The website contains three main sections:

```text
┌──────────────────────────────────┐
│          PDF AI Assistant        │
├──────────────────────────────────┤
│                                  │
│          Upload PDF              │
│                                  │
│      [ Choose PDF ]              │
│                                  │
│      [ Process Document ]        │
│                                  │
├──────────────────────────────────┤
│                                  │
│       Document Summary           │
│                                  │
├──────────────────────────────────┤
│                                  │
│      Chat with Document          │
│                                  │
│  AI: Hello!                      │
│                                  │
│  You: What is this document?     │
│                                  │
│  AI: ...                         │
│                                  │
│  [ Ask something... ] [Send]     │
│                                  │
└──────────────────────────────────┘
```

---

# 29. Configure `app.js`

For local development:

```javascript
const N8N_UPLOAD_URL =
    "http://localhost:5678/webhook/pdf-upload";

const N8N_CHAT_URL =
    "http://localhost:5678/webhook/chat";
```

The upload request should send the PDF using `FormData`.

Conceptually:

```javascript
const formData = new FormData();

formData.append("file", selectedFile);

const response = await fetch(
    N8N_UPLOAD_URL,
    {
        method: "POST",
        body: formData
    }
);
```

The browser should then receive the `document_id`.

---

# 30. Chat Request

When the user asks a question, JavaScript sends:

```json
{
  "question": "What programming languages does Brahim know?",
  "document_id": "1786747703475-4z6mh3sy"
}
```

For example:

```javascript
const response = await fetch(
    N8N_CHAT_URL,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            question: question,
            document_id: documentId
        })
    }
);
```

The returned answer is then displayed in the chat.

---

# 31. Run the Website Locally

You can use VS Code with the **Live Server** extension.

Open:

```text
index.html
```

with Live Server.

The website might run at:

```text
http://127.0.0.1:5500
```

or:

```text
http://localhost:5500
```

Make sure n8n is running at:

```text
http://localhost:5678
```

---

# 32. Test the Complete System

### Step 1

Start Docker/n8n.

```text
http://localhost:5678
```

### Step 2

Start Ollama.

Verify:

```bash
ollama list
```

You should see your installed models.

### Step 3

Make sure Supabase is available.

### Step 4

Activate both n8n workflows.

### Step 5

Open the website.

### Step 6

Upload a PDF.

### Step 7

Wait for the PDF Upload workflow to finish.

### Step 8

Ask a question about the document.

Example:

```text
What programming languages are mentioned in this document?
```

### Step 9

The RAG workflow retrieves relevant chunks.

### Step 10

The local LLM generates the final answer.

---

# 🔐 Security Before Publishing to GitHub

**Do not publish credentials or secrets.**

Before making the repository public, check all files for:

- Supabase API keys
- Supabase service-role keys
- OpenAI API keys
- Gemini API keys
- Ollama credentials if applicable
- Database passwords
- Access tokens
- Cloudflare tokens
- n8n credentials
- Private URLs containing secrets

Never commit something like:

```javascript
const SUPABASE_KEY = "real-secret-key";
```

Use placeholders:

```javascript
const SUPABASE_KEY = "YOUR_SUPABASE_KEY";
```

The same applies to n8n exported workflow JSON files.

---

# 🌐 Optional: Make n8n Public

For local development, the website can communicate directly with:

```text
http://localhost:5678
```

However, a Vercel-hosted website cannot access your laptop's `localhost`.

You need a publicly accessible n8n server.

For temporary testing, Cloudflare Quick Tunnel can expose n8n:

```bash
cloudflared tunnel --url http://localhost:5678
```

It provides a URL similar to:

```text
https://example-name.trycloudflare.com
```

Then the frontend can use:

```javascript
const N8N_UPLOAD_URL =
    "https://example-name.trycloudflare.com/webhook/pdf-upload";

const N8N_CHAT_URL =
    "https://example-name.trycloudflare.com/webhook/chat";
```

### Important

Cloudflare Quick Tunnels are useful for testing, but they are **not recommended as the permanent production architecture**.

For production, use a permanent n8n deployment and domain.

---

# ☁️ Deploying the Frontend to Vercel

The frontend can be hosted on Vercel.

Your GitHub repository can contain:

```text
index.html
style.css
app.js
README.md
```

Connect the GitHub repository to Vercel.

After deployment, Vercel will host the frontend.

However, remember:

```text
Vercel
   ↓
Public Internet
   ↓
n8n must also be publicly accessible
```

Vercel cannot access:

```text
http://localhost:5678
```

on your laptop.

---

# 🔄 Complete Production Flow

Once the project is deployed, the architecture can look like:

```text
                         USER
                           │
                           ▼
                    ┌─────────────┐
                    │   Vercel    │
                    │ HTML/CSS/JS │
                    └──────┬──────┘
                           │
                           │ HTTPS
                           ▼
                    ┌─────────────┐
                    │     n8n     │
                    │  Webhooks   │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
        PDF Upload                  Chat/RAG
              │                         │
              ▼                         ▼
        Text Extraction          Query Embedding
              │                         │
              ▼                         ▼
          Chunking                Vector Search
              │                         │
              ▼                         ▼
          Embedding              Supabase/pgvector
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
                      Ollama LLM
                           │
                           ▼
                      AI Answer
                           │
                           ▼
                       Website
```

---

# 🧠 How RAG Works

This project does not simply send the entire PDF to the LLM.

Instead, it uses Retrieval-Augmented Generation.

### Without RAG

```text
PDF → LLM → Answer
```

This can become expensive or impossible for large documents.

### With RAG

```text
PDF
 ↓
Text
 ↓
Chunks
 ↓
Embeddings
 ↓
Vector Database
```

Then:

```text
User Question
 ↓
Question Embedding
 ↓
Vector Search
 ↓
Relevant Chunks
 ↓
LLM
 ↓
Answer
```

This allows the LLM to focus on the most relevant information.

---

# 📌 Example

Suppose the user uploads:

```text
Brahim_Ahmed_CV.pdf
```

The system creates:

```text
document_id:
1786747703475-4z6mh3sy
```

The document is split into chunks and stored in Supabase.

The user asks:

```text
What programming languages does Brahim know?
```

The question is converted into an embedding.

Supabase searches the stored vectors and returns the most relevant chunks.

Those chunks are provided to the LLM.

The LLM generates:

```text
The document states that Brahim knows HTML, CSS, JavaScript,
PHP, Kotlin, SQL, and React Native.
```

The answer is returned to the website.

---

# ⚙️ Recommended Local Configuration

For a laptop with:

```text
CPU: Intel Core i5-13420H
RAM: 16 GB
GPU: NVIDIA RTX 4050 Laptop
VRAM: 6 GB
```

a lightweight model is recommended.

For example:

```text
Qwen3 4B
```

Install:

```bash
ollama pull qwen3:4b
```

The exact performance depends on the model quantization, context size, document size, and other applications running on the computer.

---

# 🐛 Troubleshooting

## n8n stops because there is no output

n8n may stop a workflow when a node returns no items.

Check:

```text
Settings → Always Output Data
```

for nodes where an empty result is expected.

---

## `missing request body`

Make sure the HTTP Request node sends a valid JSON body.

For example:

```json
{
  "query_embedding": [0.1, 0.2, 0.3],
  "match_document_id": "DOCUMENT_ID",
  "match_count": 5
}
```

---

## `JSON Body` is not valid JSON

Avoid manually constructing JSON strings containing JavaScript expressions when possible.

n8n's expression mode can be used to return an object:

```javascript
{{ {
    query_embedding: $json.embeddings[0],
    match_document_id: $('Webhook').first().json.body.document_id,
    match_count: 5
} }}
```

---

## `query_embedding` is undefined

Check the node producing the embedding.

Make sure the actual output contains:

```text
embeddings
```

before referencing:

```javascript
$json.embeddings[0]
```

---

## Website cannot connect to n8n

Check:

```text
1. Is Docker running?
2. Is n8n running?
3. Is the workflow active?
4. Is the webhook URL correct?
5. Is CORS configured correctly?
6. Is the browser console showing an error?
```

---

## `localhost` does not work on Vercel

This is expected.

```text
localhost
```

refers to the computer running the browser.

A Vercel website cannot use your laptop's:

```text
http://localhost:5678
```

You need a public n8n endpoint.

---

## CORS error

If the frontend is hosted at:

```text
http://127.0.0.1:5500
```

but n8n does not allow that origin, the browser can block the request.

Make sure your n8n CORS configuration allows the frontend origin.

For production, configure CORS for your actual website domain rather than allowing every origin.

---

# 🚀 Future Improvements

Possible improvements include:

- Support DOCX, TXT, CSV, and other file formats
- Add document management
- Allow users to delete documents
- Add conversation history
- Add streaming responses
- Add authentication
- Add user-specific document collections
- Add citations showing which document chunks produced an answer
- Add configurable similarity thresholds
- Add reranking
- Add hybrid keyword + vector search
- Add OCR for scanned PDFs
- Add multi-document conversations
- Add a production cloud deployment
- Add rate limiting
- Add file size limits
- Add better error handling
- Add a more advanced LLM
- Add persistent chat history

---

# ⚠️ Important Limitations

This project is primarily designed as an educational and experimental RAG application.

For production use, additional security and infrastructure should be implemented.

In particular:

- Do not expose database service-role keys in frontend code.
- Do not expose private credentials in GitHub.
- Do not rely on a temporary Cloudflare Quick Tunnel for production.
- Add authentication before allowing arbitrary users to access private documents.
- Add file size and file type validation.
- Add rate limiting.
- Validate and sanitize uploaded documents.
- Protect n8n endpoints.
- Use HTTPS in production.
- Keep sensitive environment variables outside the repository.

---

# ⭐ Conclusion

This project demonstrates how to build a complete local **Retrieval-Augmented Generation system** using open-source and low-code technologies.

Instead of sending an entire document directly to an LLM, the system converts document chunks into embeddings, stores them in a vector database, retrieves the most relevant information for each question, and then provides that context to a local LLM.

The result is a lightweight document assistant that can be adapted for CV analysis, research papers, manuals, reports, company documents, educational materials, and many other document-based applications.

```text
Upload Document
       ↓
Extract Text
       ↓
Chunk Document
       ↓
Generate Embeddings
       ↓
Store in Vector DB
       ↓
Ask Question
       ↓
Retrieve Relevant Chunks
       ↓
Local LLM
       ↓
AI Answer
```

Built with:

**HTML • CSS • JavaScript • n8n • Supabase • PostgreSQL • pgvector • Ollama • Local LLM**

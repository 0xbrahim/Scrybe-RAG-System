// ==========================================
// n8n Webhook URLs
// ==========================================

const N8N_UPLOAD_URL =
    "https://resulting-character-keen-christ.trycloudflare.com/webhook/pdf-upload";

const N8N_CHAT_URL =
    "https://resulting-character-keen-christ.trycloudflare.com/webhook/chat";


// ==========================================
// Global State
// ==========================================

let selectedFile = null;
let documentId = null;


// ==========================================
// Elements
// ==========================================

const pdfInput =
    document.getElementById("pdfInput");

const dropZone =
    document.getElementById("dropZone");

const fileName =
    document.getElementById("fileName");

const uploadButton =
    document.getElementById("uploadButton");

const uploadStatus =
    document.getElementById("uploadStatus");

const questionInput =
    document.getElementById("questionInput");

const sendButton =
    document.getElementById("sendButton");

const chatMessages =
    document.getElementById("chatMessages");

const documentStatus =
    document.querySelector(".document-status");


// ==========================================
// Select PDF
// ==========================================

pdfInput.addEventListener(
    "change",
    function () {

        if (this.files.length === 0) {
            return;
        }

        selectedFile =
            this.files[0];

        fileName.textContent =
            selectedFile.name;

        uploadStatus.textContent =
            "PDF selected. Ready to process.";

    }
);


// ==========================================
// Drag & Drop
// ==========================================

dropZone.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        dropZone.classList.add("dragover");

    }
);


dropZone.addEventListener(
    "dragleave",
    function () {

        dropZone.classList.remove(
            "dragover"
        );

    }
);


dropZone.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        dropZone.classList.remove(
            "dragover"
        );


        if (
            event.dataTransfer.files.length === 0
        ) {
            return;
        }


        const file =
            event.dataTransfer.files[0];


        // Make sure it is a PDF

        if (
            file.type !== "application/pdf" &&
            !file.name.toLowerCase().endsWith(".pdf")
        ) {

            alert(
                "Please select a PDF file."
            );

            return;
        }


        selectedFile = file;

        fileName.textContent =
            selectedFile.name;

        uploadStatus.textContent =
            "PDF selected. Ready to process.";

    }
);


// ==========================================
// Upload PDF
// ==========================================

uploadButton.addEventListener(
    "click",
    async function () {

        if (!selectedFile) {

            alert(
                "Please select a PDF first."
            );

            return;
        }


        const formData =
            new FormData();


        formData.append(
            "file",
            selectedFile
        );


        uploadButton.disabled = true;

        uploadStatus.textContent =
            "Processing PDF...";


        try {

            const response =
                await fetch(
                    N8N_UPLOAD_URL,
                    {
                        method: "POST",
                        body: formData
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            /*
             * n8n should return something like:
             *
             * {
             *     "document_id": "...",
             *     "filename": "example.pdf"
             * }
             */

            const data =
                await response.json();


            console.log(
                "Upload response:",
                data
            );


            // Get document ID

            documentId =
                data.document_id;


            if (!documentId) {

                throw new Error(
                    "n8n did not return a document_id."
                );

            }


            // Success

            uploadStatus.textContent =
                "PDF processed successfully!";


            documentStatus.textContent =
                `Current document: ${selectedFile.name}`;


            // Enable chatbot

            questionInput.disabled =
                false;

            sendButton.disabled =
                false;


            questionInput.focus();


            // Add AI message

            addMessage(
                "ai",
                `Your PDF "${selectedFile.name}" is ready. Ask me anything about it.`
            );


        } catch (error) {

            console.error(
                "Upload error:",
                error
            );


            uploadStatus.textContent =
                "Error processing the PDF.";


            alert(
                "Could not process the PDF. Check n8n and the browser console."
            );

        } finally {

            uploadButton.disabled =
                false;

        }

    }
);


// ==========================================
// Send Chat Question
// ==========================================

sendButton.addEventListener(
    "click",
    sendQuestion
);


// ==========================================
// Press Enter
// ==========================================

questionInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendQuestion();

        }

    }
);


// ==========================================
// Chat Function
// ==========================================

async function sendQuestion() {

    const question =
        questionInput.value.trim();


    if (!question) {
        return;
    }


    if (!documentId) {

        alert(
            "Please upload and process a PDF first."
        );

        return;
    }


    // Display user question

    addMessage(
        "user",
        question
    );


    questionInput.value = "";

    sendButton.disabled = true;


    // Loading message

    const loadingMessage =
        addMessage(
            "ai",
            "Thinking..."
        );


    try {

        const response =
            await fetch(
                N8N_CHAT_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        question:
                            question,

                        document_id:
                            documentId

                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Chat response:",
            data
        );


        loadingMessage.textContent =
            data.answer ||
            "No answer returned.";


    } catch (error) {

        console.error(
            "Chat error:",
            error
        );


        loadingMessage.textContent =
            "Error connecting to the AI.";

    } finally {

        sendButton.disabled =
            false;

        questionInput.focus();

    }

}


// ==========================================
// Add Message
// ==========================================

function addMessage(
    type,
    text
) {

    const message =
        document.createElement("div");


    message.classList.add(
        "message",
        type
    );


    message.textContent =
        text;


    chatMessages.appendChild(
        message
    );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;


    return message;

}
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");


const app = express();

const PORT = 5000;


/* =========================================
   MIDDLEWARE
========================================= */

app.use(
    cors()
);

app.use(
    express.json()
);


/* =========================================
   OPENAI
========================================= */

if (!process.env.OPENAI_API_KEY) {

    console.error(
        "❌ OPENAI_API_KEY is missing"
    );

    process.exit(1);

}


const client =
    new OpenAI({

        apiKey:
            process.env.OPENAI_API_KEY

    });


/* =========================================
   HEALTH CHECK
========================================= */

app.get(
    "/",
    function (req, res) {

        res.json({

            status: "online",

            message:
                "CHARAN AI backend is running"

        });

    }
);


/* =========================================
   CHAT API
========================================= */

app.post(
    "/api/chat",
    async function (req, res) {

        try {

            const message =
                req.body.message;


            console.log(
                "📩 User:",
                message
            );


            if (
                !message ||
                typeof message !== "string"
            ) {

                return res.status(400).json({

                    error:
                        "Message is required"

                });

            }


            /* =========================
               OPENAI REQUEST
            ========================= */

            const response =
                await client.responses.create({

                    model:
                        "gpt-5.6-luna",

                    instructions:
                        `
You are Charan AI, a friendly personal AI assistant.

Your job is to help the user with:
- programming
- web development
- databases
- Power BI
- computer networks
- study questions
- general knowledge

Explain difficult topics in a simple way.

When the user asks for code, provide clean,
working code and explain where to place it.

Be concise but useful.
`,

                    input:
                        message

                });


            const reply =
                response.output_text;


            console.log(
                "🤖 Charan AI:",
                reply
            );


            res.json({

                success: true,

                reply: reply

            });


        } catch (error) {

            console.error(
                "❌ OpenAI ERROR:"
            );

            console.error(
                error
            );


            res.status(500).json({

                success: false,

                error:
                    "AI request failed",

                details:
                    error.message

            });

        }

    }
);


/* =========================================
   SERVER
========================================= */

app.listen(
    PORT,
    function () {

        console.log(
            `🚀 CHARAN AI backend running at http://localhost:${PORT}`
        );

        console.log(
            "🤖 AI endpoint: http://localhost:5000/api/chat"
        );

    }
);
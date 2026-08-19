from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pipeline import run_research


app = FastAPI(
    title="AI Research Agent API",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class ResearchRequest(BaseModel):
    topic: str


# =========================================================
# CONTENT NORMALIZER
# =========================================================

def content_to_text(content) -> str:

    if isinstance(content, str):
        return content

    if isinstance(content, list):

        parts = []

        for item in content:

            if isinstance(item, str):
                parts.append(item)

            elif isinstance(item, dict):

                if item.get("type") == "text":

                    parts.append(
                        item.get("text", "")
                    )

                else:

                    parts.append(
                        str(item)
                    )

            else:

                parts.append(
                    str(item)
                )

        return "\n".join(parts)

    if isinstance(content, dict):

        if content.get("type") == "text":

            return content.get(
                "text",
                ""
            )

        return str(content)

    return str(content)


# =========================================================
# HEALTH
# =========================================================

@app.get("/")
def root():

    return {
        "message":
            "AI Research Agent API is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# =========================================================
# RESEARCH
# =========================================================

@app.post("/api/research")
def research(
    request: ResearchRequest
):

    topic = request.topic.strip()

    if not topic:

        raise HTTPException(
            status_code=400,
            detail="Research topic is required",
        )

    try:

        # Run your EXISTING pipeline
        result = run_research(topic)

        return {

            "success": True,

            "topic": topic,

            "search_results":
                content_to_text(
                    result.get(
                        "search_results",
                        ""
                    )
                ),

            "scraped_content":
                content_to_text(
                    result.get(
                        "scraped_content",
                        ""
                    )
                ),

            "report":
                content_to_text(
                    result.get(
                        "report",
                        ""
                    )
                ),

            "feedback":
                content_to_text(
                    result.get(
                        "feedback",
                        ""
                    )
                ),
        }

    except Exception as error:

        print(
            "Research Error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )
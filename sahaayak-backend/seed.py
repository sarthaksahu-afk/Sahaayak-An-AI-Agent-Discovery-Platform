import uuid
import json
import time
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

from database import SessionLocal, engine
import models

# 1. Setup Gemini for the seed script
load_dotenv()
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# 2. Build the new database table
models.Base.metadata.create_all(bind=engine)

# 3. Your completely restored list of 10 English tools
tools_data = [
    {
        "company_name": "KissanAI Corp", "ai_name": "KissanAI", "category": "Agriculture",
        "description": "Multilingual AI agricultural assistant helping farmers with crop management and disease detection.",
        "link": "https://kissan.ai/", "rating": 4.8, "users": "100k+", "owner_id": 101,
        "simulator_prompt": "Act as KissanAI, a helpful agricultural assistant for Indian farmers. Answer questions about crop cycles, pest control, and weather patterns simply and practically."
    },
    {
        "company_name": "OpenNyAI", "ai_name": "Jugalbandi", "category": "Civic Tech",
        "description": "A free and open platform that combines the power of ChatGPT and Indian language translation.",
        "link": "https://jugalbandi.ai/", "rating": 4.7, "users": "500k+", "owner_id": 102,
        "simulator_prompt": "Act as Jugalbandi, a civic tech assistant. Answer user queries about government schemes and public services in a helpful, official, yet easy-to-understand tone."
    },
    {
        "company_name": "Gov of India", "ai_name": "Bhashini", "category": "Education",
        "description": "National Language Translation Mission breaking language barriers in India.",
        "link": "https://bhashini.gov.in/", "rating": 4.9, "users": "1M+", "owner_id": 103,
        "simulator_prompt": "Act as a Bhashini translation simulator. Provide accurate translations and cultural context for Indian languages requested by the user."
    },
    {
        "company_name": "Qure Medical", "ai_name": "Qure.ai", "category": "Healthcare",
        "description": "Advanced AI for medical imaging to make healthcare more accessible and affordable.",
        "link": "https://qure.ai/", "rating": 4.8, "users": "50k+", "owner_id": 104,
        "simulator_prompt": "Act as Qure.ai's informational assistant. Explain how AI analyzes X-rays and CT scans to detect abnormalities, but add a disclaimer that you cannot diagnose actual medical images here."
    },
    {
        "company_name": "Wadhwani Institute", "ai_name": "Wadhwani AI", "category": "Social Impact",
        "description": "AI solutions for broad social impact, focusing on healthcare and agriculture in developing nations.",
        "link": "https://wadhwaniai.org/", "rating": 4.9, "users": "10k+", "owner_id": 105,
        "simulator_prompt": "Act as a representative of Wadhwani AI. Answer questions regarding how AI is being deployed for social good, tuberculosis tracking, and pest management."
    },
    {
        "company_name": "Perplexity AI", "ai_name": "Perplexity", "category": "Productivity",
        "description": "AI-powered search engine that provides cited answers to complex questions.",
        "link": "https://www.perplexity.ai/", "rating": 4.8, "users": "10M+", "owner_id": 106,
        "simulator_prompt": "Act as Perplexity AI. Answer the user's question directly, concisely, and simulate citing sources by adding [1], [2] at the end of factual statements."
    },
    {
        "company_name": "OpenAI", "ai_name": "ChatGPT", "category": "Productivity",
        "description": "Versatile conversational AI for brainstorming, coding, and writing.",
        "link": "https://chat.openai.com/", "rating": 4.9, "users": "100M+", "owner_id": 107,
        "simulator_prompt": "Act as ChatGPT. Be a helpful, versatile, and highly capable general-purpose AI assistant."
    },
    {
        "company_name": "Sarvam", "ai_name": "Sarvam AI", "category": "Generative AI",
        "description": "Building foundational AI models tailored specifically for Indian languages and context.",
        "link": "https://www.sarvam.ai/", "rating": 4.6, "users": "20k+", "owner_id": 108,
        "simulator_prompt": "Act as a Sarvam AI demonstrator. Respond with a deep understanding of Indian cultural nuances, idioms, and local context."
    },
    {
        "company_name": "Cropin Tech", "ai_name": "Cropin", "category": "Agriculture",
        "description": "Agtech pioneer building the first global intelligent agriculture cloud.",
        "link": "https://www.cropin.com/", "rating": 4.5, "users": "5k+", "owner_id": 109,
        "simulator_prompt": "Act as a Cropin predictive intelligence tool. Provide simulated data-driven insights on farm yield predictions and supply chain monitoring."
    },
    {
        "company_name": "ARMMAN NGO", "ai_name": "ARMMAN", "category": "Healthcare",
        "description": "Leveraging mHealth to improve maternal and child health outcomes in India.",
        "link": "https://armman.org/", "rating": 4.9, "users": "30M+", "owner_id": 110,
        "simulator_prompt": "Act as an ARMMAN health advisor simulator. Provide general, supportive information regarding maternal health and child nutrition best practices."
    }
]

def translate_for_seed(tool):
    print(f"Translating {tool['ai_name']} into 5 languages... (This takes a few seconds)")
    prompt = f"""
    Translate these English values into Hindi (_hi), Tamil (_ta), Telugu (_te), Kannada (_kn), and Malayalam (_ml).
    Return ONLY a valid JSON object with the exact keys below.
    Keys required: company_name_hi, company_name_ta, company_name_te, company_name_kn, company_name_ml, ai_name_hi, ai_name_ta, ai_name_te, ai_name_kn, ai_name_ml, description_hi, description_ta, description_te, description_kn, description_ml, category_hi, category_ta, category_te, category_kn, category_ml
    
    Company Name: {tool['company_name']}
    AI Name: {tool['ai_name']}
    Description: {tool['description']}
    Category: {tool['category']}
    """
    try:
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error: {e}")
        return {}

def seed_database():
    db = SessionLocal()
    try:
        for tool in tools_data:
            existing = db.query(models.AgentDB).filter(models.AgentDB.ai_name == tool["ai_name"]).first()
            if not existing:
                # Get the translations from Gemini
                t = translate_for_seed(tool)

                new_agent = models.AgentDB(
                    id=str(uuid.uuid4()),
                    company_name=tool["company_name"], ai_name=tool["ai_name"], description=tool["description"], category=tool["category"],

                    company_name_hi=t.get("company_name_hi", ""), ai_name_hi=t.get("ai_name_hi", ""), description_hi=t.get("description_hi", ""), category_hi=t.get("category_hi", ""),
                    company_name_ta=t.get("company_name_ta", ""), ai_name_ta=t.get("ai_name_ta", ""), description_ta=t.get("description_ta", ""), category_ta=t.get("category_ta", ""),
                    company_name_te=t.get("company_name_te", ""), ai_name_te=t.get("ai_name_te", ""), description_te=t.get("description_te", ""), category_te=t.get("category_te", ""),
                    company_name_kn=t.get("company_name_kn", ""), ai_name_kn=t.get("ai_name_kn", ""), description_kn=t.get("description_kn", ""), category_kn=t.get("category_kn", ""),
                    company_name_ml=t.get("company_name_ml", ""), ai_name_ml=t.get("ai_name_ml", ""), description_ml=t.get("description_ml", ""), category_ml=t.get("category_ml", ""),

                    link=tool["link"], simulator_prompt=tool["simulator_prompt"], rating=tool["rating"], users=tool["users"], owner_id=tool["owner_id"], status="Active"
                )
                db.add(new_agent)
                time.sleep(4) # Increased pause to 4 seconds to safely process all 10 tools without hitting API limits

        db.commit()
        print("✅ Success! Multi-language database seeded.")
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
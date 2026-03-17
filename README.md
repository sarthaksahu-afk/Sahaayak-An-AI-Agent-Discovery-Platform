# Sahaayak

Sahaayak is a centralized, user-friendly AI Agents Discovery Platform built to help users discover, categorize, and connect with AI agents. Developed for the HackIndia hackathon, it specifically highlights tools focused on social impact, agriculture, and healthcare in India, making AI accessible across six different languages (English, Hindi, Tamil, Telugu, Kannada, and Malayalam). 

## Features

* **Curated AI Directory:** Browse and discover specialized AI tools categorized by industry and impact.
* **Gemini-Powered Sandbox Simulator:** Safely test and interact with AI agents directly within the platform before deploying them.
* **Developer Submission Workflow:** A seamless pipeline for developers to submit their AI tools for review and approval before they go live on the public directory.
* **Multilingual Support:** Breaking language barriers with native support for 6 regional languages.

## Tech Stack

* **Backend:** Python, FastAPI
* **Database:** PostgreSQL (with SQLAlchemy/SQLModel)
* **AI Integrations:** Google Gemini API, OpenAI API

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
* [Python 3.8+](https://www.python.org/downloads/)
* [PostgreSQL](https://www.postgresql.org/download/)

## Installation & Setup

**1. Clone the repository**
```bash
git clone [https://github.com/your-username/sahaayak.git](https://github.com/your-username/sahaayak.git)
cd sahaayak
```

**2. Set up a virtual environment**
It is highly recommended to use a virtual environment to isolate project dependencies.
```bash
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
python3 -m venv venv
source venv/bin/activate

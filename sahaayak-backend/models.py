from sqlalchemy import Column, String, Text, Float, Integer
from database import Base

class AgentDB(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True, index=True)

    # 1. English (Base)
    company_name = Column(String, index=True)
    ai_name = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True)

    # 2. Hindi
    company_name_hi = Column(String)
    ai_name_hi = Column(String)
    description_hi = Column(Text)
    category_hi = Column(String)

    # 3. Tamil
    company_name_ta = Column(String)
    ai_name_ta = Column(String)
    description_ta = Column(Text)
    category_ta = Column(String)

    # 4. Telugu
    company_name_te = Column(String)
    ai_name_te = Column(String)
    description_te = Column(Text)
    category_te = Column(String)

    # 5. Kannada
    company_name_kn = Column(String)
    ai_name_kn = Column(String)
    description_kn = Column(Text)
    category_kn = Column(String)

    # 6. Malayalam
    company_name_ml = Column(String)
    ai_name_ml = Column(String)
    description_ml = Column(Text)
    category_ml = Column(String)

    # Meta Fields
    link = Column(String)
    simulator_prompt = Column(Text)
    rating = Column(Float, default=0.0)
    users = Column(String, default="0")
    status = Column(String, default="Pending Approval", index=True)
    owner_id = Column(Integer, index=True, nullable=True)
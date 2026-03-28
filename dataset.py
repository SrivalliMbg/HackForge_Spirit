import random
import csv
from datetime import datetime, timedelta

# -----------------------------
# MASSIVE ISSUE GENERATION
# -----------------------------

subjects = [
    "payment", "refund", "OTP", "login", "order", "delivery",
    "app", "website", "account", "support", "transaction",
    "checkout", "address", "tracking", "email"
]

problems = [
    "not working", "failed", "not received", "delayed",
    "stuck", "crashing", "not loading", "incorrect",
    "not updating", "not responding", "not processing",
    "showing error", "blocked", "missing"
]

contexts = [
    "during checkout", "while logging in", "after payment",
    "while placing order", "during delivery", "in app",
    "on website", "after update", "during transaction"
]

generated_issues = [
    f"{s} {p} {c}"
    for s in subjects for p in problems for c in contexts
]

# -----------------------------
# EXTRA REAL PAYMENT ISSUES 🔥
# -----------------------------

payment_issues_extra = [
    "money got deducted but order not placed",
    "payment showing success but no order created",
    "amount debited twice for same order",
    "refund not credited to bank account",
    "UPI payment failed but money gone",
    "Google Pay transaction stuck",
    "PhonePe payment processing forever",
    "card payment declined without reason",
    "payment page crashed during transaction",
    "EMI option not working properly",
    "wallet money deducted automatically",
    "refund showing processed but not received",
    "bank says payment successful but app not updated"
]

all_issues = generated_issues + payment_issues_extra

# -----------------------------
# HUMAN STYLE GENERATION
# -----------------------------

emotions = [
    "really frustrated", "very disappointed", "so annoying",
    "honestly upset", "fed up with this", "not happy at all",
    "seriously irritated"
]

connectors = [
    "like seriously", "I don't understand why",
    "this is not acceptable", "again and again same issue",
    "expected better from this app"
]

problem_actions = [
    "nothing is working properly",
    "no response from support",
    "money already deducted",
    "app just froze",
    "page kept loading forever",
    "I couldn't proceed further",
    "it failed again"
]

complaint_templates = [
    "I tried {issue} but {problem}, {emotion}.",
    "Not sure what's happening, {issue} and {problem}. {emotion}.",
    "Facing issue where {issue}, and now {problem}. {emotion}.",
    "This is the third time {issue}, still {problem}. {connector}.",
    "I was just trying to use the app and {issue}, then {problem}. {emotion}.",
    "{issue} happened and after that {problem}, really bad experience.",
    "Why is this happening? {issue} and also {problem}. {emotion}."
]

# Slight typos for realism
def add_typos(text):
    typos = {
        "received": "recieved",
        "payment": "payement",
        "because": "becoz",
        "really": "realy"
    }
    for k, v in typos.items():
        if random.random() < 0.2:
            text = text.replace(k, v)
    return text

def generate_human_feedback(issue):
    template = random.choice(complaint_templates)
    text = template.format(
        issue=issue,
        problem=random.choice(problem_actions),
        emotion=random.choice(emotions),
        connector=random.choice(connectors)
    )
    return add_typos(text)

# -----------------------------
# POSITIVE FEEDBACK
# -----------------------------

positive_templates = [
    "Really liked the experience, everything worked fine and smooth 😊",
    "Service was good and delivery was fast, happy with it 👍",
    "No issues at all, app works perfectly and easy to use ❤️"
]

# -----------------------------
# EXTRA DATA
# -----------------------------

cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
]

sources = [
    "Zomato", "Flipkart", "Amazon India", "Twitter",
    "Google Reviews", "Swiggy", "Website Review"
]

def random_date():
    start = datetime(2023, 1, 1)
    end = datetime(2026, 1, 1)
    delta = end - start
    return (start + timedelta(seconds=random.randint(0, int(delta.total_seconds())))).strftime("%Y-%m-%d %H:%M:%S")

# -----------------------------
# CREATE DATASET
# -----------------------------

headers = ["Text", "Sentiment", "Source", "Date/Time", "User ID", "Location", "Confidence Score"]

rows = []

for i in range(1500):
    sentiment = random.choice(["Positive", "Negative"])

    if sentiment == "Negative":
        issue = random.choice(all_issues)
        text = generate_human_feedback(issue)
        confidence = round(random.uniform(0.5, 0.75), 2)
    else:
        text = random.choice(positive_templates)
        confidence = round(random.uniform(0.8, 0.98), 2)

    row = [
        text,
        sentiment,
        random.choice(sources),
        random_date(),
        f"user{random.randint(1000,9999)}",
        random.choice(cities),
        confidence
    ]

    rows.append(row)

# -----------------------------
# SAVE FILE
# -----------------------------

with open("customer_feedback_humanized.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows)

print("✅ Humanized dataset created: customer_feedback_humanized.csv")
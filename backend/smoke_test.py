from diagnose import diagnose

cases = [
    {"task": "Return the sum of two numbers", "code": "def add(a, b):\\n    print(a + b)", "expect": "M06"},
    {"task": "Return True if the number is exactly 10", "code": "def is_ten(n):\\n    if n = 10:\\n        return True\\n    return False", "expect": "M01"},
    {"task": "Return the sum of two numbers", "code": "def add(a, b):\\n    return a + b", "expect": "NONE"},
    {"task": "Return the sum of two numbers", "code": "hello world", "expect": "UNSURE"}
]

print("Running smoke test...")
for c in cases:
    res = diagnose(c["task"], c["code"])
    print(f"Expect {c['expect']} -> Got {res['label']} | Reasoning: {res['reasoning']}")

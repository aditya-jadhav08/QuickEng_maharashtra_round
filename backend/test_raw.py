from diagnose import diagnose, MISCONCEPTIONS
print("Total loaded:", len(MISCONCEPTIONS))
print("Is M1 loaded?", "M1" in MISCONCEPTIONS)
print("Is M01 loaded?", "M01" in MISCONCEPTIONS)
res = diagnose("Return True if the number is exactly 10", "def is_ten(n):\n    if n = 10:\n        return True\n    return False")
print(res)

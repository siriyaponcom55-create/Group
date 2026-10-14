import re
import json

with open("/tmp/share.html", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for "side_body" or user prompt or response text
# In Gemini share pages, the payload is often inside AF_initDataCallback with key 'ds:1' or similar, or inside specific js arrays
# Let's find all script tags
scripts = re.findall(r"<script[^>]*>(.*?)</script>", content, re.DOTALL)
print(f"Total script tags: {len(scripts)}")

texts = []
for s in scripts:
    if "ระบบเก็บเอกสารโรงเรียน" in s or "4 ฝ่าย" in s or "สพฐ" in s:
        print("Found target keywords in script, length:", len(s))
        # Find unicode escaped strings or direct strings
        # Look for substrings
        for line in s.split("\n"):
            if any(k in line for k in ["ฝ่าย", "เอกสาร", "โรงเรียน", "สพฐ", "วิชาการ", "งบประมาณ", "บุคคล", "บริหารทั่วไป"]):
                print("Line match:", line[:300])

with open("/tmp/extracted_texts.txt", "w", encoding="utf-8") as out:
    # write matches
    for s in scripts:
        matches = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', s)
        for m in matches:
            if any(k in m for k in ["ฝ่าย", "เอกสาร", "โรงเรียน", "สพฐ", "วิชาการ", "งบประมาณ", "บุคคล", "ทั่วไป"]):
                # decode unicode escape
                try:
                    decoded = m.encode().decode('unicode_escape')
                except:
                    decoded = m
                if len(decoded) > 30:
                    out.write(decoded + "\n---\n")

print("Done extracting to /tmp/extracted_texts.txt")

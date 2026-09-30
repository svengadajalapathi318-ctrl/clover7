import re
with open(r'c:\Users\kingk\OneDrive\Pictures\Clover 7\live.html', encoding='utf-8', errors='ignore') as f:
    text = f.read()

links = set(re.findall(r'href=[\'"]([^\'">]+)[\'"]', text))
for l in sorted(links):
    if l.endswith('.html') or l.startswith('http') or l.startswith('/'):
        print(l)

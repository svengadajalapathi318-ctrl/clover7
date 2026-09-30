import glob, re
html_files = glob.glob(r'c:\Users\kingk\OneDrive\Pictures\Clover 7\**\*.html', recursive=True)
for file in html_files:
    if 'clover7-recovered-final' in file or '_backup' in file or 'scratch' in file:
        continue
    with open(file, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    
    # Looking for =" followed by something that doesn't contain a quote, then a single quote
    mismatches = re.findall(r'="[^"]*?\'', text)
    if mismatches:
        # Filter out cases where it's valid, like JavaScript in onclick="foo('bar')"
        invalid = [m for m in mismatches if not re.search(r'\w+\(', m)]
        if invalid:
            print(f'{file} has mismatches:')
            for m in invalid[:3]:
                print('  ', repr(m))

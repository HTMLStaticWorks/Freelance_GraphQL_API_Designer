import os
import re

pages_dir = r"c:\Users\prath\OneDrive\Desktop\Websites\May_1\Freelance GraphQL API Designer\pages"
html_files = [f for f in os.listdir(pages_dir) if f.endswith('.html')]

# Favicon link to add
favicon_link = '  <link rel="icon" type="image/png" href="../assets/images/favicon.png">\n'

# Regex to find icons in mobile menu links
icon_pattern = re.compile(r'<a href="[^"]+" class="mobile-menu__link"><i class="[^"]+"></i>\s*([^<]+)</a>')

for filename in html_files:
    filepath = os.path.join(pages_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add favicon if not present
    if 'rel="icon"' not in content:
        content = content.replace('  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">', 
                                  favicon_link + '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">')
    
    # Remove icons from mobile menu
    content = icon_pattern.sub(r'<a href="\g<0>" class="mobile-menu__link">\1</a>', content)
    # Wait, the regex above is slightly wrong for sub. Let's fix it.
    
    # Correcting the removal of icons
    content = re.sub(r'(<a href="[^"]+" class="mobile-menu__link">)<i class="[^"]+"></i>\s*([^<]+)(</a>)', r'\1\2\3', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Updated {len(html_files)} files.")

import sys

with open('/tmp/old_landing_page.jsx', 'r') as f:
    old_lines = f.read().splitlines()

with open('/Users/Div/Class-project/medivault/src/pages/LandingPage.jsx', 'r') as f:
    cur_lines = f.read().splitlines()

start_old, end_old = -1, -1
for i, line in enumerate(old_lines):
    if 'id="entry-section"' in line and start_old == -1:
        start_old = i
    if start_old != -1 and '</section>' in line:
        end_old = i
        break

start_cur, end_cur = -1, -1
for i, line in enumerate(cur_lines):
    if 'id="entry-section"' in line and start_cur == -1:
        start_cur = i
    if start_cur != -1 and '</section>' in line:
        end_cur = i
        break

if start_old != -1 and end_old != -1 and start_cur != -1 and end_cur != -1:
    replacement = old_lines[start_old:end_old + 1]
    new_lines = cur_lines[:start_cur] + replacement + cur_lines[end_cur + 1:]
    
    with open('/Users/Div/Class-project/medivault/src/pages/LandingPage.jsx', 'w') as f:
        f.write('\n'.join(new_lines) + '\n')
    print('Successfully replaced entry-section')
else:
    print('Failed finding sections:', start_old, end_old, start_cur, end_cur)

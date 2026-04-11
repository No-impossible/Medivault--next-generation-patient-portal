import os
import re

replacements = {
    r'\bbg-white\b(?! dark:bg-)': 'bg-white dark:bg-[#1e1e1e]',
    r'\bbg-slate-50\b(?! dark:bg-)': 'bg-slate-50 dark:bg-[#121212]',
    r'\bbg-slate-100\b(?! dark:bg-)': 'bg-slate-100 dark:bg-slate-800',
    r'\bbg-slate-200\b(?! dark:bg-)': 'bg-slate-200 dark:bg-slate-700',
    r'\btext-slate-900\b(?! dark:text-)': 'text-slate-900 dark:text-white',
    r'\btext-slate-800\b(?! dark:text-)': 'text-slate-800 dark:text-slate-100',
    r'\btext-slate-700\b(?! dark:text-)': 'text-slate-700 dark:text-slate-300',
    r'\btext-slate-600\b(?! dark:text-)': 'text-slate-600 dark:text-slate-400',
    r'\btext-slate-500\b(?! dark:text-)': 'text-slate-500 dark:text-slate-400',
    r'\btext-slate-400\b(?! dark:text-)': 'text-slate-400 dark:text-slate-500',
    r'\bborder-slate-100\b(?! dark:border-)': 'border-slate-100 dark:border-slate-800',
    r'\bborder-slate-200\b(?! dark:border-)': 'border-slate-200 dark:border-slate-700',
    r'\bborder-gray-100\b(?! dark:border-)': 'border-gray-100 dark:border-gray-800',
    r'\bbg-indigo-50\b(?! dark:bg-)': 'bg-indigo-50 dark:bg-indigo-900/30',
    r'\bbg-emerald-50\b(?! dark:bg-)': 'bg-emerald-50 dark:bg-emerald-900/20',
    r'\bbg-teal-50\b(?! dark:bg-)': 'bg-teal-50 dark:bg-teal-900/20',
    r'\bhover:bg-slate-50\b(?! dark:hover:bg-)': 'hover:bg-slate-50 dark:hover:bg-slate-800/50',
    r'\bhover:bg-slate-100\b(?! dark:hover:bg-)': 'hover:bg-slate-100 dark:hover:bg-slate-800'
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    orig_content = content
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)
        
    if content != orig_content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root_dir in ['src/layouts']:
    for root, dirs, files in os.walk(os.path.join('/Users/Div/Class-project/medivault', root_dir)):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js') or file.endswith('.tsx'):
                process_file(os.path.join(root, file))

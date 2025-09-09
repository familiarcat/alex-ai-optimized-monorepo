#!/usr/bin/env python3
"""
Secret Cleanup Script
Removes API keys and tokens from files to make them GitHub-safe
"""

import os
import re
from typing import List

class SecretCleaner:
    def __init__(self):
        self.secret_patterns = [
            r'sk-[a-zA-Z0-9]{20,}',
            r'ghp_[a-zA-Z0-9]{36}',
            r'AKIA[0-9A-Z]{16}',
            r'[0-9a-zA-Z/+]{40}',
            r'xoxb-[0-9]{11}-[0-9]{11}-[a-zA-Z0-9]{24}',
            r'ya29\.[a-zA-Z0-9_-]+',
            r'AIza[0-9A-Za-z\\-_]{35}',
            r'[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}',
            r'[a-f0-9]{32}',
            r'[a-f0-9]{40}',
            r'[a-f0-9]{64}'
        ]
        
        self.replacement_patterns = {
            'openai': 'sk-OPENAI_API_KEY_PLACEHOLDER',
            'anthropic': 'sk-ant-ANTHROPIC_API_KEY_PLACEHOLDER',
            'github': 'ghp_GITHUB_TOKEN_PLACEHOLDER',
            'aws': 'AKIA_AWS_ACCESS_KEY_PLACEHOLDER',
            'slack': 'xoxb-SLACK_BOT_TOKEN_PLACEHOLDER',
            'google': 'AIza_GOOGLE_API_KEY_PLACEHOLDER',
            'generic': 'API_KEY_PLACEHOLDER'
        }
    
    def clean_file(self, file_path: str) -> bool:
        """Clean secrets from a single file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Replace various secret patterns
            for pattern in self.secret_patterns:
                content = re.sub(pattern, 'API_KEY_PLACEHOLDER', content)
            
            # Specific replacements for common patterns
            content = re.sub(r'sk-[a-zA-Z0-9]{20,}', 'sk-OPENAI_API_KEY_PLACEHOLDER', content)
            content = re.sub(r'ghp_[a-zA-Z0-9]{36}', 'ghp_GITHUB_TOKEN_PLACEHOLDER', content)
            content = re.sub(r'AKIA[0-9A-Z]{16}', 'AKIA_AWS_ACCESS_KEY_PLACEHOLDER', content)
            
            # Only write if content changed
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Cleaned: {file_path}")
                return True
            else:
                print(f"⚪ No secrets found: {file_path}")
                return False
                
        except Exception as e:
            print(f"❌ Error cleaning {file_path}: {e}")
            return False
    
    def find_files_with_secrets(self) -> List[str]:
        """Find files that likely contain secrets"""
        files_with_secrets = []
        
        # Common file extensions to check
        extensions = ['.md', '.js', '.py', '.json', '.txt', '.sh', '.yaml', '.yml']
        
        for root, dirs, files in os.walk('.'):
            # Skip certain directories
            dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
            
            for file in files:
                if any(file.endswith(ext) for ext in extensions):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        # Check if file contains secret patterns
                        for pattern in self.secret_patterns:
                            if re.search(pattern, content):
                                files_with_secrets.append(file_path)
                                break
                    except:
                        continue
        
        return files_with_secrets
    
    def clean_all_secrets(self):
        """Clean all files with secrets"""
        print("🔍 Scanning for files with secrets...")
        files_with_secrets = self.find_files_with_secrets()
        
        print(f"Found {len(files_with_secrets)} files with potential secrets")
        
        cleaned_count = 0
        for file_path in files_with_secrets:
            if self.clean_file(file_path):
                cleaned_count += 1
        
        print(f"\n✅ Cleaned {cleaned_count} files")
        return cleaned_count

if __name__ == "__main__":
    cleaner = SecretCleaner()
    cleaner.clean_all_secrets()

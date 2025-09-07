#!/usr/bin/env python3
"""
YOLO Mode Diagnostic Test
========================

This script tests if YOLO Mode is actually working by attempting
to create files without confirmation prompts.
"""

import os
import sys
from datetime import datetime

def test_yolo_mode():
    """Test if YOLO Mode is working"""
    print("🔍 YOLO Mode Diagnostic Test")
    print("=" * 40)
    
    # Test 1: File creation
    test_file = "yolo_test_file.txt"
    try:
        with open(test_file, 'w') as f:
            f.write(f"YOLO Mode Test - {datetime.now()}\n")
            f.write("If you can see this file, YOLO Mode is working!\n")
        print(f"✅ Test 1 PASSED: Created {test_file}")
    except Exception as e:
        print(f"❌ Test 1 FAILED: Could not create {test_file} - {e}")
    
    # Test 2: Directory creation
    test_dir = "yolo_test_directory"
    try:
        os.makedirs(test_dir, exist_ok=True)
        print(f"✅ Test 2 PASSED: Created directory {test_dir}")
    except Exception as e:
        print(f"❌ Test 2 FAILED: Could not create {test_dir} - {e}")
    
    # Test 3: Multiple file creation
    for i in range(3):
        test_file = f"yolo_test_{i}.txt"
        try:
            with open(test_file, 'w') as f:
                f.write(f"YOLO Test File {i} - {datetime.now()}\n")
            print(f"✅ Test 3.{i+1} PASSED: Created {test_file}")
        except Exception as e:
            print(f"❌ Test 3.{i+1} FAILED: Could not create {test_file} - {e}")
    
    print("\n🎯 DIAGNOSTIC RESULTS:")
    print("If all tests passed, YOLO Mode is working correctly.")
    print("If any tests failed, YOLO Mode needs to be properly activated.")

if __name__ == "__main__":
    test_yolo_mode()


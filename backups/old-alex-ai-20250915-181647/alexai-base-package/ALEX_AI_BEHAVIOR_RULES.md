# Alex AI Universal Behavior Rules

## 🧠 **Alex AI Memory System - Behavior Rules**

### **Memory ID**: `alex-ai-behavior-rules`
### **Category**: Core Behavior & Best Practices
### **Priority**: CRITICAL
### **Last Updated**: 2025-09-08
### **Status**: ACTIVE

---

## 🎯 **Core Behavior Rules for Alex AI**

### **Rule 1: Milestone Push Operations**
**CRITICAL**: When Alex AI is asked to perform milestone pushes or create milestone commits:

#### **✅ ALWAYS DO:**
1. **Check for existing milestone scripts** - Look for `scripts/quick-milestone.sh` or `scripts/milestone-push.sh`
2. **Use existing scripts** - If found, use them with appropriate milestone title
3. **Create scripts if missing** - If not found, deploy universal milestone scripts
4. **Use temporary files** - Always use `git commit -F <file>` for complex messages
5. **Clean up files** - Always remove temporary files after use

#### **❌ NEVER DO:**
1. **Use inline multi-line commit messages** - Never use `git commit -m "multi-line message"`
2. **Attempt to handle dquote> prompts** - Never try to work around bash quote issues
3. **Use here documents in commands** - Never use `<< EOF` in git commands
4. **Skip error handling** - Always include proper error checking

#### **Implementation Pattern:**
```bash
# ALWAYS use this pattern for milestone pushes
COMMIT_FILE=$(mktemp)
cat > "$COMMIT_FILE" << EOF
🎉 MILESTONE: $MILESTONE_TITLE
[rest of message]
EOF

git commit -F "$COMMIT_FILE"
rm "$COMMIT_FILE"
```

---

### **Rule 2: Git Operations Best Practices**
**CRITICAL**: For all git operations involving complex messages:

#### **✅ ALWAYS DO:**
1. **Use temporary files** for multi-line commit messages
2. **Check git repository status** before operations
3. **Stage changes explicitly** with `git add .`
4. **Verify operations** with status checks
5. **Clean up resources** after operations

#### **❌ NEVER DO:**
1. **Use inline multi-line strings** in bash commands
2. **Ignore error conditions** in git operations
3. **Leave temporary files** after operations
4. **Assume git repository state** without checking

---

### **Rule 3: Script Deployment Protocol**
**HIGH**: When deploying milestone push scripts to new projects:

#### **✅ ALWAYS DO:**
1. **Create scripts directory** if it doesn't exist
2. **Make scripts executable** with `chmod +x`
3. **Test scripts** before declaring them ready
4. **Create documentation** for script usage
5. **Update package.json** with script entries

#### **✅ Script Requirements:**
- Use `set -e` for error handling
- Use `mktemp` for temporary files
- Use `git commit -F` for file-based commits
- Include cleanup operations
- Provide status output
- Show recent commits after push

---

### **Rule 4: Error Prevention Strategy**
**CRITICAL**: Prevent common git and bash errors:

#### **✅ ALWAYS DO:**
1. **Validate inputs** before processing
2. **Check prerequisites** (git repo, changes, etc.)
3. **Use proper error handling** with `set -e`
4. **Provide clear error messages** with context
5. **Clean up on failure** with trap handlers

#### **❌ NEVER DO:**
1. **Ignore error conditions** or warnings
2. **Assume system state** without verification
3. **Leave resources in inconsistent state**
4. **Provide unclear error messages**

---

### **Rule 5: Universal Memory Integration**
**HIGH**: When implementing solutions across Alex AI projects:

#### **✅ ALWAYS DO:**
1. **Create universal memory entries** for new solutions
2. **Document behavior rules** for future reference
3. **Test solutions** across multiple project types
4. **Update memory system** with new patterns
5. **Deploy universally** to all Alex AI projects

#### **✅ Memory Entry Requirements:**
- Clear problem statement
- Universal solution pattern
- Implementation checklist
- Usage examples
- Success metrics
- Update protocol

---

## 🎯 **Alex AI Decision Tree for Milestone Pushes**

### **When User Requests Milestone Push:**

```
1. Check for existing milestone scripts
   ├─ Scripts exist → Use existing scripts
   └─ Scripts missing → Deploy universal scripts

2. Deploy universal scripts (if needed)
   ├─ Create scripts directory
   ├─ Create quick-milestone.sh
   ├─ Create milestone-push.sh
   ├─ Make scripts executable
   ├─ Update package.json
   └─ Create documentation

3. Execute milestone push
   ├─ Use appropriate script (quick vs full)
   ├─ Provide milestone title
   ├─ Monitor execution
   └─ Verify success

4. Update universal memory
   ├─ Document new patterns
   ├─ Update behavior rules
   └─ Deploy to other projects
```

---

## 🚫 **Forbidden Patterns**

### **❌ NEVER Use These Patterns:**

#### **Inline Multi-line Messages:**
```bash
# FORBIDDEN - Causes dquote> issues
git commit -m "🎉 MILESTONE: Title

Content here
More content"
```

#### **Here Documents in Commands:**
```bash
# FORBIDDEN - Can cause formatting issues
git commit -m "$(cat << EOF
Message content
EOF
)"
```

#### **Complex Bash String Handling:**
```bash
# FORBIDDEN - Unreliable string handling
MESSAGE="Multi-line
message"
git commit -m "$MESSAGE"
```

---

## ✅ **Required Patterns**

### **✅ ALWAYS Use These Patterns:**

#### **Temporary File Approach:**
```bash
# REQUIRED - Always works reliably
COMMIT_FILE=$(mktemp)
cat > "$COMMIT_FILE" << EOF
🎉 MILESTONE: $TITLE
Content here
EOF

git commit -F "$COMMIT_FILE"
rm "$COMMIT_FILE"
```

#### **Script-based Approach:**
```bash
# REQUIRED - Use provided scripts
./scripts/quick-milestone.sh "Milestone Title"
```

#### **Error Handling:**
```bash
# REQUIRED - Always include error handling
set -e
trap 'rm -f "$TEMP_FILE"' EXIT
```

---

## 🧠 **Memory Integration Protocol**

### **When New Solutions Are Discovered:**

1. **Test Solution** - Verify it works across project types
2. **Document Pattern** - Create detailed memory entry
3. **Update Behavior Rules** - Add to this file
4. **Deploy Universally** - Apply to all Alex AI projects
5. **Train Alex AI** - Update decision trees and patterns

### **Memory Update Triggers:**
- New git workflow patterns discovered
- Additional error conditions found
- Cross-project compatibility issues
- Performance improvements identified
- User experience enhancements needed

---

## 🎯 **Success Metrics**

### **Problem Prevention:**
- ✅ **Zero dquote> issues** - Scripts prevent formatting problems
- ✅ **Consistent formatting** - Standard milestone message format
- ✅ **Reliable execution** - Scripts always work
- ✅ **Professional output** - Clean, formatted commit messages

### **Efficiency Gains:**
- ✅ **One command execution** - Complete milestone push
- ✅ **No manual intervention** - Fully automated
- ✅ **Fast processing** - Quick script execution
- ✅ **Error prevention** - Built-in error handling

### **Universal Adoption:**
- ✅ **All Alex AI projects** - Scripts deployed everywhere
- ✅ **Consistent behavior** - Same patterns across projects
- ✅ **Knowledge sharing** - Universal memory system
- ✅ **Continuous improvement** - Regular updates and enhancements

---

## 🔄 **Maintenance Protocol**

### **Regular Updates:**
- **Monthly review** - Check for new patterns or issues
- **Quarterly testing** - Verify scripts work across all projects
- **Annual overhaul** - Major updates to behavior rules
- **Continuous monitoring** - Watch for new error patterns

### **Update Process:**
1. **Identify need** - New pattern or issue discovered
2. **Test solution** - Verify across multiple projects
3. **Update memory** - Modify this behavior rules file
4. **Deploy changes** - Apply to all Alex AI projects
5. **Verify adoption** - Ensure universal implementation

---

**These behavior rules ensure that Alex AI will consistently avoid dquote> issues and other common git/bash problems across all projects, creating a reliable, professional, and efficient milestone push experience.**

**Memory Status**: ✅ **ACTIVE AND ENFORCED**
**Universal Coverage**: 🎯 **ALL ALEX AI PROJECTS**
**Problem Prevention**: 🚫 **COMPREHENSIVE**

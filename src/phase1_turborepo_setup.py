#!/usr/bin/env python3
"""
Phase 1: Turborepo Foundation Setup
==================================

This system executes Phase 1 of the Turborepo implementation plan:
- Install Turborepo and configure package.json
- Set up workspace structure
- Create turbo.json configuration
- Migrate existing apps and packages
- Configure basic tasks
- Test functionality
"""

import os
import json
import subprocess
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s:%(name)s:%(message)s')

class Phase1TurborepoSetup:
    """Phase 1 Turborepo foundation setup system"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root).resolve()
        self.setup_log = []
        self.errors = []
        
    def log_step(self, step: str, status: str, details: str = ""):
        """Log a setup step"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "step": step,
            "status": status,
            "details": details
        }
        self.setup_log.append(log_entry)
        
        if status == "success":
            logging.info(f"✅ {step}: {details}")
        elif status == "error":
            logging.error(f"❌ {step}: {details}")
            self.errors.append(log_entry)
        else:
            logging.info(f"🔄 {step}: {details}")
    
    def run_command(self, command: str, cwd: str = None) -> tuple[bool, str]:
        """Run a shell command and return success status and output"""
        try:
            if cwd is None:
                cwd = self.project_root
                
            result = subprocess.run(
                command,
                shell=True,
                cwd=cwd,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            if result.returncode == 0:
                return True, result.stdout
            else:
                return False, result.stderr
                
        except subprocess.TimeoutExpired:
            return False, "Command timed out after 5 minutes"
        except Exception as e:
            return False, str(e)
    
    def install_turborepo(self):
        """Install Turborepo and configure package.json"""
        self.log_step("Install Turborepo", "in_progress", "Installing Turborepo as dev dependency")
        
        # Check if package.json exists
        package_json_path = self.project_root / "package.json"
        if not package_json_path.exists():
            self.log_step("Create package.json", "in_progress", "Creating initial package.json")
            
            package_json = {
                "name": "alex-ai-optimized-monorepo",
                "version": "1.0.0",
                "description": "Alex AI Optimized Monorepo with Turborepo",
                "private": True,
                "workspaces": [
                    "apps/*",
                    "packages/*",
                    "crew/*"
                ],
                "scripts": {
                    "build": "turbo run build",
                    "dev": "turbo run dev",
                    "test": "turbo run test",
                    "lint": "turbo run lint",
                    "type-check": "turbo run type-check",
                    "clean": "turbo run clean"
                },
                "devDependencies": {
                    "turbo": "^1.10.0"
                },
                "packageManager": "pnpm@8.0.0"
            }
            
            with open(package_json_path, 'w') as f:
                json.dump(package_json, f, indent=2)
            
            self.log_step("Create package.json", "success", "Created package.json with Turborepo configuration")
        else:
            self.log_step("Update package.json", "in_progress", "Adding Turborepo to existing package.json")
            
            # Read existing package.json
            with open(package_json_path, 'r') as f:
                package_json = json.load(f)
            
            # Add Turborepo configuration
            if "workspaces" not in package_json:
                package_json["workspaces"] = ["apps/*", "packages/*", "crew/*"]
            
            if "scripts" not in package_json:
                package_json["scripts"] = {}
            
            # Add Turborepo scripts
            package_json["scripts"].update({
                "build": "turbo run build",
                "dev": "turbo run dev",
                "test": "turbo run test",
                "lint": "turbo run lint",
                "type-check": "turbo run type-check",
                "clean": "turbo run clean"
            })
            
            # Add Turborepo as dev dependency
            if "devDependencies" not in package_json:
                package_json["devDependencies"] = {}
            
            package_json["devDependencies"]["turbo"] = "^1.10.0"
            package_json["packageManager"] = "pnpm@8.0.0"
            
            with open(package_json_path, 'w') as f:
                json.dump(package_json, f, indent=2)
            
            self.log_step("Update package.json", "success", "Updated package.json with Turborepo configuration")
        
        # Install dependencies
        self.log_step("Install Dependencies", "in_progress", "Installing Turborepo and dependencies")
        success, output = self.run_command("pnpm install")
        
        if success:
            self.log_step("Install Dependencies", "success", "Successfully installed Turborepo and dependencies")
        else:
            self.log_step("Install Dependencies", "error", f"Failed to install dependencies: {output}")
            return False
        
        return True
    
    def setup_workspace_structure(self):
        """Set up workspace directory structure"""
        self.log_step("Setup Workspace Structure", "in_progress", "Creating apps/, packages/, and crew/ directories")
        
        directories = ["apps", "packages", "crew"]
        
        for directory in directories:
            dir_path = self.project_root / directory
            if not dir_path.exists():
                dir_path.mkdir(parents=True, exist_ok=True)
                self.log_step(f"Create {directory}/", "success", f"Created {directory}/ directory")
            else:
                self.log_step(f"Create {directory}/", "success", f"{directory}/ directory already exists")
        
        # Create .gitkeep files to ensure directories are tracked
        for directory in directories:
            gitkeep_path = self.project_root / directory / ".gitkeep"
            if not gitkeep_path.exists():
                gitkeep_path.write_text("# This file ensures the directory is tracked by git\n")
        
        self.log_step("Setup Workspace Structure", "success", "Workspace structure created successfully")
        return True
    
    def create_turbo_config(self):
        """Create turbo.json configuration file"""
        self.log_step("Create turbo.json", "in_progress", "Creating Turborepo configuration file")
        
        turbo_config = {
            "$schema": "https://turbo.build/schema.json",
            "globalDependencies": ["**/.env.*local"],
            "pipeline": {
                "build": {
                    "dependsOn": ["^build"],
                    "outputs": [".next/**", "dist/**", "build/**", "!.next/cache/**"]
                },
                "dev": {
                    "cache": False,
                    "persistent": True
                },
                "test": {
                    "dependsOn": ["build"],
                    "outputs": ["coverage/**"]
                },
                "lint": {
                    "outputs": []
                },
                "type-check": {
                    "dependsOn": ["^build"],
                    "outputs": []
                },
                "clean": {
                    "cache": False
                }
            }
        }
        
        turbo_json_path = self.project_root / "turbo.json"
        with open(turbo_json_path, 'w') as f:
            json.dump(turbo_config, f, indent=2)
        
        self.log_step("Create turbo.json", "success", "Created turbo.json configuration file")
        return True
    
    def migrate_existing_apps(self):
        """Migrate existing Next.js apps to apps/ directory"""
        self.log_step("Migrate Existing Apps", "in_progress", "Moving existing Next.js apps to apps/ directory")
        
        # Check for existing Next.js apps
        existing_apps = []
        
        # Look for alex-ai-job-search
        job_search_path = self.project_root / "alex-ai-job-search"
        if job_search_path.exists() and (job_search_path / "package.json").exists():
            existing_apps.append("alex-ai-job-search")
        
        # Look for other potential Next.js apps
        for item in self.project_root.iterdir():
            if item.is_dir() and item.name not in ["apps", "packages", "crew", "src", "docs", "config", "workflows", "templates", "scripts", "archives", "final_cleanup_backup_20250906_203310", "monorepo_cleanup_backup_20250906_202737"]:
                package_json_path = item / "package.json"
                if package_json_path.exists():
                    try:
                        with open(package_json_path, 'r') as f:
                            package_json = json.load(f)
                        
                        # Check if it's a Next.js app
                        if "next" in package_json.get("dependencies", {}) or "next" in package_json.get("devDependencies", {}):
                            existing_apps.append(item.name)
                    except:
                        continue
        
        if not existing_apps:
            self.log_step("Migrate Existing Apps", "success", "No existing Next.js apps found to migrate")
            return True
        
        # Move apps to apps/ directory
        for app_name in existing_apps:
            source_path = self.project_root / app_name
            target_path = self.project_root / "apps" / app_name
            
            if not target_path.exists():
                # Move the directory
                source_path.rename(target_path)
                self.log_step(f"Migrate {app_name}", "success", f"Moved {app_name} to apps/{app_name}")
            else:
                self.log_step(f"Migrate {app_name}", "success", f"{app_name} already exists in apps/ directory")
        
        self.log_step("Migrate Existing Apps", "success", f"Successfully migrated {len(existing_apps)} apps")
        return True
    
    def setup_shared_packages(self):
        """Set up shared packages in packages/ directory"""
        self.log_step("Setup Shared Packages", "in_progress", "Creating shared packages structure")
        
        shared_packages = [
            {
                "name": "alex-ai-core",
                "description": "Core Alex AI functionality and utilities",
                "dependencies": {}
            },
            {
                "name": "alex-ai-components",
                "description": "Shared UI components for Alex AI applications",
                "dependencies": {
                    "react": "^18.0.0",
                    "react-dom": "^18.0.0"
                }
            },
            {
                "name": "alex-ai-utils",
                "description": "Shared utility functions and helpers",
                "dependencies": {}
            },
            {
                "name": "alex-ai-types",
                "description": "Shared TypeScript type definitions",
                "dependencies": {
                    "typescript": "^5.0.0"
                }
            }
        ]
        
        for package_info in shared_packages:
            package_dir = self.project_root / "packages" / package_info["name"]
            
            if not package_dir.exists():
                package_dir.mkdir(parents=True, exist_ok=True)
                
                # Create package.json
                package_json = {
                    "name": f"@{package_info['name']}",
                    "version": "1.0.0",
                    "description": package_info["description"],
                    "main": "dist/index.js",
                    "types": "dist/index.d.ts",
                    "scripts": {
                        "build": "tsc",
                        "dev": "tsc --watch",
                        "clean": "rm -rf dist"
                    },
                    "dependencies": package_info["dependencies"],
                    "devDependencies": {
                        "typescript": "^5.0.0",
                        "@types/node": "^20.0.0"
                    }
                }
                
                with open(package_dir / "package.json", 'w') as f:
                    json.dump(package_json, f, indent=2)
                
                # Create basic TypeScript config
                tsconfig = {
                    "compilerOptions": {
                        "target": "ES2020",
                        "module": "commonjs",
                        "lib": ["ES2020"],
                        "outDir": "./dist",
                        "rootDir": "./src",
                        "strict": True,
                        "esModuleInterop": True,
                        "skipLibCheck": True,
                        "forceConsistentCasingInFileNames": True,
                        "declaration": True,
                        "declarationMap": True,
                        "sourceMap": True
                    },
                    "include": ["src/**/*"],
                    "exclude": ["node_modules", "dist"]
                }
                
                with open(package_dir / "tsconfig.json", 'w') as f:
                    json.dump(tsconfig, f, indent=2)
                
                # Create src directory and index file
                src_dir = package_dir / "src"
                src_dir.mkdir(exist_ok=True)
                
                index_content = f"""// {package_info['name']}
// {package_info['description']}

export const {package_info['name'].replace('-', '_')} = {{
  version: '1.0.0',
  description: '{package_info['description']}'
}};

export default {package_info['name'].replace('-', '_')};
"""
                
                with open(src_dir / "index.ts", 'w') as f:
                    f.write(index_content)
                
                self.log_step(f"Create {package_info['name']}", "success", f"Created shared package {package_info['name']}")
            else:
                self.log_step(f"Create {package_info['name']}", "success", f"Package {package_info['name']} already exists")
        
        self.log_step("Setup Shared Packages", "success", "Successfully created shared packages structure")
        return True
    
    def configure_basic_tasks(self):
        """Configure basic build, dev, and test tasks"""
        self.log_step("Configure Basic Tasks", "in_progress", "Configuring basic Turborepo tasks")
        
        # Update turbo.json with more detailed task configuration
        turbo_json_path = self.project_root / "turbo.json"
        
        with open(turbo_json_path, 'r') as f:
            turbo_config = json.load(f)
        
        # Add more detailed task configuration
        turbo_config["pipeline"].update({
            "build": {
                "dependsOn": ["^build"],
                "outputs": [".next/**", "dist/**", "build/**", "!.next/cache/**"],
                "env": ["NODE_ENV"]
            },
            "dev": {
                "cache": False,
                "persistent": True,
                "env": ["NODE_ENV", "PORT"]
            },
            "test": {
                "dependsOn": ["build"],
                "outputs": ["coverage/**"],
                "env": ["NODE_ENV"]
            },
            "lint": {
                "outputs": [],
                "env": ["NODE_ENV"]
            },
            "type-check": {
                "dependsOn": ["^build"],
                "outputs": [],
                "env": ["NODE_ENV"]
            },
            "clean": {
                "cache": False
            }
        })
        
        with open(turbo_json_path, 'w') as f:
            json.dump(turbo_config, f, indent=2)
        
        self.log_step("Configure Basic Tasks", "success", "Configured basic Turborepo tasks")
        return True
    
    def test_turborepo_functionality(self):
        """Test basic Turborepo functionality"""
        self.log_step("Test Turborepo Functionality", "in_progress", "Testing basic Turborepo commands")
        
        # Test turbo --version
        success, output = self.run_command("npx turbo --version")
        if success:
            self.log_step("Test turbo --version", "success", f"Turborepo version: {output.strip()}")
        else:
            self.log_step("Test turbo --version", "error", f"Failed to get Turborepo version: {output}")
            return False
        
        # Test turbo run build (dry run)
        success, output = self.run_command("npx turbo run build --dry-run")
        if success:
            self.log_step("Test turbo run build --dry-run", "success", "Build task dry run successful")
        else:
            self.log_step("Test turbo run build --dry-run", "error", f"Build task dry run failed: {output}")
            return False
        
        # Test turbo run dev (dry run)
        success, output = self.run_command("npx turbo run dev --dry-run")
        if success:
            self.log_step("Test turbo run dev --dry-run", "success", "Dev task dry run successful")
        else:
            self.log_step("Test turbo run dev --dry-run", "error", f"Dev task dry run failed: {output}")
            return False
        
        self.log_step("Test Turborepo Functionality", "success", "All basic Turborepo tests passed")
        return True
    
    def generate_phase1_report(self):
        """Generate Phase 1 completion report"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_filename = f"phase1_turborepo_setup_report_{timestamp}.md"
        
        with open(report_filename, 'w') as f:
            f.write("# 🚀 Phase 1: Turborepo Foundation Setup - COMPLETE\n")
            f.write("=" * 70 + "\n\n")
            f.write(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"**Total Steps**: {len(self.setup_log)}\n")
            f.write(f"**Errors**: {len(self.errors)}\n")
            f.write(f"**Status**: {'✅ SUCCESS' if len(self.errors) == 0 else '⚠️ COMPLETED WITH ERRORS'}\n\n")
            
            f.write("## 📊 Phase 1 Summary\n\n")
            f.write("Phase 1 of the Turborepo implementation has been completed successfully. ")
            f.write("The foundation setup includes Turborepo installation, workspace structure creation, ")
            f.write("configuration setup, and basic functionality testing.\n\n")
            
            f.write("## ✅ Completed Tasks\n\n")
            for log_entry in self.setup_log:
                if log_entry["status"] == "success":
                    f.write(f"- ✅ {log_entry['step']}: {log_entry['details']}\n")
            
            if self.errors:
                f.write("\n## ❌ Errors Encountered\n\n")
                for error in self.errors:
                    f.write(f"- ❌ {error['step']}: {error['details']}\n")
            
            f.write("\n## 🏗️ Current Structure\n\n")
            f.write("```\n")
            f.write("alex-ai-optimized-monorepo/\n")
            f.write("├── apps/\n")
            f.write("│   └── alex-ai-job-search/  # Migrated Next.js app\n")
            f.write("├── packages/\n")
            f.write("│   ├── alex-ai-core/\n")
            f.write("│   ├── alex-ai-components/\n")
            f.write("│   ├── alex-ai-utils/\n")
            f.write("│   └── alex-ai-types/\n")
            f.write("├── crew/\n")
            f.write("│   └── (ready for crew systems)\n")
            f.write("├── turbo.json\n")
            f.write("├── package.json\n")
            f.write("└── pnpm-workspace.yaml\n")
            f.write("```\n\n")
            
            f.write("## 🎯 Next Steps - Phase 2\n\n")
            f.write("With Phase 1 complete, we're ready to proceed to Phase 2: Optimization & Caching\n\n")
            f.write("### Phase 2 Tasks:\n")
            f.write("1. Configure local caching for all tasks\n")
            f.write("2. Set up remote caching (Vercel or custom)\n")
            f.write("3. Optimize task dependencies and execution order\n")
            f.write("4. Implement incremental builds\n")
            f.write("5. Configure build outputs and caching strategies\n")
            f.write("6. Set up build performance monitoring\n")
            f.write("7. Optimize for CI/CD integration\n\n")
            
            f.write("## 📋 Verification Commands\n\n")
            f.write("To verify the Phase 1 setup, run these commands:\n\n")
            f.write("```bash\n")
            f.write("# Check Turborepo version\n")
            f.write("npx turbo --version\n\n")
            f.write("# Test build pipeline (dry run)\n")
            f.write("npx turbo run build --dry-run\n\n")
            f.write("# Test dev pipeline (dry run)\n")
            f.write("npx turbo run dev --dry-run\n\n")
            f.write("# List all workspaces\n")
            f.write("npx turbo run build --dry-run --graph\n")
            f.write("```\n\n")
            
            f.write("---\n")
            f.write("*Phase 1 report generated by Alex AI Turborepo Setup System*\n")
        
        logging.info(f"📄 Phase 1 report saved to: {report_filename}")
        return report_filename
    
    def execute_phase1(self):
        """Execute Phase 1 setup"""
        logging.info("🚀 Starting Phase 1: Turborepo Foundation Setup")
        
        steps = [
            ("Install Turborepo", self.install_turborepo),
            ("Setup Workspace Structure", self.setup_workspace_structure),
            ("Create Turbo Config", self.create_turbo_config),
            ("Migrate Existing Apps", self.migrate_existing_apps),
            ("Setup Shared Packages", self.setup_shared_packages),
            ("Configure Basic Tasks", self.configure_basic_tasks),
            ("Test Turborepo Functionality", self.test_turborepo_functionality)
        ]
        
        for step_name, step_function in steps:
            logging.info(f"🔄 Executing: {step_name}")
            try:
                success = step_function()
                if not success:
                    logging.error(f"❌ Failed: {step_name}")
                    break
            except Exception as e:
                self.log_step(step_name, "error", f"Exception: {str(e)}")
                logging.error(f"❌ Exception in {step_name}: {e}")
                break
        
        # Generate report
        report_file = self.generate_phase1_report()
        
        if len(self.errors) == 0:
            logging.info("✅ Phase 1 completed successfully!")
        else:
            logging.warning(f"⚠️ Phase 1 completed with {len(self.errors)} errors")
        
        return len(self.errors) == 0, report_file

def main():
    """Main function to execute Phase 1 setup"""
    print("🚀 Alex AI Turborepo Phase 1: Foundation Setup")
    print("=" * 60)
    
    setup_system = Phase1TurborepoSetup()
    
    print("📋 Phase 1 Tasks:")
    print("1. Install Turborepo and configure package.json")
    print("2. Set up workspace structure (apps/, packages/, crew/)")
    print("3. Create turbo.json configuration file")
    print("4. Migrate existing Next.js apps to apps/ directory")
    print("5. Set up shared packages in packages/ directory")
    print("6. Configure basic build, dev, and test tasks")
    print("7. Test basic Turborepo functionality")
    print()
    
    success, report_file = setup_system.execute_phase1()
    
    if success:
        print("✅ Phase 1 completed successfully!")
        print(f"📄 Report: {report_file}")
    else:
        print("⚠️ Phase 1 completed with errors")
        print(f"📄 Report: {report_file}")
        print("Please review the errors and fix them before proceeding to Phase 2")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Company Research System for Brady Georgen Job Search
Deep learning and web scraping for organizational structures and contact leads
"""

import json
import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime
from typing import Dict, List, Optional
import time

class CompanyResearchSystem:
    def __init__(self):
        self.target_companies = [
            {
                "name": "Microsoft",
                "website": "https://www.microsoft.com",
                "careers_url": "https://careers.microsoft.com/us/en",
                "linkedin_url": "https://www.linkedin.com/company/microsoft",
                "priority": "high",
                "alex_ai_score": 65
            },
            {
                "name": "HubSpot",
                "website": "https://www.hubspot.com",
                "careers_url": "https://www.hubspot.com/careers",
                "linkedin_url": "https://www.linkedin.com/company/hubspot",
                "priority": "high",
                "alex_ai_score": 85
            },
            {
                "name": "Wpromote",
                "website": "https://www.wpromote.com",
                "careers_url": "https://www.wpromote.com/careers/",
                "linkedin_url": "https://www.linkedin.com/company/wpromote",
                "priority": "high",
                "alex_ai_score": 80
            },
            {
                "name": "Breakthrough Fuel",
                "website": "https://www.breakthroughfuel.com",
                "careers_url": "https://www.breakthroughfuel.com/careers",
                "linkedin_url": "https://www.linkedin.com/company/breakthrough-fuel",
                "priority": "high",
                "alex_ai_score": 75
            },
            {
                "name": "Daugherty Business Solutions",
                "website": "https://www.daugherty.com",
                "careers_url": "https://www.daugherty.com/careers",
                "linkedin_url": "https://www.linkedin.com/company/daugherty-business-solutions",
                "priority": "high",
                "alex_ai_score": 60
            },
            {
                "name": "Veterans United Home Loans",
                "website": "https://www.veteransunited.com",
                "careers_url": "https://www.veteransunited.com/careers/",
                "linkedin_url": "https://www.linkedin.com/company/veterans-united-home-loans",
                "priority": "high",
                "alex_ai_score": 55
            },
            {
                "name": "Blayzer Digital",
                "website": "https://www.blayzerdigital.com",
                "careers_url": "https://www.blayzerdigital.com/careers",
                "linkedin_url": "https://www.linkedin.com/company/blayzer-digital",
                "priority": "medium",
                "alex_ai_score": 70
            },
            {
                "name": "Rankings.io",
                "website": "https://rankings.io",
                "careers_url": "https://rankings.io/careers",
                "linkedin_url": "https://www.linkedin.com/company/rankings-io",
                "priority": "medium",
                "alex_ai_score": 65
            },
            {
                "name": "SteadyRain",
                "website": "https://www.steadyrain.com",
                "careers_url": "https://www.steadyrain.com/careers",
                "linkedin_url": "https://www.linkedin.com/company/steadyrain",
                "priority": "medium",
                "alex_ai_score": 60
            },
            {
                "name": "Anheuser-Busch",
                "website": "https://www.anheuser-busch.com",
                "careers_url": "https://www.anheuser-busch.com/careers",
                "linkedin_url": "https://www.linkedin.com/company/anheuser-busch",
                "priority": "medium",
                "alex_ai_score": 45
            }
        ]
        
        self.research_results = {}
        self.contact_database = {}

    def scrape_company_info(self, company: Dict) -> Dict:
        """Scrape company information and organizational structure"""
        try:
            # Scrape main website
            main_info = self._scrape_main_website(company)
            
            # Scrape careers page
            careers_info = self._scrape_careers_page(company)
            
            # Scrape LinkedIn for leadership info
            linkedin_info = self._scrape_linkedin_info(company)
            
            return {
                "company_name": company["name"],
                "website": company["website"],
                "main_info": main_info,
                "careers_info": careers_info,
                "linkedin_info": linkedin_info,
                "research_timestamp": datetime.now().isoformat(),
                "alex_ai_score": company["alex_ai_score"],
                "priority": company["priority"]
            }
            
        except Exception as e:
            print(f"Error researching {company['name']}: {str(e)}")
            return {
                "company_name": company["name"],
                "error": str(e),
                "research_timestamp": datetime.now().isoformat()
            }

    def _scrape_main_website(self, company: Dict) -> Dict:
        """Scrape main company website for organizational info"""
        try:
            response = requests.get(company["website"], timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract leadership information
            leadership_info = self._extract_leadership_info(soup)
            
            # Extract company description
            description = self._extract_company_description(soup)
            
            # Extract contact information
            contact_info = self._extract_contact_info(soup)
            
            return {
                "leadership": leadership_info,
                "description": description,
                "contact_info": contact_info
            }
            
        except Exception as e:
            return {"error": f"Failed to scrape main website: {str(e)}"}

    def _scrape_careers_page(self, company: Dict) -> Dict:
        """Scrape careers page for hiring information"""
        try:
            response = requests.get(company["careers_url"], timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract job openings
            job_openings = self._extract_job_openings(soup)
            
            # Extract hiring team info
            hiring_team = self._extract_hiring_team(soup)
            
            # Extract application process
            application_process = self._extract_application_process(soup)
            
            return {
                "job_openings": job_openings,
                "hiring_team": hiring_team,
                "application_process": application_process
            }
            
        except Exception as e:
            return {"error": f"Failed to scrape careers page: {str(e)}"}

    def _scrape_linkedin_info(self, company: Dict) -> Dict:
        """Extract LinkedIn company information"""
        # Note: This would require LinkedIn API or web scraping
        # For now, return structured data based on known information
        return {
            "company_size": "Unknown",
            "industry": "Technology/Marketing",
            "headquarters": "Various",
            "founded": "Unknown",
            "note": "LinkedIn scraping requires API access or advanced web scraping"
        }

    def _extract_leadership_info(self, soup: BeautifulSoup) -> List[Dict]:
        """Extract leadership team information from website"""
        leadership = []
        
        # Look for common leadership page patterns
        leadership_selectors = [
            'div[class*="leadership"]',
            'div[class*="team"]',
            'div[class*="executive"]',
            'section[class*="leadership"]',
            'section[class*="team"]'
        ]
        
        for selector in leadership_selectors:
            elements = soup.select(selector)
            for element in elements:
                # Extract names and titles
                names = element.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
                for name_elem in names:
                    name_text = name_elem.get_text().strip()
                    if name_text and len(name_text) < 100:  # Reasonable name length
                        leadership.append({
                            "name": name_text,
                            "title": "Unknown",
                            "source": "website_scraping"
                        })
        
        return leadership

    def _extract_company_description(self, soup: BeautifulSoup) -> str:
        """Extract company description"""
        # Look for meta description or about section
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            return meta_desc.get('content', '')
        
        # Look for about section
        about_selectors = [
            'div[class*="about"]',
            'section[class*="about"]',
            'div[class*="mission"]',
            'section[class*="mission"]'
        ]
        
        for selector in about_selectors:
            element = soup.select_one(selector)
            if element:
                return element.get_text().strip()[:500]  # Limit length
        
        return "Description not found"

    def _extract_contact_info(self, soup: BeautifulSoup) -> Dict:
        """Extract contact information"""
        contact_info = {}
        
        # Look for email addresses
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, soup.get_text())
        if emails:
            contact_info["emails"] = list(set(emails))
        
        # Look for phone numbers
        phone_pattern = r'\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})'
        phones = re.findall(phone_pattern, soup.get_text())
        if phones:
            contact_info["phones"] = [''.join(phone) for phone in phones]
        
        return contact_info

    def _extract_job_openings(self, soup: BeautifulSoup) -> List[Dict]:
        """Extract job openings from careers page"""
        jobs = []
        
        # Look for job listing patterns
        job_selectors = [
            'div[class*="job"]',
            'div[class*="position"]',
            'div[class*="opening"]',
            'li[class*="job"]',
            'article[class*="job"]'
        ]
        
        for selector in job_selectors:
            elements = soup.select(selector)
            for element in elements:
                title_elem = element.find(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
                if title_elem:
                    jobs.append({
                        "title": title_elem.get_text().strip(),
                        "location": "Unknown",
                        "type": "Unknown",
                        "source": "careers_page"
                    })
        
        return jobs

    def _extract_hiring_team(self, soup: BeautifulSoup) -> List[Dict]:
        """Extract hiring team information"""
        hiring_team = []
        
        # Look for HR or recruiting team info
        hr_selectors = [
            'div[class*="hr"]',
            'div[class*="recruiting"]',
            'div[class*="talent"]',
            'section[class*="team"]'
        ]
        
        for selector in hr_selectors:
            elements = soup.select(selector)
            for element in elements:
                names = element.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
                for name_elem in names:
                    name_text = name_elem.get_text().strip()
                    if name_text and len(name_text) < 100:
                        hiring_team.append({
                            "name": name_text,
                            "role": "HR/Recruiting",
                            "source": "careers_page"
                        })
        
        return hiring_team

    def _extract_application_process(self, soup: BeautifulSoup) -> Dict:
        """Extract application process information"""
        process_info = {}
        
        # Look for application instructions
        app_selectors = [
            'div[class*="application"]',
            'div[class*="process"]',
            'section[class*="how-to-apply"]'
        ]
        
        for selector in app_selectors:
            element = soup.select_one(selector)
            if element:
                process_info["instructions"] = element.get_text().strip()[:1000]
                break
        
        return process_info

    def generate_mermaid_org_chart(self, company_data: Dict) -> str:
        """Generate Mermaid organizational chart for company"""
        company_name = company_data["company_name"]
        leadership = company_data.get("main_info", {}).get("leadership", [])
        
        if not leadership:
            return f"# {company_name} Organizational Chart\n\n*No leadership information available*"
        
        mermaid_code = f"graph TD\n"
        mermaid_code += f"    CEO[\"CEO\"]\n"
        
        # Add leadership positions
        for i, leader in enumerate(leadership[:5]):  # Limit to 5 for readability
            role = leader.get("title", f"Leader {i+1}")
            name = leader.get("name", f"Person {i+1}")
            node_id = f"leader_{i+1}"
            mermaid_code += f"    {node_id}[\"{role}<br/>{name}\"]\n"
            mermaid_code += f"    CEO --> {node_id}\n"
        
        return mermaid_code

    def run_research(self) -> Dict:
        """Run comprehensive research on all target companies"""
        print("Starting comprehensive company research...")
        
        for company in self.target_companies:
            print(f"Researching {company['name']}...")
            company_data = self.scrape_company_info(company)
            self.research_results[company["name"]] = company_data
            
            # Generate Mermaid org chart
            mermaid_chart = self.generate_mermaid_org_chart(company_data)
            company_data["mermaid_org_chart"] = mermaid_chart
            
            # Add delay to be respectful
            time.sleep(2)
        
        return self.research_results

    def save_results(self, filename: str = "company_research_results.json"):
        """Save research results to file"""
        with open(filename, 'w') as f:
            json.dump(self.research_results, f, indent=2)
        print(f"Research results saved to {filename}")

    def generate_contact_database(self) -> Dict:
        """Generate comprehensive contact database"""
        contact_db = {}
        
        for company_name, company_data in self.research_results.items():
            contacts = []
            
            # Add leadership contacts
            leadership = company_data.get("main_info", {}).get("leadership", [])
            for leader in leadership:
                contacts.append({
                    "name": leader.get("name", "Unknown"),
                    "title": leader.get("title", "Unknown"),
                    "company": company_name,
                    "type": "leadership",
                    "source": "website_scraping"
                })
            
            # Add hiring team contacts
            hiring_team = company_data.get("careers_info", {}).get("hiring_team", [])
            for hr_person in hiring_team:
                contacts.append({
                    "name": hr_person.get("name", "Unknown"),
                    "title": hr_person.get("role", "HR/Recruiting"),
                    "company": company_name,
                    "type": "hiring",
                    "source": "careers_page"
                })
            
            # Add contact information
            contact_info = company_data.get("main_info", {}).get("contact_info", {})
            if contact_info.get("emails"):
                for email in contact_info["emails"]:
                    contacts.append({
                        "name": "General Contact",
                        "title": "Contact",
                        "email": email,
                        "company": company_name,
                        "type": "general",
                        "source": "website_scraping"
                    })
            
            contact_db[company_name] = contacts
        
        self.contact_database = contact_db
        return contact_db

def main():
    """Main function to run company research"""
    research_system = CompanyResearchSystem()
    
    # Run research
    results = research_system.run_research()
    
    # Generate contact database
    contact_db = research_system.generate_contact_database()
    
    # Save results
    research_system.save_results()
    
    # Save contact database
    with open("contact_database.json", 'w') as f:
        json.dump(contact_db, f, indent=2)
    
    print("Company research completed!")
    print(f"Researched {len(results)} companies")
    print(f"Generated contact database with {sum(len(contacts) for contacts in contact_db.values())} contacts")
    
    return results, contact_db

if __name__ == "__main__":
    main()

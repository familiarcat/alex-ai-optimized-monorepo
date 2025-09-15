#!/usr/bin/env python3
"""
Crew Member Validation System
============================
Ensures only official crew members are used and prevents hallucination of new crew members
"""

import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime

class CrewMemberValidationSystem:
    def __init__(self):
        self.official_crew_members = {
            'captain_picard': {
                'name': 'Captain Jean-Luc Picard',
                'department': 'Command',
                'workflow_id': 'BdNHOluRYUw2JxGW',
                'webhook_path': 'crew-captain-jean-luc-picard',
                'specialization': 'Strategic Leadership & Mission Command',
                'aliases': ['picard', 'captain', 'jean-luc']
            },
            'commander_riker': {
                'name': 'Commander William Riker',
                'department': 'Tactical',
                'workflow_id': 'Imn7p6pVgi6SRvnF',
                'webhook_path': 'crew-commander-william-riker',
                'specialization': 'Tactical Execution & Workflow Management',
                'aliases': ['riker', 'commander', 'william']
            },
            'commander_data': {
                'name': 'Commander Data',
                'department': 'Operations',
                'workflow_id': 'gIwrQHHArgrVARjL',
                'webhook_path': 'crew-commander-data',
                'specialization': 'Analytics & Logic Operations',
                'aliases': ['data', 'commander_data']
            },
            'geordi_la_forge': {
                'name': 'Lieutenant Commander Geordi La Forge',
                'department': 'Engineering',
                'workflow_id': 'e0UEwyVcXJqeePdj',
                'webhook_path': 'crew-lieutenant-commander-geordi-la-forge',
                'specialization': 'Infrastructure & System Integration',
                'aliases': ['geordi', 'la_forge', 'engineer']
            },
            'lieutenant_worf': {
                'name': 'Lieutenant Worf',
                'department': 'Security',
                'workflow_id': 'GhSB8EpZWXLU78LM',
                'webhook_path': 'crew-lieutenant-worf',
                'specialization': 'Security & Compliance Operations',
                'aliases': ['worf', 'lieutenant', 'security']
            },
            'counselor_troi': {
                'name': 'Counselor Deanna Troi',
                'department': 'Counseling',
                'workflow_id': 'QJnN7ks2KsQTENDc',
                'webhook_path': 'crew-counselor-deanna-troi',
                'specialization': 'User Experience & Empathy Analysis',
                'aliases': ['troi', 'counselor', 'deanna']
            },
            'lieutenant_uhura': {
                'name': 'Lieutenant Uhura',
                'department': 'Communications',
                'workflow_id': '36KPle5mPiMaazG6',
                'webhook_path': 'crew-lieutenant-uhura',
                'specialization': 'Communications & I/O Operations',
                'aliases': ['uhura', 'communications', 'lieutenant']
            },
            'dr_crusher': {
                'name': 'Dr. Beverly Crusher',
                'department': 'Medical',
                'workflow_id': 'SXAMupVWdOxZybF6',
                'webhook_path': 'crew-dr-beverly-crusher',
                'specialization': 'Health & Diagnostics Operations',
                'aliases': ['crusher', 'dr', 'beverly', 'medical']
            },
            'quark': {
                'name': 'Quark',
                'department': 'Business',
                'workflow_id': 'L6K4bzSKlGC36ABL',
                'webhook_path': 'crew-quark',
                'specialization': 'Business Intelligence & Budget Optimization',
                'aliases': ['quark', 'business', 'ferengi']
            }
        }
        
        self.validation_log = []
        self.hallucination_attempts = []
    
    def validate_crew_member(self, crew_identifier: str) -> Dict[str, Any]:
        """
        Validate if a crew member identifier is official
        
        Args:
            crew_identifier: The crew member identifier to validate
            
        Returns:
            Dict with validation result and crew member info
        """
        # Normalize the identifier
        normalized_id = crew_identifier.lower().replace(' ', '_').replace('-', '_')
        
        # Check direct match
        if normalized_id in self.official_crew_members:
            return {
                'valid': True,
                'crew_member': self.official_crew_members[normalized_id],
                'identifier': normalized_id,
                'message': f"Valid crew member: {self.official_crew_members[normalized_id]['name']}"
            }
        
        # Check aliases
        for crew_id, crew_info in self.official_crew_members.items():
            if normalized_id in crew_info['aliases']:
                return {
                    'valid': True,
                    'crew_member': crew_info,
                    'identifier': crew_id,
                    'message': f"Valid crew member (alias): {crew_info['name']}"
                }
        
        # Check partial matches
        for crew_id, crew_info in self.official_crew_members.items():
            if normalized_id in crew_id or any(alias in normalized_id for alias in crew_info['aliases']):
                return {
                    'valid': True,
                    'crew_member': crew_info,
                    'identifier': crew_id,
                    'message': f"Valid crew member (partial match): {crew_info['name']}"
                }
        
        # Invalid crew member - potential hallucination
        self.log_hallucination_attempt(crew_identifier)
        return {
            'valid': False,
            'crew_member': None,
            'identifier': None,
            'message': f"INVALID CREW MEMBER: '{crew_identifier}' is not an official crew member",
            'error': 'HALLUCINATION_ATTEMPT',
            'suggestions': self.get_similar_crew_members(crew_identifier)
        }
    
    def get_similar_crew_members(self, invalid_identifier: str) -> List[str]:
        """Get similar crew member names for suggestions"""
        suggestions = []
        invalid_lower = invalid_identifier.lower()
        
        for crew_id, crew_info in self.official_crew_members.items():
            # Check if any part of the invalid identifier matches crew info
            if (invalid_lower in crew_info['name'].lower() or 
                any(alias in invalid_lower for alias in crew_info['aliases']) or
                any(word in crew_info['name'].lower() for word in invalid_lower.split())):
                suggestions.append(crew_info['name'])
        
        return suggestions[:3]  # Return top 3 suggestions
    
    def log_hallucination_attempt(self, crew_identifier: str):
        """Log hallucination attempts for monitoring"""
        attempt = {
            'timestamp': datetime.now().isoformat(),
            'invalid_identifier': crew_identifier,
            'suggestions': self.get_similar_crew_members(crew_identifier)
        }
        self.hallucination_attempts.append(attempt)
        
        # Log to file
        with open('crew_hallucination_log.json', 'a') as f:
            f.write(json.dumps(attempt) + '\n')
    
    def get_all_crew_members(self) -> List[Dict[str, Any]]:
        """Get list of all official crew members"""
        return list(self.official_crew_members.values())
    
    def get_crew_member_by_department(self, department: str) -> List[Dict[str, Any]]:
        """Get crew members by department"""
        return [
            crew for crew in self.official_crew_members.values() 
            if crew['department'].lower() == department.lower()
        ]
    
    def get_crew_member_by_specialization(self, specialization_keyword: str) -> List[Dict[str, Any]]:
        """Get crew members by specialization keyword"""
        keyword_lower = specialization_keyword.lower()
        return [
            crew for crew in self.official_crew_members.values()
            if keyword_lower in crew['specialization'].lower()
        ]
    
    def validate_crew_operation(self, operation: str, crew_identifier: str) -> Dict[str, Any]:
        """Validate a crew operation before execution"""
        validation_result = self.validate_crew_member(crew_identifier)
        
        if not validation_result['valid']:
            return {
                'operation_allowed': False,
                'reason': 'INVALID_CREW_MEMBER',
                'message': f"Cannot perform '{operation}' with invalid crew member: {crew_identifier}",
                'validation_result': validation_result
            }
        
        return {
            'operation_allowed': True,
            'crew_member': validation_result['crew_member'],
            'message': f"Operation '{operation}' approved for {validation_result['crew_member']['name']}",
            'validation_result': validation_result
        }
    
    def generate_crew_validation_report(self) -> Dict[str, Any]:
        """Generate comprehensive validation report"""
        return {
            'timestamp': datetime.now().isoformat(),
            'total_crew_members': len(self.official_crew_members),
            'official_crew_list': list(self.official_crew_members.keys()),
            'hallucination_attempts': len(self.hallucination_attempts),
            'recent_hallucination_attempts': self.hallucination_attempts[-5:],  # Last 5 attempts
            'validation_rules': {
                'only_official_crew': True,
                'no_hallucination_allowed': True,
                'aliases_supported': True,
                'partial_matching_enabled': True
            },
            'departments': list(set(crew['department'] for crew in self.official_crew_members.values())),
            'specializations': [crew['specialization'] for crew in self.official_crew_members.values()]
        }
    
    def save_validation_report(self):
        """Save validation report to file"""
        report = self.generate_crew_validation_report()
        
        with open('crew_validation_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        return report

def main():
    """Main function to test crew member validation"""
    print("🔍 Crew Member Validation System")
    print("=" * 50)
    
    validator = CrewMemberValidationSystem()
    
    # Test valid crew members
    print("\n✅ Testing Valid Crew Members:")
    test_crew_members = [
        'captain_picard',
        'picard',
        'commander_data',
        'data',
        'geordi_la_forge',
        'geordi',
        'lieutenant_worf',
        'worf',
        'counselor_troi',
        'troi',
        'lieutenant_uhura',
        'uhura',
        'dr_crusher',
        'crusher',
        'quark'
    ]
    
    for crew_id in test_crew_members:
        result = validator.validate_crew_member(crew_id)
        status = "✅" if result['valid'] else "❌"
        print(f"  {status} {crew_id}: {result['message']}")
    
    # Test invalid crew members (hallucination attempts)
    print("\n❌ Testing Invalid Crew Members (Hallucination Detection):")
    invalid_crew_members = [
        'captain_kirk',
        'spock',
        'scotty',
        'sulu',
        'chekov',
        'new_crew_member',
        'temporary_crew',
        'fictional_character'
    ]
    
    for crew_id in invalid_crew_members:
        result = validator.validate_crew_member(crew_id)
        status = "✅" if result['valid'] else "❌"
        print(f"  {status} {crew_id}: {result['message']}")
        if not result['valid'] and result.get('suggestions'):
            print(f"    Suggestions: {', '.join(result['suggestions'])}")
    
    # Generate and save report
    print("\n📊 Generating Validation Report...")
    report = validator.save_validation_report()
    
    print(f"\n📋 Validation Report Summary:")
    print(f"  Total Official Crew Members: {report['total_crew_members']}")
    print(f"  Hallucination Attempts Detected: {report['hallucination_attempts']}")
    print(f"  Departments: {', '.join(report['departments'])}")
    
    print("\n📁 Files Created:")
    print("  - crew_validation_report.json")
    print("  - crew_hallucination_log.json")
    
    print("\n✅ Crew Member Validation System Ready!")
    print("🚫 Hallucination detection active - only official crew members allowed!")

if __name__ == "__main__":
    main()


















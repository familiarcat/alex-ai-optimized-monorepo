from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Alex AI Webhook Server
Local webhook server to handle Alex AI job search requests
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from alex_ai_job_search_system import AlexAIJobSearchSystem

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Initialize Alex AI system
alex_ai_system = AlexAIJobSearchSystem()

@app.route('/webhook/resume-analysis', methods=['POST'])
def resume_analysis():
    """Handle resume analysis requests"""
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        resume_file = request.files['resume']
        analysis_type = request.form.get('analysis_type', 'comprehensive')
        
        # Mock analysis data based on the fallback in the frontend
        analysis_result = {
            'keySkills': [
                'React', 'Node.js', 'TypeScript', 'AWS', 'Alex AI', 'n8n', 'Cursor AI',
                'Full-Stack Development', 'Technical Leadership', 'Client Management',
                'Marketing Automation', 'Sustainability Technology', 'Environmental Impact'
            ],
            'experienceLevel': '15+ years full-stack development',
            'alexAIExpertise': '45% efficiency improvement, 30% cycle time reduction, 25% waste reduction',
            'bestMatches': [
                {'company': 'Microsoft', 'position': 'Software Engineer AI/ML', 'score': 95},
                {'company': 'Daugherty Business Solutions', 'position': 'Senior Consultant III', 'score': 92},
                {'company': 'HubSpot', 'position': 'Marketing Automation Specialist', 'score': 90},
                {'company': 'Breakthrough Fuel', 'position': 'Solutions Architect', 'score': 88},
                {'company': 'Zapier', 'position': 'Software Engineer', 'score': 88}
            ],
            'analysisData': {
                'st_louis_focus': 'Strong local presence with 8 opportunities in St. Louis area',
                'remote_preference': '15 remote opportunities in Central Time Zone',
                'work_life_balance': 'All opportunities prioritize work-life balance',
                'alex_ai_leverage': 'High leverage in AI/ML, automation, and client-facing roles'
            }
        }
        
        return jsonify(analysis_result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/webhook/job-matching', methods=['POST'])
def job_matching():
    """Handle job matching requests"""
    try:
        data = request.get_json()
        resume_analysis = data.get('resume_analysis', {})
        match_criteria = data.get('match_criteria', {})
        
        # Load job opportunities from the Alex AI system
        job_opportunities = alex_ai_system.job_opportunities
        
        # Filter jobs based on criteria
        min_score = match_criteria.get('min_score', 75)
        location_pref = match_criteria.get('location_preference', 'hybrid')
        work_life_balance = match_criteria.get('work_life_balance', 'high')
        
        matched_jobs = []
        for job in job_opportunities:
            score = job.get('alex_ai_score', 0)
            
            # Apply location filter
            location_match = True
            if location_pref == 'remote':
                location_match = job.get('remote_work', False)
            elif location_pref == 'hybrid':
                location_match = job.get('remote_work', False) or job.get('st_louis_area', False) or job.get('st_louis_focus', False)
            elif location_pref == 'st_louis':
                location_match = job.get('st_louis_area', False) or job.get('st_louis_focus', False)
            
            # Apply score filter
            if score >= min_score and location_match:
                matched_jobs.append(job)
        
        # Sort by Alex AI score
        matched_jobs.sort(key=lambda x: x.get('alex_ai_score', 0), reverse=True)
        
        result = {
            'job_matches': matched_jobs,
            'total_matches': len(matched_jobs),
            'match_criteria': match_criteria,
            'resume_analysis': resume_analysis,
            'recommendations': [
                'Prioritize applications to Microsoft (AI/ML Engineer) - highest Alex AI leverage',
                'Leverage existing Daugherty relationship for faster application process',
                'Focus on St. Louis area opportunities for local networking and work-life balance',
                'Emphasize Alex AI results (45% efficiency, 30% cycle time reduction) in applications',
                'Target remote opportunities in Central Time Zone for maximum flexibility'
            ]
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/webhook/cover-letter-generation', methods=['POST'])
def cover_letter_generation():
    """Handle cover letter generation requests"""
    try:
        data = request.get_json()
        job_opportunity = data.get('job_opportunity', {})
        resume_analysis = data.get('resume_analysis', {})
        custom_instructions = data.get('custom_instructions', '')
        
        # Mock cover letter generation
        cover_letter = f"""Dear Hiring Team at {job_opportunity.get('company', 'Company')},

I am writing to express my strong interest in the {job_opportunity.get('position', 'position')} position at {job_opportunity.get('company', 'Company')}. With 15+ years of full-stack development experience and expertise in Alex AI automation systems, I believe I would be a valuable addition to your team.

My background includes:
• Alex AI system development with proven results (45% efficiency improvement, 30% cycle time reduction)
• Technical leadership and team management experience
• {job_opportunity.get('requirements', 'Technical')} expertise
• Sustainability focus and environmental impact tracking

I would welcome the opportunity to discuss how my experience and expertise can contribute to {job_opportunity.get('company', 'Company')}'s continued success.

Best regards,
P. Brady Georgen
(314) 580-0608
brady@pbradygeorgen.com"""
        
        result = {
            'coverLetter': cover_letter,
            'personalizedPoints': [
                f'Direct alignment with {job_opportunity.get("company", "Company")} mission',
                'Proven track record in similar roles',
                'Alex AI expertise for automation and efficiency',
                'Strong work-life balance focus'
            ],
            'alexAILeverage': [
                '45% efficiency improvement through Alex AI implementation',
                '30% cycle time reduction in previous roles',
                '25% waste reduction through process optimization',
                'Zero production downtime achievement'
            ]
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/webhook/resume-tailoring', methods=['POST'])
def resume_tailoring():
    """Handle resume tailoring requests"""
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        resume_file = request.files['resume']
        job_opportunity = json.loads(request.form.get('job_opportunity', '{}'))
        resume_analysis = json.loads(request.form.get('resume_analysis', '{}'))
        
        # Mock resume tailoring
        result = {
            'tailoredResume': f"Experienced Full-Stack Developer with 15+ years of experience in {job_opportunity.get('requirements', 'full-stack development')} and expertise in Alex AI automation systems. Proven track record of delivering {job_opportunity.get('description', 'enterprise solutions')} with measurable business results.",
            'keyChanges': [
                f"Emphasized {job_opportunity.get('requirements', 'technical')} expertise",
                'Highlighted Alex AI system development experience',
                'Added sustainability focus alignment',
                'Included specific metrics and achievements'
            ],
            'alexAIEnhancements': [
                'Alex AI system expertise with 45% efficiency improvement',
                'Technical leadership in enterprise-scale solutions',
                'Client implementation experience with measurable results',
                'Sustainability focus aligning with company mission'
            ]
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/webhook/job-tracking', methods=['POST'])
def job_tracking():
    """Handle job tracking requests"""
    try:
        data = request.get_json()
        application_id = data.get('application_id', '')
        event_type = data.get('event_type', '')
        event_data = data.get('event_data', {})
        
        # Mock job tracking
        result = {
            'success': True,
            'trackingId': f'track_{application_id}_{int(datetime.now().timestamp())}',
            'nextActions': [
                'Follow up in 1 week if no response',
                'Prepare for technical interview',
                'Research company culture and values',
                'Update LinkedIn profile with relevant keywords'
            ]
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Alex AI Webhook Server'
    })

if __name__ == '__main__':
    print("🚀 Starting Alex AI Webhook Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("🔗 Webhook endpoints:")
    print("   - POST /webhook/resume-analysis")
    print("   - POST /webhook/job-matching")
    print("   - POST /webhook/cover-letter-generation")
    print("   - POST /webhook/resume-tailoring")
    print("   - POST /webhook/job-tracking")
    print("   - GET /health")
    app.run(host='0.0.0.0', port=8000, debug=True)

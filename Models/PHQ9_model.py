class SimplePHQ9:
    def __init__(self):
        self.questions = [
            "Little interest or pleasure in doing things",
            "Feeling down, depressed, or hopeless",
            "Trouble falling/staying asleep, or sleeping too much",
            "Feeling tired or having little energy",
            "Poor appetite or overeating",
            "Feeling bad about yourself or that you're a failure",
            "Trouble concentrating on things",
            "Moving/speaking very slowly or being fidgety/restless",
            "Thoughts of self-harm or being better off dead"
        ]
        
        self.scores = {
            0: "Not at all",
            1: "Several days",
            2: "More than half the days",
            3: "Nearly every day"
        }
        
    def run_assessment(self):
        print("\nPHQ-9 ASSESSMENT")
        print("Rate how often you've experienced these over the last 2 weeks:")
        print("0: Not at all  1: Several days  2: More than half days  3: Nearly every day")
        
        responses = []
        for i, question in enumerate(self.questions, 1):
            while True:
                try:
                    score = int(input(f"\n{i}. {question}\nScore (0-3): "))
                    if 0 <= score <= 3:
                        responses.append(score)
                        break
                    print("Please enter 0, 1, 2, or 3")
                except ValueError:
                    print("Please enter a number")
        
        return self.get_results(responses)
    
    def get_results(self, responses):
        total = sum(responses)
        
        # Determine severity
        if total <= 4:
            severity = "Minimal"
        elif total <= 9:
            severity = "Mild"
        elif total <= 14:
            severity = "Moderate"
        elif total <= 19:
            severity = "Moderately severe"
        else:
            severity = "Severe"

        # Check for potential depression
        has_core_symptoms = responses[0] >= 2 or responses[1] >= 2  # First two questions
        symptom_count = sum(1 for score in responses if score >= 2)
        
        report = f"""
PHQ-9 Results
============
Total Score: {total}
Severity: {severity} depression

Detailed Responses:
"""
        for i, (q, r) in enumerate(zip(self.questions, responses), 1):
            report += f"{i}. {q}: {self.scores[r]}\n"
        
        if has_core_symptoms and symptom_count >= 5:
            report += "\nNote: Symptoms suggest possible major depression."
        elif has_core_symptoms and symptom_count >= 2:
            report += "\nNote: Symptoms suggest possible other depression."
            
        report += "\nPlease consult a healthcare professional for proper diagnosis."
        
        return report

def main():
    assessment = SimplePHQ9()
    print(assessment.run_assessment())

if __name__ == "__main__":
    main()
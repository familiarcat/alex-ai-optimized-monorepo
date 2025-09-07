
class StressTestClass:
    def __init__(self):
        self.name = "Stress Test"
        self.created = datetime.now()
    
    def test_method(self):
        return f"Test method called at {self.created}"

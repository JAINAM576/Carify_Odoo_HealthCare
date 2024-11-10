import React, { useState } from 'react';
import Patientnav from "../App/Components/patientnav";

const PHQ9Assessment = () => {
    
    const questions = [
        "Little interest or pleasure in doing things",
        "Feeling down, depressed, or hopeless",
        "Trouble falling or staying asleep, or sleeping too much",
        "Feeling tired or having little energy",
        "Poor appetite or overeating",
        "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
        "Trouble concentrating on things, such as reading the newspaper or watching television",
        "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
        "Thoughts that you would be better off dead, or of hurting yourself"
    ];

    const frequencyOptions = {
        0: "Not at all",
        1: "Several days",
        2: "More than half the days",
        3: "Nearly every day"
    };

    const difficultyLevels = [
        "Not difficult at all",
        "Somewhat difficult",
        "Very difficult",
        "Extremely difficult"
    ];

    const severityLevels = {
        0: "Minimal depression",
        5: "Mild depression",
        10: "Moderate depression",
        15: "Moderately severe depression",
        20: "Severe depression"
    };

    const [responses, setResponses] = useState(Array(questions.length).fill(0));
    const [difficultyResponse, setDifficultyResponse] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const handleResponseChange = (index, value) => {
        const newResponses = [...responses];
        newResponses[index] = value;
        setResponses(newResponses);
    };

    const handleDifficultyChange = (value) => {
        setDifficultyResponse(value);
    };

    const calculateSeverity = (totalScore) => {
        if (totalScore >= 0 && totalScore < 5) {
            return "Minimal depression";
        } else if (totalScore >= 5 && totalScore < 10) {
            return "Mild depression";
        } else if (totalScore >= 10 && totalScore < 15) {
            return "Moderate depression";
        } else if (totalScore >= 15 && totalScore < 20) {
            return "Moderately severe depression";
        } else {
            return "Severe depression";
        }
    };

    const calculateScore = () => {
        const totalScore = responses.reduce((acc, val) => acc + val, 0);
        const severity = calculateSeverity(totalScore);
        return {
            totalScore,
            severity,
            difficultyLevel: difficultyLevels[difficultyResponse],
            responses,
            potentialMajorDepression: totalScore >= 15,
            potentialOtherDepression: totalScore >= 10 && totalScore < 15
        };
    };

    const generateRecommendations = (severity) => {
        switch (severity) {
            case "Minimal depression":
                return [
                    "Practice daily gratitude to lift your mood.",
                    "Try to engage in a favorite hobby or activity.",
                    "Stay active and exercise regularly to boost your energy."
                ];
            case "Mild depression":
                return [
                    "Take small steps to set and achieve daily goals.",
                    "Consider mindfulness meditation for stress reduction.",
                    "Connect with friends and family for social support."
                ];
            case "Moderate depression":
                return [
                    "Consider speaking with a therapist for personalized support.",
                    "Establish a consistent sleep routine to improve your mood.",
                    "Limit alcohol and caffeine, as they can impact mood."
                ];
            case "Moderately severe depression":
                return [
                    "Seek help from a mental health professional.",
                    "Join a support group to connect with others facing similar challenges.",
                    "Explore creative outlets like journaling or art for expression."
                ];
            case "Severe depression":
                return [
                    "Consult a licensed therapist or mental health professional.",
                    "Seek immediate support if experiencing harmful thoughts.",
                    "Consider speaking with a doctor about medical support options."
                ];
            default:
                return [];
        }
    };

    const generateExerciseVideos = (severity) => {
        switch (severity) {
            case "Minimal depression":
                return [
                    { title: "5-Minute Mindful Breathing", link: "https://www.youtube.com/embed/inpok4MKVLM" },
                    { title: "Gentle Yoga for Relaxation", link: "https://www.youtube.com/embed/4C-gxOE0j7s" },
                ];
            case "Mild depression":
                return [
                    { title: "10-Minute Mindfulness Meditation", link: "https://www.youtube.com/embed/U9YKY7fdwyg" },
                    { title: "Basic Yoga for Beginners", link: "https://www.youtube.com/embed/v7AYKMP6rOE" },
                    { title: "Morning Stretch Routine", link: "https://youtu.be/g_tea8ZNk5A?si=hnIqE78CbeMYlU9N" }
                ];
            case "Moderate depression":
                return [
                    { title: "15-Minute Relaxation Meditation", link: "https://www.youtube.com/embed/ZToicYcHIOU" },
                    { title: "Yoga for Stress Relief", link: "https://www.youtube.com/embed/4C-gxOE0j7s" },
                    { title: "Active Stretching Routine", link: "https://youtu.be/g_tea8ZNk5A?si=hnIqE78CbeMYlU9N" }
                ];
            case "Moderately severe depression":
                return [
                    { title: "20-Minute Mindfulness Meditation", link: "https://www.youtube.com/embed/z6X5oEIg6Ak" },
                    { title: "Yoga for Anxiety", link: "https://www.youtube.com/embed/4pLUleLdwY4" },
                    { title: "Energizing Morning Routine", link: "https://www.youtube.com/embed/8DZktowZo_k" }
                ];
            case "Severe depression":
                return [
                    { title: "Guided Meditation for Deep Relaxation", link: "https://www.youtube.com/embed/Jyy0ra2WcQQ" },
                    { title: "Yoga for Healing", link: "https://www.youtube.com/embed/4C-gxOE0j7s" },
                    { title: "Restorative Stretch Routine", link: "https://www.youtube.com/embed/FyDQljKtWnI" }
                ];
            default:
                return [];
        }

    };

    const generateReport = () => {
        const results = calculateScore();
        const recommendations = generateRecommendations(results.severity);
        const exercises = generateExerciseVideos(results.severity);

        return (
            <div className="mt-4">
                <div className="card shadow-lg">
                    <div className="card-header bg-info text-white text-center">
                        <h4>Assessment Results</h4>
                    </div>
                    <div className="card-body">
                        <p className="text-center"><strong>Total Score:</strong> {results.totalScore}</p>
                        <p className="text-center"><strong>Severity Level:</strong> {results.severity}</p>
                        <p className="text-center"><strong>Functional Difficulty:</strong> {results.difficultyLevel}</p>
                    </div>
                </div>
                <div className="card mt-4 shadow-lg">
                    <div className="card-header bg-success text-white text-center">
                        <h4>Personalized Recommendations</h4>
                    </div>
                    <div className="card-body">
                        <ul>
                            {recommendations.map((tip, index) => (
                                <li key={index} className="mb-2">{tip}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="card mt-4 shadow-lg">
                    <div className="card-header bg-primary text-white text-center">
                        <h4>Exercise Videos</h4>
                    </div>
                    <div className="card-body">
                        <ul>
                            {exercises.map((exercise, index) => (
                                <li key={index} className="mb-3">
                                    <strong>{exercise.title}</strong>
                                    <div className="responsive-iframe-wrapper">
                                        <iframe
                                            className="responsive-iframe"
                                            src={exercise.link}
                                            title={exercise.title}
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <a href="/chatbot" className='nav-link'>
                    <div className='p-3 bg-myblue mt-4 rounded' style={{ cursor: "pointer" }}>
                        <span className='mytitle'>consult online chatbuddy 🔗</span>
                    </div>
                </a>

                <div className="text-center mt-4">
                    <small>
                        Note: This is a screening tool, not a diagnostic instrument. For accurate diagnosis and support, please consult a mental health professional.
                    </small>
                </div>
            </div>
        );
    };



    return (
        <>
            <Patientnav activeName="Mental-Test" />
            <div className="container my-5">
                <h2 className="mb-4 text-center">PHQ-9 Assessment</h2>
                <p className="text-center mb-4">Over the last 2 weeks, how often have you been bothered by any of the following problems?</p>

                {questions.map((question, index) => (
                    <div key={index} className="mb-3">
                        <label className="form-label">{question}</label>
                        <select
                            className="form-select"
                            value={responses[index]}
                            onChange={(e) => handleResponseChange(index, parseInt(e.target.value))}
                        >
                            {Object.entries(frequencyOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                ))}

                <div className="mb-4">
                    <p>If you checked off any problems, how difficult have these problems made it for you?</p>
                    {difficultyLevels.map((level, index) => (
                        <div key={index} className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="difficulty"
                                value={index}
                                checked={difficultyResponse === index}
                                onChange={() => handleDifficultyChange(index)}
                            />
                            <label className="form-check-label">{level}</label>
                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-center mb-4">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowResults(true)}
                    >
                        Check Results
                    </button>
                </div>

                {showResults && generateReport()}
            </div>


        </>
    );
};

export default PHQ9Assessment;

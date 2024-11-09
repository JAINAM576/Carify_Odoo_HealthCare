import React, { useState } from 'react';

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
    const [showResults, setShowResults] = useState(false); // State to control result visibility

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
            potentialMajorDepression: totalScore >= 15, // Criteria for major depression
            potentialOtherDepression: totalScore >= 10 && totalScore < 15 // Criteria for other depression
        };
    };

    const generateReport = () => {
        const results = calculateScore();

        let report = "\nPHQ-9 Assessment Report";
        report += "\n" + "=".repeat(50);

        report += `\n\n<strong>Total Score:</strong> ${results.totalScore}`;
        report += `\n<strong>Severity Level:</strong> ${results.severity}`;
        report += `\n<strong>Functional Difficulty:</strong> ${results.difficultyLevel}`;

        report += "\n\n<strong>Detailed Responses:</strong>";
        questions.forEach((question, index) => {
            report += `\n${index + 1}. ${question}`;
            report += `\n   Response: ${frequencyOptions[responses[index]]}`;
        });

        report += "\n\n<strong>Clinical Considerations:</strong>";
        if (results.potentialMajorDepression) {
            report += "\n- Consider Major Depressive Disorder";
            report += "\n  (5 or more symptoms at 'Nearly every day' including at least one core symptom)";
        } else if (results.potentialOtherDepression) {
            report += "\n- Consider Other Depressive Disorder";
            report += "\n  (2-4 symptoms at 'Nearly every day' including at least one core symptom)";
        }

        report += "\n\nNote: This questionnaire is a screening tool. A definitive diagnosis";
        report += "\nshould be made by a qualified healthcare professional taking into";
        report += "\naccount clinical observation and other relevant information.";

        return report;
    };

    const results = calculateScore();

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">PHQ-9 Assessment</h2>
            <p className="text-center mb-4">Over the last 2 weeks, how often have you been bothered by any of the following problems?</p>

            <div className="mb-4">
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
            </div>

            <div className="mb-4">
                <p className="mb-3">If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?</p>
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
                        <label className="form-check-label">
                            {level}
                        </label>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-center mb-4">
                <button
                    className="btn btn-primary"
                    onClick={() => setShowResults(true)} // Show results when clicked
                >
                    Check Results
                </button>
            </div>

            {showResults && (
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
                        <div className="card-header bg-warning text-dark text-center">
                            <h4>Detailed Report</h4>
                        </div>
                        <div className="card-body">
                            <pre className="p-3" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                <strong style={{ color: '#007bff' }}>Total Score:</strong> <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{results.totalScore}</span>
                                <br />
                                <strong style={{ color: '#007bff' }}>Severity Level:</strong> <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{results.severity}</span>
                                <br />
                                <strong style={{ color: '#007bff' }}>Functional Difficulty:</strong> <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{results.difficultyLevel}</span>
                                <hr />
                                <strong>Detailed Responses:</strong>
                                <ul>
                                    {questions.map((question, index) => (
                                        <li key={index}>
                                            <strong>{index + 1}. {question}</strong>
                                            <br />
                                            Response: <span style={{ color: '#28a745' }}>{frequencyOptions[responses[index]]}</span>
                                        </li>
                                    ))}
                                </ul>
                                <hr />
                                <strong>Clinical Considerations:</strong>
                                {results.potentialMajorDepression ? (
                                    <div style={{ backgroundColor: '#ffcccc', padding: '10px', borderRadius: '5px' }}>
                                        <ul>
                                            <li>- Consider Major Depressive Disorder</li>
                                            <li>(5 or more symptoms at 'Nearly every day' including at least one core symptom)</li>
                                        </ul>
                                    </div>
                                ) : results.potentialOtherDepression ? (
                                    <div style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '5px' }}>
                                        <ul>
                                            <li>- Consider Other Depressive Disorder</li>
                                            <li>(2-4 symptoms at 'Nearly every day' including at least one core symptom)</li>
                                        </ul>
                                    </div>
                                ) : null}
                                <hr />
                                <em style={{ fontSize: '0.9em', color: '#6c757d' }}>
                                    Note: This questionnaire is a screening tool. A definitive diagnosis should be made by a qualified healthcare professional taking into account clinical observation and other relevant information.
                                </em>
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PHQ9Assessment;

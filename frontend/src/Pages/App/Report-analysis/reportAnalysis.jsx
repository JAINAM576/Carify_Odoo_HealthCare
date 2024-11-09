import React, { useState } from "react";
import Patientnav from "../Components/patientnav";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const ReportAnalysis = () => {
    const [file, setFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError("");  // Clear any previous error message
    };

    const handleFileUpload = async () => {
        if (!file) {
            setError("Please upload a PDF file.");
            return;
        }

        setLoading(true);
        setError("");  // Reset any previous errors

        try {
            // Commenting out actual request
            const formData = new FormData();
            formData.append("pdf_file", file);
if (localStorage.getItem("analysis")){
    setAnalysisResult(JSON.parse(localStorage.getItem("analysis")))
    localStorage.removeItem("analysis")
    return ;
}
            const response = await axios.post("http://localhost:8000/reportAnalyze/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log(response)
            setAnalysisResult(response.data.analysis);
            localStorage.setItem("analysis",JSON.stringify(response.data.analysis))

            // Dummy data for testing without backend
            // const dummyData = {
            //     test_results: {
            //         key_findings: ["High cholesterol", "Elevated blood pressure"],
            //         abnormal_values: ["Cholesterol: 250 mg/dL", "Blood Pressure: 145/90 mmHg"],
            //         normal_values: ["Blood Sugar: 90 mg/dL", "Heart Rate: 72 bpm"]
            //     },
            //     health_assessment: {
            //         overall_status: "At Risk",
            //         areas_of_concern: ["Cardiovascular health"],
            //         positive_indicators: ["Normal blood sugar levels", "Regular heart rate"]
            //     },
            //     recommendations: {
            //         immediate_actions: ["Consult a cardiologist"],
            //         follow_up_tests: ["Lipid profile", "Blood pressure monitoring"],
            //         lifestyle_changes: ["Reduce salt intake", "Increase physical activity"]
            //     },
            //     summary: "The report indicates elevated cholesterol and blood pressure, suggesting a need for immediate consultation and lifestyle changes."
            // };

            // setAnalysisResult(dummyData); // Using dummy data
        } catch (error) {
            console.error("Error uploading file:", error);
            setError("Failed to analyze the report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
     <>
    <Patientnav activeName="Report-analysis" />
    <div className="container mt-3">
        <h2 className="mb-3">Report Analysis</h2>

        {/* Error Alert */}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <div className="mb-3">
            <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange} 
                className="form-control"
            />
        </div>
        <button 
            onClick={handleFileUpload} 
            disabled={loading} 
            className="btn btn-primary"
        >
            {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>

        {analysisResult && (
            <div className="analysis-result mt-4">
                <h3>Analysis Result</h3>

                {/* Test Results */}
                <section className="mb-4 mydiv">
                    <h4 className="my-3">📊 Test Results</h4>
                    <div className="row">
                        <div className="col">
                            <p><strong>Key Findings:</strong></p>
                            {analysisResult.test_results.key_findings.length ? (
                                <ul>
                                    {analysisResult.test_results.key_findings.map((finding, index) => (
                                        <li key={index}>{finding}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>None</p>
                            )}
                        </div>
                        <div className="col">
                            <p><strong>Abnormal Values:</strong></p>
                            {analysisResult.test_results.abnormal_values.length ? (
                                <ul>
                                    {analysisResult.test_results.abnormal_values.map((value, index) => (
                                        <li key={index}>⚠️ {value}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>None</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Health Assessment */}
                <section className="mb-4 mydiv">
                    <h4 className="my-3">🏥 Health Assessment</h4>
                    <p><strong>Overall Status:</strong> {analysisResult.health_assessment.overall_status || "Not available"}</p>
                    <p><strong>Areas of Concern:</strong></p>
                    {analysisResult.health_assessment.areas_of_concern.length ? (
                        <ul>
                            {analysisResult.health_assessment.areas_of_concern.map((concern, index) => (
                                <li key={index}>{concern}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>None</p>
                    )}
                </section>

                {/* Recommendations */}
                <section className="mb-4 mydiv">
                    <h4 className="my-3">💡 Recommendations</h4>
                    {['immediate_actions', 'follow_up_tests', 'lifestyle_changes'].map((category, index) => (
                        <div key={index}>
                            <p><strong>{category.replaceAll('_', ' ').replaceAll(/\b\w/g, c => c.toUpperCase())}:</strong></p>
                            {analysisResult.recommendations[category].length ? (
                                <ul>
                                    {analysisResult.recommendations[category].map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>None</p>
                            )}
                        </div>
                    ))}
                </section>

                {/* Summary */}
                <section className="mydiv mb-5">
                    <h4>📜 Summary</h4>
                    <p>{analysisResult.summary || "Summary not available"}</p>
                </section>
            </div>
        )}
    </div>
</>

    );
};

export default ReportAnalysis;

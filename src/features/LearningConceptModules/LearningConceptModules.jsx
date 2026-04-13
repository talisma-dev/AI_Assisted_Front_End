import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Info, FileText, RotateCw, Link, BadgeCheck, PlayCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import { useApp } from "@core/contexts/AppContext";
import { generateCourseContent } from "@api/generateCourseContent";
import SubMicroConcept from "./components/SubMicroConcept/SubMicroConcept";
import Loader from "@shared/components/Loader/Loader";
import "./LearningConceptModules.css";

const LearningConceptModules = ({ onStartAssessment }) => {
  const { performanceData, config } = useApp();
  const { conceptName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const conceptIdFromQuery = searchParams.get('conceptId');

  const [isLoading, setIsLoading] = useState(true);
  const [conceptsList, setConceptsList] = useState([]);
  const [readConcepts, setReadConcepts] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);

  const [fetchError, setFetchError] = useState(null);

  const fetchingRef = useRef(false);
  const lastFetchedNameRef = useRef(null);

  const conceptPerformance = performanceData?.conceptPerformance?.find(c =>
    (conceptIdFromQuery && String(c.id) === String(conceptIdFromQuery)) ||
    (conceptName && c.name.toLowerCase() === decodeURIComponent(conceptName).toLowerCase())
  );

  const allRead = readConcepts.length === conceptsList.length && conceptsList.length > 0;

  useEffect(() => {
    const fetchContent = async () => {
      if (!conceptPerformance?.name) return;
      if (fetchingRef.current || lastFetchedNameRef.current === conceptPerformance.name) return;

      try {
        fetchingRef.current = true;
        setIsLoading(true);
        setFetchError(null);
        const data = await generateCourseContent(conceptPerformance.name);

        lastFetchedNameRef.current = conceptPerformance.name;

        const modules = data.data || [];
        const formattedModules = modules.map((m, idx) => ({
          ...m,
          id: idx + 1,
          title: m.content_heading || `Module ${idx + 1}`,
          summary: m.text || 'Overview of this module'
        }));

        setConceptsList(formattedModules);
      } catch (error) {
        console.error('Failed to fetch concept content:', error);
        setFetchError(error.message || 'Failed to fetch learning content.');
      } finally {
        setIsLoading(false);
        fetchingRef.current = false;
      }
    };

    if (performanceData && conceptPerformance) {
      fetchContent();
    }
  }, [conceptPerformance?.name, performanceData]);

  const handleConceptClick = (concept) => {
    setSelectedConcept(concept);
    if (!readConcepts.includes(concept.id)) {
      setReadConcepts(prev => [...prev, concept.id]);
    }
  };

  const handleStartAssessment = () => {
    if (allRead && onStartAssessment && conceptPerformance) {
      onStartAssessment(conceptPerformance.name || conceptPerformance.id);
    }
  };

  if (!conceptPerformance && !isLoading) {
    return (
      <div className="co-wrapper">
        <div className="co-card" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <h2>Concept not found.</h2>
          <button onClick={() => navigate('/evaluation')} className="btn-continue" style={{ maxWidth: '200px' }}>
            Back to Evaluation
          </button>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <ErrorPage
        error="Learning Material Not Found"
        title="Failed to Load Content"
        message={fetchError}
        onRetry={() => window.location.reload()}
        useModal={true}
      />
    );
  }



  const currentScore = conceptPerformance?.score || 0;
  const currentAttempts = conceptPerformance?.currentAttempts || 0;
  const remainingAttempts = Math.max(0, config.attempts - currentAttempts);

  return (
    <div className="co-wrapper">
      <div className="co-card">
        <div className="co-header">
          <div className="co-header-left">
            <span className="co-label">
              <Info className="co-label-icon" />
              CONCEPT OVERVIEW
            </span>
            <h1 className="co-title">{conceptPerformance?.name || "Loading..."}</h1>
          </div>
          <div className="co-header-right">
            <div className="co-badge">
              <FileText className="co-badge-icon" />
              <span>Current Score: {currentScore}%</span>
            </div>
            <div className="co-badge">
              <RotateCw className="co-badge-icon" />
              <span>Remaining Attempts: {remainingAttempts}</span>
            </div>
          </div>
        </div>

        <div className="co-divider" />
        <section className="co-section co-main-section">
          <h2 className="co-section-title">
            <Link className="co-section-icon" />
            Learning Resources
          </h2>

          <div className="co-resources-box">
            {isLoading ? (
              <Loader
                title="Preparing Learning Content"
                subtitle="Curating your microconcepts..."
                caption="We're analyzing your performance to craft tailored content that supports your progress and goals."
                size="small"
              />
            ) : (
              <div className="co-concepts-loaded">
                <div className="co-concepts-grid">
                  {conceptsList.map((concept) => (
                    <div
                      key={concept.id}
                      className={`co-concept-card ${readConcepts.includes(concept.id) ? 'co-concept-card--read' : ''}`}
                      onClick={() => handleConceptClick(concept)}
                    >
                      <div className="co-concept-icon">
                        <Link className="co-concept-icon-svg" />
                      </div>
                      <div className="co-concept-content">
                        <h3 className="co-concept-title">{concept.title}</h3>
                      </div>
                      <div className="co-concept-arrow">
                        {readConcepts.includes(concept.id) ? (
                          <CheckCircle2 className="co-concept-check-icon" />
                        ) : (
                          <ChevronRight className="co-concept-arrow-svg" />
                        )}
                      </div>
                    </div>
                  ))}
                  {conceptsList.length === 0 && !isLoading && (
                    <div className="co-placeholder-wrapper">
                      <p className="co-placeholder-text">No learning modules available for this concept.</p>
                      <button onClick={() => navigate('/evaluation')} className="co-start-btn co-start-btn--active">BACK TO EVALUATION</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
        <div className="co-divider" />

        <section className="co-section co-assessment-section">
          <div className="co-assessment-content">
            <h2 className="co-section-title co-assessment-title">
              <BadgeCheck className="co-check-icon" />
              Assessment Readiness
              {!isLoading && conceptsList.length > 0 && (
                <span className="co-progress-badge">
                  Read: {readConcepts.length}/{conceptsList.length}
                </span>
              )}
            </h2>
            <p className="co-assessment-text">
              Please go through the concepts provided above before beginning the assessment. <br />
              These materials will help you understand the concepts covered in the quiz.
              Once you have gone through all the concepts, the <strong>"START ASSESSMENT"</strong> button
              will become available.
            </p>
          </div>
          <button
            className={`co-start-btn ${allRead ? "co-start-btn--active" : "co-start-btn--disabled"}`}
            disabled={!allRead}
            onClick={handleStartAssessment}
          >
            <PlayCircle className="co-play-icon" />
            START ASSESSMENT
          </button>
        </section>
      </div>
      {selectedConcept && (
        <SubMicroConcept
          concept={selectedConcept}
          onClose={() => setSelectedConcept(null)}
        />
      )}
    </div>
  );
};

export default LearningConceptModules;

import React, { useState } from 'react';
import { Button, Form, Col } from 'react-bootstrap';
import './Quiz.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import QuizResult from './QuizResult';

const VIEW = {
	START: 'start',
	QUESTIONS: 'questions',
	RESULT: 'result'
}

export default function Quiz(props) {
	const quiz = props.quiz;
	const quizLength = quiz.questions.length;
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [points, setPoints] = useState(Array(quiz.results.length).fill(null));
	const [anwsers, setAnwsers] = useState(Array(quiz.results.length).fill(null));
	const [showFinishWarning, setFinishWarning] = useState(false);
	const [notAnswered, setNotAnswered] = useState(null);
	const [view, setView] = useState(VIEW.QUESTIONS);
	const [validated, setValidated] = useState(false);
	const [name, setName] = useState(false);

	const handleSubmit = (event) => {
		const form = event.currentTarget;
		const notAnswered =  points.findIndex((p) => p === null);
		if(notAnswered >= 0) {
			event.preventDefault();
			event.stopPropagation();
			setNotAnswered(notAnswered + 1);
			setFinishWarning(true);
			if (form.checkValidity() === false) {
				setValidated(true);
			}
		} else if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			setValidated(true);
			setNotAnswered(null);
			setFinishWarning(false);
		} else {
			setView(VIEW.RESULT);
			setName(form.name.value);
		}
	}

	const doQuizAgain = () => {
		setPoints(Array(quiz.results.length).fill(null));
		setAnwsers(Array(quiz.results.length).fill(null));
		setView(VIEW.QUESTIONS);
		setNotAnswered(null);
		setCurrentQuestion(0);
	}

	return (
		<div className="Quiz-window">
			<div className="Quiz-title">
				{quiz.title}
			</div>

			{view === VIEW.RESULT && <QuizResult
				quiz={quiz}
				points={points}
				answers={anwsers}
				doAgain={doQuizAgain}
			/>}

			{view === VIEW.QUESTIONS && <div className="Quiz-questions">
				<div className="Quiz-questions">
					<div className="Quiz-questionContent">
						{quiz.questions[currentQuestion].content}
					</div>
					<div className="Quiz-questionImg">
						<img alt="Vampire bite" src={quiz.questions[currentQuestion].img} height="450" />
					</div>
					<Form className="Quiz-anwsers">
						{quiz.questions[currentQuestion].answers.map((anwser, index) =>
							<Form.Check 
								type="radio"
								label={anwser.text}
								key={index + quiz.questions[currentQuestion].content}
								id={index + quiz.questions[currentQuestion].content}
								name={quiz.questions[currentQuestion].content}
								value={anwser.pointsInto}
								onChange={(evt) => {
									let newArr = [...points];
									newArr[currentQuestion] = evt.currentTarget.value;
									setPoints(newArr);
									let newAnwsers = [...anwsers];
									newAnwsers[currentQuestion] = index;
									setAnwsers(newAnwsers);
								}}
								className="Quiz-questionButtons"
							/>
						)}
					</Form>
				</div>
				<div className="Quiz-controls">
					<Button variant="outline-dark" disabled={currentQuestion + 1 <= 1} onClick={() => setCurrentQuestion(currentQuestion - 1)} >
						<FaArrowLeft /> Pervious
					</Button>
					<div className="Quiz-questionscounter">{`${currentQuestion + 1}/${quizLength}`}</div>
					<Button variant="outline-dark" disabled={currentQuestion + 1 >= quizLength} onClick={() => setCurrentQuestion(currentQuestion + 1)} >
						Next <FaArrowRight />
					</Button>
				</div>
				<div className="Quiz-finishButton">
					<Form className="Quiz-nameForm" noValidate validated={validated} onSubmit={handleSubmit}>
						<Form.Group as={Col} controlId="validationName">
							<Form.Control type="name" placeholder="Enter your name" className="Quiz-name" name="name" required />
							<Form.Control.Feedback type="invalid">
								Please enter your name.
							</Form.Control.Feedback>
						</Form.Group>
						<Button variant="dark" type="submit">
							Finish quiz
						</Button>
					</Form>
					{showFinishWarning && <div>You need to anwser question {notAnswered}.</div>}
				</div>
			</div>}
			
		</div>
	);
}

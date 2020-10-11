import React, { useState } from 'react';
import { Button, Form, Col, Modal, Table } from 'react-bootstrap';
import './Quiz.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import QuizResult from './QuizResult';

const VIEW = {
	START: 'start',
	QUESTIONS: 'questions',
	RESULT: 'result'
}

const API_PATH = 'https://webapipde.azurewebsites.net/api/quiz';

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
	const [resultKey, setResultKey] = useState('');
	const [otherResults, setOtherResults] = useState([]);
	const [showOthers, setShowOthers] = useState(false);

	const countPoints = () => {
		
		const pointsCounter = new Map();
		points.forEach(p => {
			pointsCounter.set(p, pointsCounter.get(p) ? pointsCounter.get(p) + 1 : 1 );
		});
		let resKey;
		let resValue = 0;
		pointsCounter.forEach((value, key) => {
			if (!resKey || value > resValue) {
				resKey = key;
				resValue = value;
			}
		});
		return resKey;
	}

	const parseDate = (dbDate) => {
		const date = new Date(dbDate);
		date.setHours( date.getHours() + 2 );
		return date.toLocaleString();
	}

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
			event.preventDefault();
			event.stopPropagation();
			const resultKey = countPoints();
			setResultKey(resultKey);
			const data = {
				'name': form.name.value,
				'result': resultKey,
				'answsers': anwsers
			}
			fetch(API_PATH, {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
				})
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response.json();
				})
				.then(data => {
					console.log(data.massage);
					setView(VIEW.RESULT);
				})
				.catch(error => console.log(error));
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
			<Button variant="dark" className="Quiz-otherResultsButton" onClick={() => {
				fetch(API_PATH)
					.then(resposne => resposne.json())
					.then(data => {setOtherResults(data); setShowOthers(true)});
			}}>Show other results</Button>
			<div className="Quiz-title">
				{quiz.title}
			</div>

			{view === VIEW.RESULT && <QuizResult
				quiz={quiz}
				points={points}
				answers={anwsers}
				doAgain={doQuizAgain}
				resultKey={resultKey}
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
								defaultChecked={anwsers[currentQuestion] === index}
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
			
			{showOthers && <Modal size="lg" show={showOthers} onHide={() => setShowOthers(false)}>
				<Modal.Header closeButton>
					<Modal.Title>History of results</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Name</th>
								<th>Result</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{[...otherResults].reverse().map((res, index) => 
								<tr key={'row'+index}>
									<td>{res.name}</td>
									<td>{res.result}</td>
									<td>{parseDate(res.time)}</td>
								</tr>
							)}
						</tbody>
					</Table>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowOthers(false)}>Close</Button>
				</Modal.Footer>
			</Modal>}
		</div>
	);
}

import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import './Quiz.css';

export default function QuizResult(props) {
	const [showAnswers, setShowAnswers] = useState(false);

	const { quiz, points, answers } = props;
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

	const result = quiz.results.find(res => res.result === countPoints());

	return <div>
		<div>{result.title}</div>
		<div className="Quiz-questionImg">
			<img alt="Vampire bite" src={result.img} height="450" />
		</div>
		<div className="QuizResult-content">{result.content}</div>

		{!showAnswers && <Button variant="dark" onClick={() => setShowAnswers(true)}>Show answers</Button>}
		{showAnswers && <div className="Quiz-questions">
			Your anwsers:
			{quiz.questions.map((question, questionIndex) => <div key={'question' + questionIndex} className="QuizResult-question">
				<div className="Quiz-questionContent">
					{questionIndex+1}. {question.content}
				</div>
				{question.answers.map((anwser, index) =>
					<div className={answers[questionIndex] === index ? 'QuizResult-anwsers' : 'Quiz-questionButtons'}>{anwser.text}</div>
				)}
			</div>)}
		</div>}
		<Button variant="dark" onClick={() => props.doAgain()}>Start again</Button>
	</div>
}
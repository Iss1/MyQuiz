import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import './Quiz.css';

export default function QuizResult(props) {
	const [showAnswers, setShowAnswers] = useState(false);

	const { quiz, answers, resultKey } = props;
	
	const result = quiz.results.find(res => res.result === resultKey);
	if (!result) {
		return <div></div>
	}

	return <div>
		<div>{result.title}</div>
		<div className="Quiz-questionImg">
			<img alt="Vampire bite" src={result.img} height="450" />
		</div>
		<div className="QuizResult-content">{result.content}</div>

		{!showAnswers && <Button variant="dark" onClick={() => setShowAnswers(true)} style={{marginRight: "15px"}}>Show answers</Button>}
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
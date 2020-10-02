import React from 'react';
import './App.css';
import Quiz from './containers/Quiz/Quiz'
import 'bootstrap/dist/css/bootstrap.min.css';

const QUIZ = {
	title: 'Vampire Masquerade Clan Quiz',
	img: '',
	questions: [
		{
			content: 'What would you bite the victim on?',
			answers: [
				{
					text: 'Ass.',
					pointsInto: 'gay',
				},
				{
					text: 'Own arm.',
					pointsInto: 'emo',
				},
				{
					text: 'Why?',
					pointsInto: 'emo',
				},
			],
			img: 'https://cdna.artstation.com/p/assets/images/images/007/867/444/medium/denis-saltan-vampire-bite.jpg?1509024093'
		},
		{
			content: 'What color of your robes would you wear?',
			answers: [
				{
					text: 'Pink.',
					pointsInto: 'gay',
				},
				{
					text: 'Black.',
					pointsInto: 'emo',
				},
				{
					text: 'White.',
					pointsInto: 'emo',
				},
				{
					text: 'Yellow.',
					pointsInto: 'gay',
				},
			],
			img: 'https://thumbs.dreamstime.com/b/%D0%BF%D0%B5%D1%87%D0%B0%D1%82%D1%8C-156761315.jpg'
		},
	],
	results: [
		{
			result: 'gay',
			title: 'Gay Clan',
			content: 'Congratulation! You are best suited to the Gay clan.',
			img: 'https://i.imgur.com/qDLTI0H.png',
		},
		{
			result: 'emo',
			title: 'Emo Clan',
			content: 'Congratulation! You are best suited to the Emo clan.',
			img: 'https://www.picclickimg.com/d/l400/pict/152962765276_/Wierd-Creepy-Evil-Emo-Vampire-Dolls-Ooak-Gothic.jpg',
		},
	]
}

function App() {
	return (
		<div className="App">
			{/* <header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header> */}
			<div className="App-main">
				<Quiz quiz={QUIZ} />
			</div>
		</div>
	);
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} x-custom={props.customAttr}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            customAttr={i}
        />;
    }

    renderSquaresInRow(rowNum) {
        var squares = []
        for (var i = 0; i < 3; i++) {
            squares.push(this.renderSquare(rowNum * 3 + i));
        }
        return squares;
    }

    renderRows() {
        const rows = Array(3).fill(null).map((step, _) => {
            return (
                <div className="board-row">
                    {this.renderSquaresInRow(_)}
                </div>)
        });

        return (
            <div>
                { rows }
            </div>);
    }

    render() {
        return (
            <div>
                {this.renderRows()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                move: ""
            }],
            stepNumber: 0,
            xIsNext: true
        }
    }

    moves = {
        0: "1:1",
        1: "1:2",
        2: "1:3",
        3: "2:1",
        4: "2:2",
        5: "2:3",
        6: "3:1",
        7: "3:2",
        8: "3:3",
    };

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? "X" : "O";

        this.setState({
            history: history.concat([{
                squares: squares,
                move: this.moves[i]
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;
        if (winner) {
            status = "Winner " + winner;
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? "X" : "O");
        }

        const moves = history.map((step, move) => {
            const description = move ? "Goto move #" + move : "Goto game start";
            return (
                <li key={move} className={(move === this.state.stepNumber ? 'bold' : '')}>
                    <button onClick={() => this.jumpTo(move)}>{description} {step.move} </button>
                </li>
            );
        });


        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);  
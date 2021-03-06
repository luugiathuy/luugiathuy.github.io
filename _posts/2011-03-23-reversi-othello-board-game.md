---
layout: post
title: Reversi (Othello) Game
description:
  A Reversi (Othello) Game with AI written in Java using Negascout algorithm. Reversi (Othello) is a board game (board size of 8x8) played by two players.
categories:
- Game
- Java
tags:
- board game
- game
- othello
- reversi
published: true
---

Reversi (Othello) is a board game (board size of 8x8) played by two players. Each player tries to turn the other's pieces to his/her own pieces. In the end the player which has more pieces on the board is the winner. You can find the detail rules on [Wikipedia][ReversiWikipedia].

The strategy I implemented for this game is based on [this website][ReversiBasicStrategy]. It is quite simple as I assign a specific value for all positions of the board as the image below:

![Board value](/images/board6.gif)

For searching the optimal move, I have used [Negascout][NegascoutWikipedia] algorithm. This can be faster than alpha-beta prunning algorithm.

```java
public MoveScore abNegascout(char[][] board, int ply, int alpha, int beta, char piece) {
  char oppPiece = (piece == Reversi.sBLACK_PIECE) ? Reversi.sWHITE_PIECE : Reversi.sBLACK_PIECE;

  // Check if we have done recursing
  if (ply == mMaxPly){
        return new MoveScore(null, Evaluation.evaluateBoard(board, piece, oppPiece));
    }

  int currentScore;
  int bestScore = -INFINITY;
  MoveCoord bestMove = null;
  int adaptiveBeta = beta;  // Keep track the test window value

  // Generates all possible moves
  ArrayList<MoveCoord> moveList = Evaluation.genPriorityMoves(board, piece);
  if (moveList.isEmpty())
    return new MoveScore(null, bestScore);
  bestMove = moveList.get(0);

  // Go through each move
  for(int i = 0; i < moveList.size(); ++i){
    MoveCoord move = moveList.get(i);
    char[][] newBoard = new char[8][8];
    for (int r = 0; r < 8; ++r)
      for (int c = 0; c < 8; ++c)
        newBoard[r][c] = board[r][c];
    Reversi.effectMove(newBoard, piece, move.getRow(), move.getCol());

    // Recurse
    MoveScore current = abNegascout(newBoard, ply + 1, -adaptiveBeta, -Math.max(alpha,bestScore), oppPiece);

    currentScore = -current.getScore();

    // Update bestScore
    if (currentScore > bestScore){
      // if in 'narrow-mode' then widen and do a regular AB negamax search
      if (adaptiveBeta == beta || ply >= (mMaxPly - 2)) {
        bestScore = currentScore;
      bestMove = move;
      } else { // otherwise, we can do a Test
        current = abNegascout(newBoard, ply + 1, -beta, -currentScore, oppPiece);
        bestScore = -current.getScore();
        bestMove = move;
      }

      // If we are outside the bounds, the prune: exit immediately
        if(bestScore >= beta) {
          return new MoveScore(bestMove,bestScore);
        }

        // Otherwise, update the window location
        adaptiveBeta = Math.max(alpha, bestScore) + 1;
    }
  }
  return new MoveScore(bestMove,bestScore);
}
```

- - -

Here is the [Reversi.jar](/files/Reversi.jar) file which you can download and play with the AI. It's hard to beat it =P. You can download the source code of the game at [my GitHub][ReversiGitHub]. 

Hope you enjoy it!

[ReversiWikipedia]: http://en.wikipedia.org/wiki/Reversi/Othello
[ReversiBasicStrategy]: http://www.site-constructor.com/othello/Present/Basic_Strategy.html
[NegascoutWikipedia]: http://en.wikipedia.org/wiki/Negascout
[ReversiGitHub]: https://github.com/luugiathuy/ReversiGame

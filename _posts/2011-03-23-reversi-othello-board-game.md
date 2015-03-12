---
layout: post
title: Reversi (Othello) Game
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

Reversi (Othello) is a board game (board size of 8x8) played by two players. Each player tries to turn the other's pieces to his/her own pieces. In the end the player which has more pieces on the board is the winner. You can find the detail rules on [Wikipedia][ReversiWikipedia]{:target="_blank"}

The strategy I implemented for this game is based on [this website][ReversiBasicStrategy]{:target="_blank"}.<!-- more --> It is quite simple as I assign a specific value for all positions of the board as the image below:

![Board value](/images/board6.gif)

Here is the game you can play with the computer =D. It's quite hard to beat it.
<script type="text/javascript" src="http://www.java.com/js/deployJava.js"></script>
<script type="text/javascript">
  var attributes = {code:'com.luugiathuy.games.reversi.ReversiApplet.class',width:560, height:500};var parameters = {jnlp_href:'http://luugiathuy.com/projects/games/reversi/Reversi.jnlp'};var version = '1.6';deployJava.runApplet(attributes, parameters, version);
</script>
<noscript>This page requires JavaScript.</noscript>
<script type="text/javascript" src="http://www.oracle.com/ocom/groups/systemobject/@mktg_admin/documents/systemobject/s_code_download.js" language="JavaScript"></script><script type="text/javascript" src="http://www.oracle.com/ocom/groups/systemobject/@mktg_admin/documents/systemobject/s_code.js" language="JavaScript">
</script>
<script type="text/javascript" language="javascript">
  var s_code = s.t();
  if (s_code) document.write(s_code);
</script>

For searching the optimal move, I have used [Negascout][NegascoutWikipedia]{:target="_blank"} algorithm. This can be faster than alpha-beta prunning algorithm.

{% highlight java %}
public MoveScore abNegascout(char[][] board, int ply, int alpha, int beta, char piece) {
  char oppPiece = (piece == Reversi.sBLACK_PIECE) ? Reversi.sWHITE_PIECE : Reversi.sBLACK_PIECE;

  // Check if we have done recursing
  if (ply==mMaxPly){
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
  for(int i = 0; i < moveList.size(); i++){
    MoveCoord move = moveList.get(i);
    char[][] newBoard = new char[8][8];
    for (int r = 0; r < 8; ++r)
      for (int c = 0; c < 8; ++c)
        newBoard[r][c] = board[r][c];
    Reversi.effectMove(newBoard, piece, move.getRow(), move.getCol());

    // Recurse
    MoveScore current = abNegascout(newBoard, ply+1, -adaptiveBeta, - Math.max(alpha,bestScore), oppPiece);

    currentScore = - current.getScore();

    // Update bestScore
    if (currentScore>bestScore){
      // if in 'narrow-mode' then widen and do a regular AB negamax search
      if (adaptiveBeta == beta || ply>=(mMaxPly-2)) {
        bestScore = currentScore;
      bestMove = move;
      } else { // otherwise, we can do a Test
        current = abNegascout(newBoard, ply+1, -beta, -currentScore, oppPiece);
        bestScore = - current.getScore();
        bestMove = move;
      }

      // If we are outside the bounds, the prune: exit immediately
        if(bestScore>=beta) {
          return new MoveScore(bestMove,bestScore);
        }

        // Otherwise, update the window location
        adaptiveBeta = Math.max(alpha, bestScore) + 1;
    }
  }
  return new MoveScore(bestMove,bestScore);
}
{% endhighlight %}

You can download the source code of the game at [my GitHub][ReversiGitHub]{:target="_blank"}. Hope you enjoy it! =D

[ReversiWikipedia]: http://en.wikipedia.org/wiki/Reversi/Othello
[ReversiBasicStrategy]: http://www.site-constructor.com/othello/Present/Basic_Strategy.html
[NegascoutWikipedia]: http://en.wikipedia.org/wiki/Negascout
[ReversiGitHub]: https://github.com/luugiathuy/ReversiGame

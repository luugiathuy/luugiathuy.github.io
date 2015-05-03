---
layout: post
title: Legal Move Checking in Go Game
description:
categories:
- Scala
tags:
- scala
- go game
published: true
---

Last month I attended two coding dojo sessions in
[Singapore Scala Programmers](http://www.meetup.com/Singapore-Scala-Programmers)
group. We had a kata for writing a Go Game program that can determine whether a
move is legal. In this post I will share with you my implementation of the Go's
board as well as the move checking. To understand about Go Game as well as its
rule, you can read it on [Wikipedia](http://en.wikipedia.org/wiki/Go_(game)) or
the kata's description on [GitHub](https://github.com/luugiathuy)

## Piece

```scala
sealed abstract class Piece {
  val opponentPiece: Piece = Empty
}

case object Empty extends Piece

case object BlackPiece extends Piece {
  override val opponentPiece = WhitePiece
}

case object WhitePiece extends Piece {
  override val opponentPiece = BlackPiece
}
```

I defined an abstract `Piece` class with 3 case objects: `Empty` (for
representing unoccupied positions), `BlackPiece` and `WhitePiece`. These classes
all have `opponentPiece` function, but mostly used by BlackPiece and WhitePiece
to get each other piece.

## Move

```scala
case class Move(x: Int, y: Int, piece: Piece) {
  require(piece != Empty, "Invalid Piece, only BlackPiece or WhitePiece")
}
```

The `Move` class's constructor has 3 paramters, `x` and `y` represent the
row and column coordinate on the board respectively, `piece` represents which
player plays the move. Note that `piece` cannot be an `Empty` type.

## GoGame

With `Piece` and `Move` classes above, I wrote a `GoGameDef` trait which defines
logics of a go game:

```scala
trait GoGameDef {

  val rowCount: Int
  val colCount: Int

  type Positions = Vector[Vector[Piece]]

  /**
   * Board class holds the state of all positions of the board
   */
  case class Board(positions: Positions = Vector.fill(rowCount, colCount)(Empty),
                   nextPiece: Piece = BlackPiece) {
    require(positions.length == rowCount && positions.head.length == colCount,
      "Invalid positions length")
  }

  /**
   * A record of boards of the game.
   * The Stream.head is the current board
   */
  type BoardRecord = Stream[Board]

  def isLegalMove(move: Move, boardRecord: BoardRecord): Boolean = ???
```

`rowCount` and `colCount` are for defining the size of the board. A standard Go
board has the size of 19&times;19. 13&times;13 and 9&times;9 boards are popular choices to teach beginners.



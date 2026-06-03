import unittest

from backend.game_engine import (
    Game,
    calculate_turn_result,
    is_double_out,
    is_valid_dart_notation,
    score_dart,
    score_turn,
    validate_turn_darts,
)


class TestGameEngine(unittest.TestCase):
    def test_normal_scoring(self) -> None:
        game = Game.create_game(["Alice", "Bob"])
        game.start_game()

        turn = game.submit_turn(["T20", "T20", "T20"])

        self.assertEqual(turn.score, 180)
        self.assertEqual(game.players[0].score, 321)
        self.assertEqual(game.get_current_player().name, "Bob")

    def test_bust_scoring(self) -> None:
        game = Game.create_game(["Alice", "Bob"])
        game.start_game()
        game.players[0].score = 40

        turn = game.submit_turn(["T20"])

        self.assertTrue(turn.bust)
        self.assertEqual(game.players[0].score, 40)
        self.assertEqual(game.get_current_player().name, "Bob")

    def test_double_out_checkout(self) -> None:
        game = Game.create_game(["Alice", "Bob"])
        game.start_game()
        game.players[0].score = 40

        turn = game.submit_turn(["D20"])

        self.assertTrue(turn.checkout)
        self.assertEqual(game.check_winner().name, "Alice")
        self.assertEqual(game.players[0].score, 0)

    def test_undo_last_turn(self) -> None:
        game = Game.create_game(["Alice", "Bob"])
        game.start_game()

        game.submit_turn(["T20", "T20", "T20"])
        self.assertEqual(game.players[0].score, 321)

        turn = game.undo_last_turn()
        self.assertEqual(turn.player_name, "Alice")
        self.assertEqual(game.players[0].score, 501)
        self.assertEqual(game.get_current_player().name, "Alice")
        self.assertIsNone(game.check_winner())

    def test_winner_detection(self) -> None:
        game = Game.create_game(["Alice", "Bob"])
        game.start_game()
        game.players[0].score = 40

        game.submit_turn(["D20"])

        self.assertEqual(game.check_winner().name, "Alice")

    def test_player_rotation(self) -> None:
        game = Game.create_game(["Alice", "Bob", "Charlie"])
        game.start_game()

        self.assertEqual(game.get_current_player().name, "Alice")
        game.submit_turn(["S20"])
        self.assertEqual(game.get_current_player().name, "Bob")
        game.submit_turn(["S20"])
        self.assertEqual(game.get_current_player().name, "Charlie")
        game.submit_turn(["S20"])
        self.assertEqual(game.get_current_player().name, "Alice")

    def test_dart_notation_parsing(self) -> None:
        expected_scores = {"SBULL": 25, "DBULL": 50, "MISS": 0}

        for notation in expected_scores:
            self.assertTrue(is_valid_dart_notation(notation))
            self.assertEqual(score_dart(notation), expected_scores[notation])

        for prefix, multiplier in [("S", 1), ("D", 2), ("T", 3)]:
            for value in range(1, 21):
                notation = f"{prefix}{value}"
                self.assertTrue(is_valid_dart_notation(notation), msg=notation)
                self.assertEqual(score_dart(notation), multiplier * value)

        self.assertTrue(validate_turn_darts(["S20", "T20", "D20"]))
        self.assertEqual(score_turn(["S20", "T20", "D20"]), 120)

    def test_invalid_notations_raise(self) -> None:
        invalid_examples = ["X20", "D21", "T0", "S25", "SBUL", "DBUL", "D", "", "Q10"]

        for notation in invalid_examples:
            with self.assertRaises(ValueError, msg=notation):
                score_dart(notation)

        with self.assertRaises(ValueError):
            score_turn(["S20", "X20"])

        with self.assertRaises(ValueError):
            calculate_turn_result(301, ["D21"])


if __name__ == "__main__":
    unittest.main()

import styles from "../styles/Home.module.css";
import { ReactElement, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Ball from "../components/Game/Ball";
import PlayerPaddle from "../components/Game/PlayerPaddle";
import ComputerPaddle from "../components/Game/ComputerPaddle";
import Score from "../components/Game/Score";
import { InGameLayout } from "../layouts/inGameLayout";

const Pong = () => {
  const computerLvl = 3; // peut aller de 1 a 3 EASY MEDIUM HARD

  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  function updateScore(winner: string) {
    if (winner === "player") setPlayerScore((prevState) => prevState + 1);
    if (winner === "opponent") setOpponentScore((prevState) => prevState + 1);
  }

  return (
    <>
      <div className={styles.mainLayout_left_background} />
      <div className={styles.mainLayout_right_background} />
<<<<<<< HEAD
      <Score player={playerScore} opponent={opponentScore} />
      <Ball updateScore={updateScore} />
=======
       <Score player={sessionContext.userSelf.login42}
        opponent={Array.isArray(router.query) ? router.query[0] : router.query} />
      {/* <Ball updateScore={updateScore} /> 
>>>>>>> c44188e... restore the test feature to add users manually
      <PlayerPaddle />
      <ComputerPaddle computerLvl={computerLvl} /> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(Pong), {
  ssr: false,
});

Pong.getLayout = function getLayout(page: ReactElement) {
  return <InGameLayout>{page}</InGameLayout>;
};

import styles from "../styles/Home.module.css";
import { ReactElement, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Ball from "../components/Game/PVP/Ball";
import PlayerPaddle from "../components/Game/PVP/PlayerPaddle";
import OpponentPaddle from "../components/Game/PVP/OpponentPaddle";
import Score from "../components/Game/PVP/Score";
import { InGameLayout } from "../layouts/inGameLayout";
import { useRouter } from "next/router";
import { useSessionContext } from "../context/SessionContext";
import { io, Socket } from "socket.io-client";
import getConfig from "next/config";
import { Login42 } from "../interfaces/status.types";
import userService from "../services/user";
import { useErrorContext } from "../context/ErrorContext";
import { errorHandler } from "../errors/errorHandler";
import { IUserSlim } from "../interfaces/IUser";

const { publicRuntimeConfig } = getConfig();

const PlayerVsPlayer = () => {
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const gameSocket = useRef<Socket>();
  const gameID = useRef("");
  const player1 = useRef("");
  const player2 = useRef("");
  const invert = useRef(0);

  const sessionContext = useSessionContext();
  const { userLogin42, opponentLogin42 } = useRouter().query;

  const secondMount = useRef(false);
  const [gameReady, setGameReady] = useState(false);
  const [winnerUsername, setWinnerUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (gameSocket.current === undefined) {
      gameSocket.current = io(
        `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}/game`,
        { transports: ["websocket"] }
      );

      gameSocket.current.emit(
        "game:enter",
        Array.isArray(userLogin42) ? userLogin42[0] : userLogin42,
        Array.isArray(opponentLogin42) ? opponentLogin42[0] : opponentLogin42,
        sessionContext.userSelf.login42
      );

      gameSocket.current.on(
        "game:init",
        (
          newGameID: string,
          p1: Login42,
          p2: Login42,
          p1Score: number,
          p2Score: number
        ) => {
          gameID.current = newGameID;

          if (p2 === sessionContext.userSelf.login42) {
            player1.current = p2;
            player2.current = p1;
            invert.current = -1;
          } else {
            player1.current = p1;
            player2.current = p2;
            invert.current = 1;
          }

          if (
            p1 === sessionContext.userSelf.login42 ||
            p2 === sessionContext.userSelf.login42
          ) {
            gameSocket.current?.emit("game:new-point", gameID.current);
          }

          setPlayerScore(p1Score);
          undefined;
          setOpponentScore(p2Score);
          setGameReady(true);
        }
      );

      gameSocket.current.on("game:update-score", (login42: Login42) => {
        if (login42 === player2.current) {
          setPlayerScore((prevState) => prevState + 1);
        } else if (login42 === player1.current) {
          setOpponentScore((prevState) => prevState + 1);
        }
        setTimeout(() => {
          gameSocket.current?.emit("game:new-point", gameID.current);
        }, 2000);
      });

      gameSocket.current.on("game:winner", (login42: Login42) => {
        router.push("/");
      });
    }

    return () => {
      // edit unmounting logic for spectating and multiple windows on game
      if (secondMount.current !== true) {
        secondMount.current = true; 
        document.body.style.overflow = "hidden";
      } else {
        if (gameSocket.current != undefined) {
          gameSocket.current.emit(
            "game:unmount",
            gameID.current,
            sessionContext.userSelf.login42
          );
          gameSocket.current.removeAllListeners();
        }
      }
    };
  }, []);

  if (gameSocket.current === undefined || gameReady === false) {
    return (
      <div className={styles.mainLayout_background}>
        <Score player={playerScore} opponent={playerScore} />
      </div>
    );
  }
  return (
    <div className={styles.mainLayout_background}>
      {winnerUsername !== "" && (
        <div className={styles.play}>Well played {winnerUsername}</div>
      )}
      <Score player={playerScore} opponent={opponentScore} />
      <Ball gameSocket={gameSocket.current} gameID={gameID.current} />
      <PlayerPaddle
        gameSocket={gameSocket.current}
        gameID={gameID.current}
        player1={player1.current}
      />
      <OpponentPaddle
        gameSocket={gameSocket.current}
        player2={player2.current}
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(PlayerVsPlayer), {
  ssr: false,
});

PlayerVsPlayer.getLayout = function getLayout(page: ReactElement) {
  return <InGameLayout>{page}</InGameLayout>;
};

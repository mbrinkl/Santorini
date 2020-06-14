import React from "react";
import classNames from "classnames";
import { Button } from "../Button";
import { useStoreState } from "../../store";
import { characterList } from "../../game/character"
import { useBoardContext } from "../GameBoard/BoardContext";
import "./style.scss";

export const CharacterBox: React.FC<{ name: string }> = ({ name }) => {
    
    const { moves } = useBoardContext();
    
    const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
    let playerID=String(activeRoomPlayer?.playerID)

    function select()
    {
        moves.SetChar(playerID, name);
    }

    return (
        <div className={classNames(
            "characterBox",
            name,
          )}
            onClick={select}>
            <span>{name}</span>
                
        </div>
    )
}

export const SelectedCharacterBox: React.FC<{ name: string, playerID: string }> = ({ name, playerID }) => {
    
    const { State } = useBoardContext();

    return (
        <div className={classNames(
            "characterBox",
            name,
            State.players[playerID].ready ? "checked" : ""
          )}>
            <span>{name}</span>
        </div>
    )
}

export const CharacterSelect = () => {

    const { State, moves } = useBoardContext();

    const roomMetadata = useStoreState((s) => s.roomMetadata);
    const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
    let playerID = String(activeRoomPlayer?.playerID)


    return (
        <div className="characterSelect">
            
            <h1>Select a Character</h1>

            <div className="characters">
            {characterList.map( character => 
                <CharacterBox name={character} />
            )}
            </div>

            <div className="selectedCharacters">
                <div className="char1selection">
                    <span>{roomMetadata?.players[0].name}</span>
                    <SelectedCharacterBox name={State.players['0'].char.name} playerID='0' />
                    <span>
                        {State.players['0'].char.name === "Random" ? 
                            "Random" : 
                            State.players['0'].char.desc}
                    </span>
                </div>
                <div className="char2selection">
                    <span>{roomMetadata?.players[1].name}</span>
                    <SelectedCharacterBox name={State.players['1'].char.name} playerID='1' />
                    <span>
                        {State.players['1'].char.name === "Random" ? 
                            "Random" : 
                            State.players['1'].char.desc}
                    </span>
                </div>
            </div>

            {
                State.players[playerID].ready ?

                <Button
                    theme="red"
                    className="button"
                    onClick={() => {moves.CancelReady(playerID)}}
                >
                    Cancel
                </Button>

                :

                <Button
                    theme="green"
                    className="button"
                    onClick={() => {moves.Ready(playerID)}}
                >
                    Ready
                </Button>
            }

        </div>
    );
}
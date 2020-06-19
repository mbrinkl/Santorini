import { Mortal, Character } from '../character'
import { get_adjacent_positions } from '../utility'
import { GameState, Player } from '../index'
import { Board } from '../space'
import { Ctx } from 'boardgame.io';

export class Hephaestus extends Mortal {

  public static desc = `Your Build: Your Worker may build one additional block (not dome) on top of your first block.`;
  public static buttonText = 'Skip 2nd Build';
  public static attributes: any = {
    numBuilds: 0,
    firstBuildPos: -1,
  };

  public static buttonPressed(
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character
  ) : void {
    // reset stuff
    char.attributes.numBuilds = 0;
    char.buttonActive = false;
  
    // set game stage
    G.stage = 'end';
    G.canEndTurn = true;
  }


  public static valid_build(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    originalPos: number
  ) : number[] {
    let adjacents : number[] = get_adjacent_positions(originalPos);
    let valids : number[] = []
  
    if (char.attributes.numBuilds === 0) {
      adjacents.forEach( pos => {
        if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed) {
          valids.push(pos);
        }
      })
    }
    else {
      valids.push(char.attributes.firstBuildPos);
    }
  
    return valids;
  }

  public static build (
    G: GameState,
    ctx: Ctx,
    player: Player, 
    char: Character,
    pos: number
  ) : string { 

    char.attributes.numBuilds++;

    if (char.attributes.numBuilds === 1) {
      
      Board.build(G, pos);

      if (G.spaces[pos].height > 2) {
        char.attributes.numBuilds = 0;
        return 'end';
      }
      else {
        char.attributes.firstBuildPos = pos;
        char.buttonActive = true;
        return 'build';
      }
    }
    else {
      char.attributes.numBuilds = 0;
      char.buttonActive = false;
      Board.build(G, pos);
      return 'end'
    }
  }
}
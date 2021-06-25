/**
 * Barebones API client for mygarage.games, a fanmade community for Game Builder Garage
 * Currently just fetches user info since that's all I needed
 * 
 * Ref:
 *  https://api.mygarage.games/docs/
 */

import { gbgIdFormat, gbgIdIsOnline, gbgIdIsProgrammer } from './gbgId';
import { promiseWithTimeout } from './promises';
import { GameFile } from '../formats';

const API_BASE = 'https://api.mygarage.games/';
const API_TIMEOUT = 5000;

export interface MyGarageGamesError {
  name: string;
  text: string;
};

export interface MyGarageGamesUser {
  avatarFileName: string,
  banActive: any,
  banReason: any,
  comments: any[],
  createdAt: string,
  games: any[],
  id: number,
  ingameID: string,
  playlists: any[],
  pronouns: any,
  roles: string[],
  socialDiscord: string | null,
  socialTwitter: string | null,
  socialYouTube: string | null,
  updatedAt: string,
  username: string,
};

export interface MyGarageGamesGame {
  id: number;
};

async function get<T>(route: string) {
  try {
    const response = await fetch(API_BASE + route);
    if (response.ok && response.status === 200) {
      return await response.json() as T;
    }
    else if (response.status === 404) {
      const message = await response.json() as MyGarageGamesError;
      return Promise.reject(`MyGarage.games API error ${ message.name }: ${ message.text }`);
    }
    else {
      return Promise.reject(response.statusText);
    }
  }
  catch (e) {
    return Promise.reject(e.message);
  }
}

// mygarage.games expects IDs to be formatted with dashes
const formatId = (id: string) => gbgIdFormat(id, '-');

export const mggGetUser = async (userId: string) => await get<MyGarageGamesUser>(`v1/users/${ formatId(userId) }`);

export const mggGetGame = async (gameId: string) => await get<MyGarageGamesGame>(`v1/games/${ formatId(gameId) }`);

export const mggGetUserMatchingGameFile = async (game: GameFile) => {
  try  {
    if (gbgIdIsOnline(game.meta.authorId))
      return await mggGetUser(game.meta.authorId);
    return null;
  }
  catch (e) {
    return null;
  }
}

export const mggGetGameMatchingGameFile = async (game: GameFile) => {
  try {
    if (gbgIdIsOnline(game.meta.gameId))
      return await mggGetGame(game.meta.gameId);
    else if (gbgIdIsOnline(game.meta.originId))
      return await mggGetGame(game.meta.originId);
    return null;
  }
  catch (e) {
    return null;
  }
}

export const mggGetUserUrl = (user: MyGarageGamesUser) => `https://mygarage.games/user/${ user.id }`;

export const mggGetGameUrl = (game: MyGarageGamesGame) => `https://mygarage.games/game/${ game.id }`;
import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { devtools } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { ExtractState } from "../@types/zustand";

type TokenData = {
  userId: string;
};

type AuthStore = {
  accessToken: string | undefined;
  accessTokenData: TokenData | undefined;

  actions: {
    setAccessToken: (accessToken: string | undefined) => void;
    clearTokens: () => void;
  };
};

export const decodeAccessToken = (accessToken: string) => jwtDecode<TokenData>(accessToken);

const authStore = createStore<AuthStore>()(
  devtools(
    (set) => ({
      accessToken: undefined,
      accessTokenData: undefined,
      actions: {
        setAccessToken: (accessToken: string | undefined) => {
          const accessTokenData = (() => {
            try {
              return accessToken ? decodeAccessToken(accessToken) : undefined;
            } catch (error) {
              console.error(error);
              return undefined;
            }
          })();
          set({
            accessToken,
            accessTokenData
          });
        },
        clearTokens: () =>
          set({
            accessToken: undefined,
            accessTokenData: undefined
          })
      }
    }),
    {
      name: "auth-store",
      enabled: process.env.NODE_ENV !== "production"
    }
  )
);

type Params<U> = Parameters<typeof useStore<typeof authStore, U>>;

// Selectors
const accessTokenSelector = (state: ExtractState<typeof authStore>) => state.accessToken;
const accessTokenDataSelector = (state: ExtractState<typeof authStore>) => state.accessTokenData;
const actionsSelector = (state: ExtractState<typeof authStore>) => state.actions;

// getters
export const getAccessToken = () => accessTokenSelector(authStore.getState());
export const getAccessTokenData = () => accessTokenDataSelector(authStore.getState());
export const getActions = () => actionsSelector(authStore.getState());

function useAuthStore<U>(selector: Params<U>[1], equalityFn?: Params<U>[2]) {
  return useStoreWithEqualityFn(authStore, selector, equalityFn);
}

// Hooks
export const useAccessToken = () => useAuthStore(accessTokenSelector);
export const useAccessTokenData = () => useAuthStore(accessTokenDataSelector);
export const useActions = () => useAuthStore(actionsSelector);
